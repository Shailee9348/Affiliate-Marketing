# AMD Affiliate Marketing Backend

A complete NestJS-based backend for an affiliate marketing platform with advanced tracking, analytics, and commission management.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Affiliate)
- Secure password hashing with bcryptjs
- User registration and login

### 👥 User & Affiliate Management
- User profiles and affiliate accounts
- Affiliate approval workflow
- Status management (PENDING, ACTIVE, SUSPENDED, REJECTED)
- Commission rate configuration

### 📢 Campaign Management
- Create and manage marketing campaigns
- Campaign-specific commission rates
- Campaign analytics and performance tracking
- Campaign status (active/inactive)

### 🔗 Click Tracking
- Real-time click tracking with pixel-based system
- Device type detection (mobile, desktop, tablet)
- Referrer and user agent tracking
- IP address logging
- Automatic affiliate click count updates

### 📊 Conversion Tracking
- Multiple conversion event types (SIGNUP, PURCHASE, RECURRING, REFUND)
- Stripe integration for payment tracking
- Automatic commission calculation on conversions
- Refund handling with commission reversal
- Net amount tracking

### 💳 Stripe Integration
- Payment intent creation and verification
- Webhook event handling
- Automatic refund processing
- Payment status tracking
- Secure webhook signature verification

### 💰 Commission System
- Automatic commission calculation based on conversion amount and rate
- Commission status workflow (PENDING, APPROVED, PAID, REJECTED)
- Commission approval system
- Batch processing capabilities
- Commission statistics and tracking

### 💸 Payout System
- Payout request management
- Minimum payout amount validation
- Multiple payout statuses (PENDING, PROCESSING, COMPLETED, FAILED)
- Automatic approval after configurable period
- Payout statistics and history

### 📈 Analytics API
- Affiliate performance analytics
- Campaign-level analytics
- Revenue timeline tracking
- Commission timeline tracking
- Device breakdown analysis
- Conversion type analysis
- Top performing campaigns

### 🛡️ Admin Controls
- Admin dashboard with key metrics
- Affiliate management and approval
- Commission and payout management
- Audit log tracking
- Global settings management
- Revenue reports by date range
- Pending approvals overview

### 📝 Audit Logging
- Action tracking for all operations
- Entity change logging
- User attribution
- Detailed audit log retrieval

## Technology Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport.js
- **Payment Processing**: Stripe API
- **Validation**: class-validator
- **API Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs for password hashing

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Stripe Account (for payment processing)

## Installation

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

**Required environment variables:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/amd_affiliate
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server will run on `http://localhost:3000`

API Documentation available at `http://localhost:3000/api/docs`

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Login/Register DTOs
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   └── auth.module.ts
├── users/               # User management
├── affiliates/          # Affiliate management
├── campaigns/           # Campaign management
├── tracking/            # Click tracking
├── conversions/         # Conversion tracking
├── stripe/              # Stripe webhook handling
├── analytics/           # Analytics APIs
├── commissions/         # Commission management
├── payouts/             # Payout management
├── admin/               # Admin dashboard & controls
├── common/              # Decorators, guards, utils
├── prisma/              # Prisma service module
├── app.module.ts
└── main.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new affiliate
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile

### Affiliates
- `GET /api/affiliates/profile` - Get affiliate profile
- `GET /api/affiliates/stats` - Get affiliate statistics
- `PATCH /api/affiliates/profile` - Update affiliate profile
- `GET /api/affiliates` - Get all affiliates (admin)
- `POST /api/affiliates/:id/approve` - Approve affiliate (admin)
- `POST /api/affiliates/:id/suspend` - Suspend affiliate (admin)

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - Get affiliate campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `PATCH /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/stats` - Get campaign stats

### Tracking
- `POST /api/tracking/click` - Track click event
- `GET /api/tracking/link/:campaignId` - Generate tracking link
- `GET /api/tracking/stats/:campaignId` - Get click stats
- `GET /api/tracking/timeline/:campaignId` - Get clicks timeline

### Conversions
- `POST /api/conversions` - Track conversion
- `GET /api/conversions/campaign/:campaignId` - Get conversions
- `GET /api/conversions/affiliate` - Get affiliate conversions
- `GET /api/conversions/stats/:campaignId` - Get conversion stats
- `PATCH /api/conversions/:id` - Update conversion

### Analytics
- `GET /api/analytics/affiliate` - Get affiliate analytics
- `GET /api/analytics/campaign/:campaignId` - Get campaign analytics
- `GET /api/analytics/top-campaigns` - Get top campaigns
- `GET /api/analytics/revenue-timeline` - Get revenue timeline
- `GET /api/analytics/commission-timeline` - Get commission timeline

### Commissions
- `GET /api/commissions` - Get affiliate commissions
- `GET /api/commissions/stats` - Get commission stats
- `GET /api/commissions/:id` - Get commission
- `POST /api/commissions/:id/approve` - Approve commission (admin)
- `POST /api/commissions/:id/reject` - Reject commission (admin)
- `POST /api/commissions/mark-as-paid` - Mark as paid (admin)

### Payouts
- `POST /api/payouts/request` - Request payout
- `GET /api/payouts` - Get affiliate payouts
- `GET /api/payouts/stats` - Get payout stats
- `GET /api/payouts/:id` - Get payout
- `POST /api/payouts/:id/approve` - Approve payout (admin)
- `POST /api/payouts/:id/complete` - Complete payout (admin)
- `POST /api/payouts/:id/fail` - Fail payout (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/affiliates` - All affiliates
- `GET /api/admin/audit-logs` - Audit logs
- `GET /api/admin/pending-approvals` - Pending approvals
- `GET /api/admin/revenue-report` - Revenue report
- `GET /api/admin/settings` - Global settings
- `PATCH /api/admin/settings` - Update settings

### Stripe
- `POST /api/stripe/webhook` - Stripe webhook endpoint

## Database Schema

The database includes the following main models:

- **User** - User accounts with email and password
- **Affiliate** - Affiliate profiles linked to users
- **Campaign** - Marketing campaigns created by affiliates
- **Click** - Tracked clicks from marketing links
- **Conversion** - Tracked conversions (sales, signups, etc.)
- **Commission** - Calculated commissions for affiliates
- **Payout** - Payout requests and history
- **AuditLog** - System audit logs
- **GlobalSettings** - Platform-wide configuration

See `prisma/schema.prisma` for detailed schema.

## Authentication Flow

1. **Register**: Create new account with email and password
2. **Login**: Receive JWT token
3. **Use Token**: Include token in Authorization header: `Bearer <token>`
4. **Token Validation**: JWT Strategy validates token on protected routes

## Commission Calculation

Commissions are automatically calculated when a conversion is tracked:

```
Commission = Conversion Amount × Commission Rate / 100
```

Commission rate hierarchy:
1. Campaign-specific rate (if set)
2. Affiliate default rate
3. Global default rate (from settings)

## Scripts

```bash
# Development
npm run start:dev        # Watch mode
npm run start:debug      # Debug mode

# Production
npm run build           # Build
npm run start:prod      # Run

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed database

# Testing
npm test               # Run tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report

# Linting
npm run lint          # Fix linting issues
npm run format        # Format code
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/db |
| JWT_SECRET | Secret key for JWT signing | your-secret-key |
| JWT_EXPIRATION | Token expiration time | 24h |
| STRIPE_SECRET_KEY | Stripe API secret key | sk_test_xxx |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret | whsec_xxx |
| PORT | Server port | 3000 |
| APP_URL | Application base URL | http://localhost:3000 |
| FRONTEND_URL | Frontend application URL | http://localhost:3001 |
| NODE_ENV | Environment | development |

## Security Features

- All passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with expiration (default 24h)
- Stripe webhook signature verification
- SQL injection protection via Prisma ORM
- CORS configured for frontend domain
- Input validation on all endpoints
- Role-based access control

## License

UNLICENSED

---

**Version**: 1.0.0
**Last Updated**: January 2026
