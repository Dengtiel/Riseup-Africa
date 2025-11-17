# Deployment Guide

This guide covers various deployment methods for the RiseUp Africa platform.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Cloud Platform Deployment](#cloud-platform-deployment)
3. [Traditional Server Deployment](#traditional-server-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Monitoring & Logging](#monitoring--logging)

## Docker Deployment

### Production with Docker Compose

1. **Prepare environment file**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec api pnpm prisma:migrate:deploy
   ```

4. **Seed database (optional)**
   ```bash
   docker-compose exec api pnpm prisma:seed
   ```

5. **Check service status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Using Individual Dockerfiles

**Build API image:**
```bash
docker build -f apps/api/Dockerfile -t riseup-api:latest .
```

**Build Web image:**
```bash
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  -t riseup-web:latest .
```

**Run containers:**
```bash
# API
docker run -d \
  --name riseup-api \
  -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  riseup-api:latest

# Web
docker run -d \
  --name riseup-web \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="https://api.yourdomain.com" \
  riseup-web:latest
```

## Cloud Platform Deployment

### Vercel (Web App - Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd apps/web
   vercel
   ```

3. **Configure**
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm install && pnpm build --filter=web`
   - Output Directory: `.next`
   - Install Command: `cd ../.. && pnpm install`

4. **Environment Variables**
   - `NEXT_PUBLIC_API_URL`: Your API URL

### Railway

**API Service:**
1. Connect GitHub repository
2. Configure:
   - Root Directory: `apps/api`
   - Build Command: `cd ../.. && pnpm install && pnpm build --filter=api`
   - Start Command: `cd apps/api && pnpm start`
3. Add PostgreSQL service
4. Set environment variables:
   - `DATABASE_URL` (from PostgreSQL service)
   - `JWT_SECRET`
   - `PORT=4000`

**Web Service:**
1. Connect GitHub repository
2. Configure:
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm install && pnpm build --filter=web`
   - Start Command: `cd apps/web && pnpm start`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway API URL

### Render

**API Service:**
1. Create new Web Service
2. Connect repository
3. Configure:
   - Build Command: `cd apps/api && pnpm install && pnpm build`
   - Start Command: `cd apps/api && pnpm start`
4. Add PostgreSQL database
5. Set environment variables

**Web Service:**
1. Create new Web Service
2. Connect repository
3. Configure:
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Start Command: `cd apps/web && pnpm start`
4. Set environment variables

### Fly.io

**API Service:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch API
cd apps/api
fly launch
# Follow prompts, select PostgreSQL addon

# Deploy
fly deploy
```

**Web Service:**
```bash
cd apps/web
fly launch
# Set NEXT_PUBLIC_API_URL
fly deploy
```

### AWS (EC2 / ECS)

#### EC2 Deployment

1. **Launch EC2 instance** (Ubuntu 22.04 LTS)
2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql docker.io docker-compose
   sudo npm install -g pnpm
   ```

3. **Clone and deploy:**
   ```bash
   git clone <repo>
   cd rise-up-africa
   cp .env.example .env
   # Edit .env
   docker-compose up -d --build
   ```

#### ECS with Fargate

1. **Build and push images:**
   ```bash
   # Build
   docker build -f apps/api/Dockerfile -t your-ecr-repo/api:latest .
   docker build -f apps/web/Dockerfile -t your-ecr-repo/web:latest .

   # Push to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   docker tag your-ecr-repo/api:latest <account>.dkr.ecr.<region>.amazonaws.com/api:latest
   docker tag your-ecr-repo/web:latest <account>.dkr.ecr.<region>.amazonaws.com/web:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/api:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/web:latest
   ```

2. **Create ECS services** with task definitions
3. **Set up RDS** for PostgreSQL
4. **Configure ALB** for load balancing

### Google Cloud Platform (GCP)

#### Cloud Run

**API:**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/riseup-api
gcloud run deploy riseup-api \
  --image gcr.io/PROJECT_ID/riseup-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Web:**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/riseup-web
gcloud run deploy riseup-web \
  --image gcr.io/PROJECT_ID/riseup-web \
  --platform managed \
  --region us-central1
```

#### GKE (Kubernetes)

See [kubernetes/](./kubernetes/) directory for Kubernetes manifests.

### Azure

#### Azure App Service

1. **Create App Service Plans**
2. **Deploy via Azure CLI:**
   ```bash
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myApiApp
   az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myWebApp
   ```

3. **Configure deployment** from GitHub
4. **Set environment variables**
5. **Connect to Azure Database for PostgreSQL**

## Traditional Server Deployment

### Prerequisites

- Ubuntu 22.04 LTS (or similar)
- Node.js 20+
- PostgreSQL 16+
- PM2 (for process management)
- Nginx (for reverse proxy)

### Setup Steps

1. **Install dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql nginx
   sudo npm install -g pnpm pm2
   ```

2. **Set up PostgreSQL:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE riseup_africa;
   CREATE USER riseup WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE riseup_africa TO riseup;
   \q
   ```

3. **Clone and build:**
   ```bash
   git clone <repo>
   cd rise-up-africa
   pnpm install
   pnpm build
   ```

4. **Configure API:**
   ```bash
   cd apps/api
   cp .env.example .env
   # Edit .env
   pnpm prisma:generate
   pnpm prisma:migrate:deploy
   ```

5. **Start with PM2:**
   ```bash
   # API
   cd apps/api
   pm2 start dist/server.js --name riseup-api

   # Web
   cd apps/web
   pm2 start npm --name riseup-web -- start

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/riseup-africa
   server {
       listen 80;
       server_name yourdomain.com;

       # Web app
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # API
       location /api {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/riseup-africa /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Environment Configuration

### Production Environment Variables

**API (`apps/api/.env`):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
PORT=4000
```

**Web (`apps/web/.env.production`):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Security Best Practices

1. **Use strong JWT secrets** (minimum 32 characters)
2. **Enable HTTPS** everywhere
3. **Use environment-specific configs**
4. **Rotate secrets regularly**
5. **Use secrets management** (AWS Secrets Manager, etc.)
6. **Enable database SSL** connections

## Database Setup

### Production Database

1. **Create database:**
   ```sql
   CREATE DATABASE riseup_africa_production;
   ```

2. **Run migrations:**
   ```bash
   cd apps/api
   pnpm prisma:migrate deploy
   ```

3. **Enable SSL** (for cloud databases):
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

### Database Backups

**Using pg_dump:**
```bash
pg_dump -h localhost -U riseup -d riseup_africa > backup.sql
```

**Automated backups** (cron):
```bash
0 2 * * * pg_dump -h localhost -U riseup -d riseup_africa > /backups/riseup_$(date +\%Y\%m\%d).sql
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Using Cloudflare

1. Add your domain to Cloudflare
2. Update DNS records
3. Enable SSL/TLS (Full mode)
4. Configure page rules if needed

## Monitoring & Logging

### Application Monitoring

**PM2 Monitoring:**
```bash
pm2 monit
pm2 logs
```

**Docker Logs:**
```bash
docker-compose logs -f
docker logs -f riseup-api
```

### Health Checks

- API: `GET /health`
- Web: `GET /api/health`

### Recommended Tools

- **Sentry** - Error tracking
- **Datadog / New Relic** - APM
- **LogRocket** - Session replay
- **Uptime Robot** - Uptime monitoring

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall rules

2. **Build failures**
   - Clear node_modules and rebuild
   - Check Node.js version (>= 20)
   - Verify pnpm version

3. **Port conflicts**
   - Change ports in .env
   - Check what's using ports: `lsof -i :3000`

4. **Migration errors**
   - Ensure database exists
   - Check Prisma schema
   - Run `pnpm prisma:generate` first

## Support

For deployment issues, please:
1. Check logs
2. Verify environment variables
3. Ensure all prerequisites are met
4. Review this guide

---

**Last Updated**: [Current Date]

