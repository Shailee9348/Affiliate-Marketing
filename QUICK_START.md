# AMD Backend - Quick Start Guide

Get your AMD affiliate marketing backend running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ running locally or remote
- npm or yarn package manager

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies (1 min)
```bash
cd Backend
npm install
```

### Step 2: Configure Environment (1 min)
```bash
cp .env.example .env
```

Edit `.env` and set these essential variables:
```env
# Database - Create a PostgreSQL database first
DATABASE_URL=postgresql://postgres:password@localhost:5432/amd_affiliate

# JWT - Generate a secure random string
JWT_SECRET=generate-a-long-random-string-here
JWT_EXPIRATION=24h

# Stripe (get from stripe.com/account/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Server
PORT=3000
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

### Step 3: Setup Database (2 min)
```bash
# Install Prisma CLI globally (optional)
npm install -g prisma

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### Step 4: Start Server (1 min)
```bash
npm run start:dev
```

✅ **Server running at**: `http://localhost:3000`

## 📚 API Documentation

Access Swagger UI:
```
http://localhost:3000/api/docs
```

## 🧪 Quick Test

### 1. Register an Affiliate
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "affiliate@example.com",
    "password": "SecurePassword123",
    "name": "My Affiliate"
  }'
```

Response:
```json
{
  "id": "user-uuid",
  "email": "affiliate@example.com",
  "role": "AFFILIATE",
  "affiliate": {
    "id": "affiliate-uuid",
    "affiliateId": "aff_xxxxx",
    "name": "My Affiliate"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "affiliate@example.com",
    "password": "SecurePassword123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {...}
}
```

### 3. Create Campaign (Use token from login)
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "name": "Summer Promo 2024",
    "description": "Summer campaign",
    "commissionRate": 15,
    "isActive": true
  }'
```

### 4. Track Click
```bash
curl -X POST http://localhost:3000/api/tracking/click \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "campaign-uuid",
    "userAgent": "Mozilla/5.0...",
    "referrer": "https://example.com",
    "deviceType": "mobile"
  }'
```

### 5. Track Conversion
```bash
curl -X POST http://localhost:3000/api/conversions \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "campaign-uuid",
    "eventType": "PURCHASE",
    "amount": 99.99,
    "currency": "USD"
  }'
```

## 📊 Key Endpoints by Feature

### Authentication
- `POST /api/auth/register` - Register new affiliate
- `POST /api/auth/login` - Get JWT token

### Campaigns & Tracking
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - List your campaigns
- `GET /api/campaigns/:id/stats` - Campaign stats
- `POST /api/tracking/click` - Track click
- `POST /api/conversions` - Track conversion

### Analytics
- `GET /api/analytics/affiliate` - Your performance
- `GET /api/analytics/campaign/:id` - Campaign analytics
- `GET /api/analytics/top-campaigns` - Best performers

### Commissions & Payouts
- `GET /api/commissions` - Your commissions
- `GET /api/commissions/stats` - Commission stats
- `POST /api/payouts/request` - Request payout
- `GET /api/payouts` - Your payouts

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard
- `GET /api/admin/affiliates` - All affiliates
- `POST /api/affiliates/:id/approve` - Approve affiliate
- `POST /api/commissions/:id/approve` - Approve commission

## 🔑 Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 24 hours (configurable in `.env`)

## 📁 Project Structure

```
Backend/
├── src/
│   ├── auth/          - Login/register
│   ├── campaigns/     - Campaign CRUD
│   ├── tracking/      - Click tracking
│   ├── conversions/   - Conversion tracking
│   ├── analytics/     - Stats & reports
│   ├── commissions/   - Commission management
│   ├── payouts/       - Payout requests
│   ├── admin/         - Admin dashboard
│   └── ...
├── prisma/
│   └── schema.prisma  - Database schema
└── .env.example       - Configuration template
```

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev      # Watch mode

# Production
npm run build          # Build
npm run start:prod     # Run production build

# Database
npm run prisma:migrate # Create new migration
npm run prisma:seed    # Seed database (if script exists)

# Testing
npm test              # Run tests
npm run test:cov      # Coverage report

# Code Quality
npm run lint          # Fix linting
npm run format        # Format code
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
→ Make sure PostgreSQL is running and DATABASE_URL is correct

### Migration Error
```
Error: P3010: The following migration has failed validation
```
→ Run: `npm run prisma:migrate -- --skip-generate`

### JWT Token Invalid
```
Error: 401 Unauthorized
```
→ Make sure:
- Token is in `Authorization: Bearer <token>` format
- Token hasn't expired (24h default)
- JWT_SECRET in .env matches the secret used to create token

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
→ Change PORT in `.env` or kill process on port 3000

## 📖 Full Documentation

See `README.md` for complete documentation including:
- All API endpoints
- Database schema details
- Commission calculation
- Stripe integration
- Security features

## 🎯 Next Steps

1. **Setup Frontend**: Connect to backend at `http://localhost:3000/api`
2. **Configure Stripe**: Add webhook in Stripe dashboard
3. **Customize Settings**: Update global commission rates in admin
4. **Deploy**: Follow deployment guide in README.md

## 💡 Tips

- Use Swagger UI at `/api/docs` to test endpoints interactively
- Check database with: `npx prisma studio`
- View logs in console for debugging
- Use environment variables for sensitive data
- Never commit `.env` file (use `.env.example`)

## 📞 Support

If you encounter issues:

1. Check the error message in console
2. Review `.env` configuration
3. Verify database connectivity
4. Check README.md for detailed docs
5. Review specific module documentation

---

**Quick Start Complete!** 🎉

Your backend is ready for development. Start building! 🚀
