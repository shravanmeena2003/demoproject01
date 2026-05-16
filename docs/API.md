# Smart Leads Dashboard — API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All lead endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

### Register

`POST /auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response (201)**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
}
```

### Login

`POST /auth/login`

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Get Current User

`GET /auth/me` — requires authentication

---

## Leads

### List Leads (with filters & pagination)

`GET /leads`

| Query       | Type   | Description                          |
|-------------|--------|--------------------------------------|
| status      | enum   | New, Contacted, Qualified, Lost      |
| source      | enum   | Website, Instagram, Referral         |
| search      | string | Search name or email                 |
| sort        | enum   | latest (default), oldest               |
| page        | number | Page number (default: 1)             |
| limit       | number | Items per page (default: 10, max: 50)|

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1`

**Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "...",
      "createdAt": "2026-05-16T10:00:00.000Z",
      "updatedAt": "2026-05-16T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Lead Stats

`GET /leads/stats`

### Export Leads (CSV)

`GET /leads/export` — same query params as list (filters apply)

Returns `text/csv` with filename `leads-export-<timestamp>.csv`

### Get Single Lead

`GET /leads/:id`

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

### Update Lead

`PATCH /leads/:id`

### Delete Lead (Admin only)

`DELETE /leads/:id`

---

## Roles

| Role        | Permissions                                      |
|-------------|--------------------------------------------------|
| admin       | Full CRUD including delete                       |
| sales       | View, create, edit — cannot delete               |

---

## Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email: Invalid email address"]
}
```

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Validation error           |
| 401    | Unauthorized               |
| 403    | Forbidden (RBAC)           |
| 404    | Not found                  |
| 409    | Conflict (duplicate email) |
| 429    | Rate limit exceeded        |
| 500    | Server error               |

---

## Health Check

`GET /api/health`

```json
{ "success": true, "message": "Smart Leads API is running" }
```
