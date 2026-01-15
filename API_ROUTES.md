# API Routes Reference

Complete list of all available API endpoints for the AMD Affiliate Marketing Platform.

## Base URL
```
http://localhost:3000/api
```

## Authentication Routes

### Register New User
```
POST /auth/register
Content-Type: application/json

{
  "email": "affiliate@example.com",
  "password": "SecurePassword123",
  "name": "Affiliate Name"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "affiliate@example.com",
  "role": "AFFILIATE",
  "affiliate": {...}
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "affiliate@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

---

## User Routes
*Requires Authentication*

### Get Current User Profile
```
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "affiliate@example.com",
  "role": "AFFILIATE",
  "affiliate": {
    "id": "uuid",
    "affiliateId": "aff_xxxxx",
    "name": "Affiliate Name",
    "campaigns": [...]
  }
}
```

---

## Affiliate Routes
*Requires Authentication*

### Get Affiliate Profile
```
GET /affiliates/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "affiliateId": "aff_xxxxx",
  "name": "Affiliate Name",
  "status": "ACTIVE",
  "commissionRate": 10.0,
  "totalClicks": 1000,
  "totalConversions": 50,
  "totalRevenue": 5000,
  "totalCommission": 500
}
```

### Get Affiliate Statistics
```
GET /affiliates/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "affiliateId": "uuid",
  "totalClicks": 1000,
  "totalConversions": 50,
  "totalRevenue": 5000,
  "totalCommission": 500,
  "status": "ACTIVE",
  "commissionRate": 10.0
}
```

### Update Affiliate Profile
```
PATCH /affiliates/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "commissionRate": 15.0
}

Response: 200 OK
{...updated affiliate...}
```

### Get All Affiliates (Admin Only)
```
GET /affiliates?skip=0&take=10
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "data": [...],
  "total": 100,
  "skip": 0,
  "take": 10
}
```

### Approve Affiliate (Admin Only)
```
POST /affiliates/:affiliateId/approve
Authorization: Bearer <admin_token>

Response: 200 OK
{...affiliate with status ACTIVE...}
```

### Suspend Affiliate (Admin Only)
```
POST /affiliates/:affiliateId/suspend
Authorization: Bearer <admin_token>

Response: 200 OK
{...affiliate with status SUSPENDED...}
```

---

## Campaign Routes
*Requires Authentication*

### Create Campaign
```
POST /campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Summer Campaign 2024",
  "description": "Summer promotional campaign",
  "commissionRate": 15,
  "isActive": true
}

Response: 201 Created
{
  "id": "uuid",
  "affiliateId": "uuid",
  "name": "Summer Campaign 2024",
  "commissionRate": 15,
  "isActive": true,
  "createdAt": "2024-01-10T10:00:00Z"
}
```

### Get Affiliate Campaigns
```
GET /campaigns?skip=0&take=10
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [...campaigns...],
  "total": 5,
  "skip": 0,
  "take": 10
}
```

### Get Campaign Details
```
GET /campaigns/:campaignId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "name": "Campaign Name",
  "description": "...",
  "clicks": [...],
  "conversions": [...]
}
```

### Get Campaign Statistics
```
GET /campaigns/:campaignId/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "campaignId": "uuid",
  "clicks": 1000,
  "conversions": 50,
  "totalRevenue": 5000,
  "conversionRate": "5.00"
}
```

### Update Campaign
```
PATCH /campaigns/:campaignId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Campaign Name",
  "commissionRate": 20,
  "isActive": false
}

Response: 200 OK
{...updated campaign...}
```

### Delete Campaign
```
DELETE /campaigns/:campaignId
Authorization: Bearer <token>

Response: 200 OK
{...deleted campaign...}
```

---

## Tracking Routes

### Track Click (No Auth Required)
```
POST /tracking/click
Content-Type: application/json

{
  "campaignId": "uuid",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com",
  "ipAddress": "192.168.1.1",
  "deviceType": "mobile"
}

Response: 201 Created
{
  "id": "uuid",
  "campaignId": "uuid",
  "timestamp": "2024-01-10T10:00:00Z"
}
```

### Generate Tracking Link
```
GET /tracking/link/:campaignId?landingUrl=https://example.com
Authorization: Bearer <token>

Response: 200 OK
"http://localhost:3000/api/track/abc12345?..."
```

### Get Click Statistics
```
GET /tracking/stats/:campaignId
Authorization: Bearer <token>

Response: 200 OK
{
  "campaignId": "uuid",
  "totalClicks": 1000,
  "byDevice": [
    {"deviceType": "mobile", "_count": {"id": 600}},
    {"deviceType": "desktop", "_count": {"id": 400}}
  ],
  "timeline": [...]
}
```

### Get Clicks Timeline
```
GET /tracking/timeline/:campaignId?days=7
Authorization: Bearer <token>

Response: 200 OK
{
  "campaignId": "uuid",
  "period": "Last 7 days",
  "data": [
    {"date": "2024-01-03T00:00:00Z", "clicks": 100},
    {"date": "2024-01-04T00:00:00Z", "clicks": 120},
    ...
  ]
}
```

---

## Conversion Routes

### Track Conversion (No Auth Required)
```
POST /conversions
Content-Type: application/json

{
  "campaignId": "uuid",
  "eventType": "PURCHASE",
  "amount": 99.99,
  "currency": "USD",
  "stripePaymentIntentId": "pi_xxxxx"
}

Response: 201 Created
{
  "id": "uuid",
  "campaignId": "uuid",
  "eventType": "PURCHASE",
  "amount": 99.99,
  "timestamp": "2024-01-10T10:00:00Z"
}
```

### Get Campaign Conversions
```
GET /conversions/campaign/:campaignId?skip=0&take=10
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [...conversions...],
  "total": 50,
  "skip": 0,
  "take": 10
}
```

### Get Affiliate Conversions
```
GET /conversions/affiliate?skip=0&take=10
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [...conversions...],
  "total": 150,
  "skip": 0,
  "take": 10
}
```

### Get Conversion Statistics
```
GET /conversions/stats/:campaignId
Authorization: Bearer <token>

Response: 200 OK
{
  "campaignId": "uuid",
  "totalConversions": 50,
  "totalRevenue": 5000,
  "averageOrderValue": "100.00"
}
```

### Update Conversion
```
PATCH /conversions/:conversionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "netAmount": 89.99,
  "isRefunded": false
}

Response: 200 OK
{...updated conversion...}
```

---

## Analytics Routes
*Requires Authentication*

### Get Affiliate Analytics
```
GET /analytics/affiliate?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "affiliateId": "uuid",
  "period": "Last 30 days",
  "clicks": 5000,
  "conversions": 250,
  "revenue": 25000,
  "commissions": 2500,
  "conversionRate": "5.00"
}
```

### Get Campaign Analytics
```
GET /analytics/campaign/:campaignId?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "campaignId": "uuid",
  "period": "Last 30 days",
  "clicks": 1000,
  "conversions": 50,
  "revenue": 5000,
  "aov": "100.00",
  "conversionRate": "5.00",
  "deviceBreakdown": [...],
  "conversionByType": [...]
}
```

### Get Top Campaigns
```
GET /analytics/top-campaigns?limit=5
Authorization: Bearer <token>

Response: 200 OK
[
  {"id": "uuid", "name": "Campaign 1", "clicks": 1000, "conversions": 50},
  {"id": "uuid", "name": "Campaign 2", "clicks": 800, "conversions": 40},
  ...
]
```

### Get Revenue Timeline
```
GET /analytics/revenue-timeline?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "affiliateId": "uuid",
  "period": "Last 30 days",
  "data": [
    {"date": "2024-01-03T00:00:00Z", "revenue": 200},
    {"date": "2024-01-04T00:00:00Z", "revenue": 250},
    ...
  ]
}
```

### Get Commission Timeline
```
GET /analytics/commission-timeline?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "affiliateId": "uuid",
  "period": "Last 30 days",
  "data": [
    {"date": "2024-01-03T00:00:00Z", "amount": 20, "count": 2},
    {"date": "2024-01-04T00:00:00Z", "amount": 25, "count": 2},
    ...
  ]
}
```

---

## Commission Routes
*Requires Authentication*

### Get Affiliate Commissions
```
GET /commissions?status=PENDING&skip=0&take=10
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "amount": 100,
      "rate": 10,
      "status": "PENDING",
      "conversion": {...}
    }
  ],
  "total": 250,
  "skip": 0,
  "take": 10
}
```

### Get Commission Statistics
```
GET /commissions/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "PENDING": {"count": 50, "total": 5000},
  "APPROVED": {"count": 30, "total": 3000},
  "PAID": {"count": 100, "total": 10000},
  "REJECTED": {"count": 5, "total": 500}
}
```

### Get Commission Details
```
GET /commissions/:commissionId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "affiliateId": "uuid",
  "amount": 100,
  "rate": 10,
  "status": "PENDING",
  "conversion": {...},
  "affiliate": {...}
}
```

### Approve Commission (Admin Only)
```
POST /commissions/:commissionId/approve
Authorization: Bearer <admin_token>

Response: 200 OK
{...commission with status APPROVED...}
```

### Reject Commission (Admin Only)
```
POST /commissions/:commissionId/reject
Authorization: Bearer <admin_token>

Response: 200 OK
{...commission with status REJECTED...}
```

### Mark Commissions as Paid (Admin Only)
```
POST /commissions/mark-as-paid
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "commissionIds": ["uuid1", "uuid2", "uuid3"]
}

Response: 200 OK
{"updated": 3}
```

---

## Payout Routes
*Requires Authentication*

### Request Payout
```
POST /payouts/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500
}

Response: 201 Created
{
  "id": "uuid",
  "affiliateId": "uuid",
  "amount": 500,
  "status": "PENDING",
  "createdAt": "2024-01-10T10:00:00Z"
}
```

### Get Affiliate Payouts
```
GET /payouts?skip=0&take=10
Authorization: Bearer <token>

Response: 200 OK
{
  "data": [...payouts...],
  "total": 10,
  "skip": 0,
  "take": 10
}
```

### Get Payout Statistics
```
GET /payouts/stats
Authorization: Bearer <token>

Response: 200 OK
{
  "PENDING": {"count": 2, "total": 1000},
  "PROCESSING": {"count": 1, "total": 500},
  "COMPLETED": {"count": 5, "total": 2500},
  "FAILED": {"count": 0, "total": 0}
}
```

### Get Payout Details
```
GET /payouts/:payoutId
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "affiliateId": "uuid",
  "amount": 500,
  "status": "PENDING",
  "commissions": [...],
  "affiliate": {...}
}
```

### Approve Payout (Admin Only)
```
POST /payouts/:payoutId/approve
Authorization: Bearer <admin_token>

Response: 200 OK
{...payout with status PROCESSING...}
```

### Complete Payout (Admin Only)
```
POST /payouts/:payoutId/complete
Authorization: Bearer <admin_token>

Response: 200 OK
{...payout with status COMPLETED...}
```

### Fail Payout (Admin Only)
```
POST /payouts/:payoutId/fail
Authorization: Bearer <admin_token>

Response: 200 OK
{...payout with status FAILED...}
```

---

## Admin Routes
*Requires Admin Authentication*

### Get Dashboard Statistics
```
GET /admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "totalUsers": 1000,
  "totalAffiliates": 500,
  "totalCampaigns": 2000,
  "totalClicks": 500000,
  "totalConversions": 25000,
  "totalRevenue": 2500000,
  "totalCommissions": 250000,
  "pendingPayouts": {"count": 10, "amount": 5000}
}
```

### Get All Affiliates
```
GET /admin/affiliates?skip=0&take=10
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "data": [...affiliates...],
  "total": 500,
  "skip": 0,
  "take": 10
}
```

### Get Audit Logs
```
GET /admin/audit-logs?affiliateId=optional&skip=0&take=10
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "affiliateId": "uuid",
      "action": "CREATE_CAMPAIGN",
      "entityType": "Campaign",
      "entityId": "uuid",
      "performedBy": "user-uuid",
      "performedAt": "2024-01-10T10:00:00Z"
    }
  ],
  "total": 5000,
  "skip": 0,
  "take": 10
}
```

### Get Pending Approvals
```
GET /admin/pending-approvals
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "pendingAffiliates": 5,
  "pendingCommissions": 50,
  "pendingPayouts": 10
}
```

### Get Revenue Report
```
GET /admin/revenue-report?fromDate=2024-01-01&toDate=2024-01-31
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "period": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  },
  "conversions": {
    "count": 1000,
    "totalAmount": 100000
  },
  "commissions": {
    "count": 1000,
    "totalAmount": 10000
  },
  "profit": 90000
}
```

### Get Global Settings
```
GET /admin/settings
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "id": "uuid",
  "defaultCommissionRate": 10.0,
  "minPayoutAmount": 50.0,
  "currency": "USD",
  "taxRate": 0.0
}
```

### Update Global Settings
```
PATCH /admin/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "defaultCommissionRate": 12.0,
  "minPayoutAmount": 100.0,
  "taxRate": 0.1
}

Response: 200 OK
{...updated settings...}
```

---

## Stripe Routes

### Webhook Endpoint
```
POST /stripe/webhook
Content-Type: application/json
Stripe-Signature: <signature_header>

{
  // Stripe event payload
}

Response: 200 OK
{"received": true}
```

**Handled Events:**
- `payment_intent.succeeded` - Update conversion status
- `charge.refunded` - Process refund

---

## Error Responses

All endpoints follow standard HTTP error codes:

```
200 OK - Success
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - Missing or invalid token
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
500 Internal Server Error - Server error
```

Error Response Format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

---

## Pagination

All list endpoints support pagination:

```
?skip=0&take=10
```

Response includes:
```json
{
  "data": [...],
  "total": 100,
  "skip": 0,
  "take": 10
}
```

---

**Last Updated**: January 2026
**API Version**: 1.0.0
