import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { UserRole, LeadStatus, LeadSource } from '../constants';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';
  await mongoose.connect(uri);

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: 'admin123',
    role: UserRole.ADMIN,
  });

  await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.com',
    password: 'sales123',
    role: UserRole.SALES,
  });

  const sampleLeads = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.INSTAGRAM },
    { name: 'Priya Patel', email: 'priya@example.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE },
    { name: 'Alex Johnson', email: 'alex@example.com', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL },
    { name: 'Sneha Reddy', email: 'sneha@example.com', status: LeadStatus.LOST, source: LeadSource.WEBSITE },
    { name: 'Michael Chen', email: 'michael@example.com', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL },
  ];

  for (const lead of sampleLeads) {
    await Lead.create({ ...lead, createdBy: admin._id });
  }

  console.log('Seed completed!');
  console.log('Admin: admin@smartleads.com / admin123');
  console.log('Sales: sales@smartleads.com / sales123');
  console.log(`Created ${sampleLeads.length} sample leads`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
