# AMD Backend - Deployment Guide

Complete guide to deploying the AMD affiliate marketing backend to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database is set up and accessible
- [ ] Stripe webhook secret obtained
- [ ] JWT secret is strong and unique
- [ ] Database backups are scheduled
- [ ] HTTPS is configured (for production)
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (optional)
- [ ] Logging is configured
- [ ] Monitoring is set up (optional)

## Environment Setup for Production

### 1. Create Production `.env` File

```bash
# Database (Use managed PostgreSQL service)
DATABASE_URL=postgresql://prod_user:STRONG_PASSWORD@db.example.com:5432/amd_prod

# JWT (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<64-character-random-string>
JWT_EXPIRATION=24h

# Stripe (Use LIVE keys, not test keys)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Server
PORT=3000
NODE_ENV=production
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Logging
LOG_LEVEL=error

# Database Limits
DB_CONNECTION_LIMIT=20
DB_IDLE_TIMEOUT=900000
```

### 2. Security Hardening

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Store secrets in:
- Environment variables
- Secrets manager (AWS Secrets Manager, Hashicorp Vault, etc.)
- CI/CD pipeline secrets
- Never in version control
```

## Deployment Options

### Option 1: Docker Deployment

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY dist ./dist
COPY prisma ./prisma

# Set environment
ENV NODE_ENV=production

# Run migrations and start
CMD ["sh", "-c", "npm run prisma:migrate -- --skip-generate && node dist/main"]

EXPOSE 3000
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: amd_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/amd_prod
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      NODE_ENV: production
      APP_URL: ${APP_URL}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

#### 3. Deploy with Docker

```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Option 2: Cloud Platform Deployment

#### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" amd-backend

# Create environment
eb create prod

# Deploy
eb deploy

# View logs
eb logs

# SSH into instance
eb ssh
```

#### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create amd-affiliate-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET=<value>
heroku config:set STRIPE_SECRET_KEY=<value>
heroku config:set STRIPE_WEBHOOK_SECRET=<value>

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Run migrations
heroku run npm run prisma:migrate
```

#### Google Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/amd-backend

# Deploy
gcloud run deploy amd-backend \
  --image gcr.io/PROJECT_ID/amd-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars JWT_SECRET=${JWT_SECRET} \
  --set-env-vars STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \
  --set-env-vars DATABASE_URL=${DATABASE_URL}
```

### Option 3: VPS Deployment (Ubuntu)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Create PostgreSQL user and database
sudo -u postgres createuser amd_user
sudo -u postgres createdb amd_prod -O amd_user

# 5. Clone repository
cd /var/www
git clone <your-repo-url> amd-backend
cd amd-backend

# 6. Install dependencies
npm install

# 7. Build application
npm run build

# 8. Run migrations
npm run prisma:migrate -- --skip-generate

# 9. Create systemd service
sudo nano /etc/systemd/system/amd-backend.service
```

**Service file content:**
```ini
[Unit]
Description=AMD Affiliate Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/amd-backend
ExecStart=/usr/bin/node /var/www/amd-backend/dist/main
Restart=always
RestartSec=10
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/amd-backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
# Enable service
sudo systemctl enable amd-backend
sudo systemctl start amd-backend
sudo systemctl status amd-backend
```

## Post-Deployment

### 1. Database Setup

```bash
# Run migrations
npm run prisma:migrate -- --skip-generate

# Seed initial data (if available)
npm run prisma:seed
```

### 2. Verify Deployment

```bash
# Health check
curl https://api.yourdomain.com/health

# API docs
https://api.yourdomain.com/api/docs

# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test Admin"
  }'
```

### 3. Configure Stripe Webhook

1. Go to Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. Enter URL: `https://api.yourdomain.com/api/stripe/webhook`
5. Select events:
   - `payment_intent.succeeded`
   - `charge.refunded`
6. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Setup HTTPS

#### Using Nginx with Let's Encrypt

```bash
# Install Nginx
sudo apt install -y nginx

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/amd-backend
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/amd-backend /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

### 5. Setup Monitoring

#### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/main.js --name "amd-backend"

# Create ecosystem config
pm2 init

# Setup startup script
pm2 startup
pm2 save

# View logs
pm2 logs amd-backend

# Monitor
pm2 monit
```

#### Logging with Winston (Optional)

Update `main.ts`:
```typescript
import * as winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### 6. Backup Strategy

```bash
# Automated daily backup script
nano /usr/local/bin/backup-amd.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/amd-db"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="amd_prod"
DB_USER="amd_user"

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/ s3://amd-backups/ --recursive
```

```bash
# Make executable
chmod +x /usr/local/bin/backup-amd.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-amd.sh
```

## Performance Optimization

### 1. Database Optimization

```prisma
# Ensure indexes are created
prisma migrate dev

# Analyze queries
EXPLAIN ANALYZE <query>
```

### 2. API Optimization

```typescript
// Enable response compression
import * as compression from 'compression';

app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### 3. Load Balancing

```nginx
upstream api_backend {
    server api1.example.com:3000;
    server api2.example.com:3000;
    server api3.example.com:3000;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backend;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
    }
}
```

## Monitoring & Alerts

### Application Health Check

```typescript
// Add health endpoint
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
```

### Uptime Monitoring

- Use services like: UptimeRobot, Pingdom, or New Relic
- Monitor response times
- Track error rates
- Alert on failures

## Rollback Plan

```bash
# If deployment fails

# 1. Stop service
sudo systemctl stop amd-backend

# 2. Revert code
git reset --hard <previous-commit-hash>

# 3. Rebuild
npm install
npm run build

# 4. Restore database (if migrations failed)
# Use backup: pg_restore <backup-file>

# 5. Restart service
sudo systemctl start amd-backend

# 6. Verify
curl https://api.yourdomain.com/health
```

## Maintenance

### Regular Tasks

- [ ] Monitor logs daily
- [ ] Check disk space weekly
- [ ] Review database backups weekly
- [ ] Update dependencies monthly
- [ ] Test disaster recovery quarterly
- [ ] Review security groups monthly
- [ ] Analyze performance trends weekly

### Update Procedure

```bash
# 1. Test locally
npm update
npm test

# 2. Backup database
pg_dump amd_prod > backup_pre_update.sql

# 3. Deploy new version
git pull origin main
npm install
npm run build
npm run prisma:migrate

# 4. Restart service
sudo systemctl restart amd-backend

# 5. Verify
curl https://api.yourdomain.com/health
```

## Troubleshooting

### High CPU Usage
- Check slow queries
- Review background jobs
- Optimize database indexes

### High Memory Usage
- Check for memory leaks
- Review connection pool settings
- Increase allocated memory

### Database Connections Exhausted
```bash
# Increase connection limit
# In .env:
DATABASE_CONNECTION_LIMIT=30

# Restart service
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check expiration
sudo certbot certificates
```

---

**Deployment Guide Complete**

For questions or issues, refer to:
- NestJS: https://docs.nestjs.com/deployment
- Prisma: https://www.prisma.io/docs/guides/deployment
- Stripe: https://stripe.com/docs/stripe-cli

---

**Last Updated**: January 2026
