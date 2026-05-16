import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app';
import { LeadSource, LeadStatus, UserRole } from '../constants';

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
}, 30_000);

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('Smart Leads API', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('registers users as sales even when admin role is sent', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe(UserRole.SALES);
  });

  it('logs in and returns a token', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('creates leads and applies combined filters', async () => {
    const register = await request(app).post('/api/auth/register').send({
      name: 'Sales Rep',
      email: 'sales@test.com',
      password: 'password123',
    });
    const token = register.body.data.token as string;

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.INSTAGRAM,
      });

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Other Lead',
        email: 'other@example.com',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
      });

    const filtered = await request(app)
      .get('/api/leads')
      .query({ status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM, search: 'Rahul' })
      .set('Authorization', `Bearer ${token}`);

    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.data[0].name).toBe('Rahul Sharma');
    expect(filtered.body.pagination.limit).toBe(10);
  });

  it('blocks sales users from deleting leads', async () => {
    const register = await request(app).post('/api/auth/register').send({
      name: 'Sales Only',
      email: 'salesonly@test.com',
      password: 'password123',
    });
    const token = register.body.data.token as string;

    const created = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Delete Me',
        email: 'delete@example.com',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
      });

    const del = await request(app)
      .delete(`/api/leads/${created.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(del.status).toBe(403);
  });

  it('returns 401 for invalid bearer tokens', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });
});
