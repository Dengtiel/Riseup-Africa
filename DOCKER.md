# Docker Quick Reference

Quick reference guide for Docker deployment of RiseUp Africa.

## Quick Start

### Production

```bash
# 1. Create environment file
cp .env.example .env
# Edit .env with your values

# 2. Start all services
docker-compose up -d --build

# 3. Run database migrations
docker-compose exec api pnpm prisma:migrate:deploy

# 4. Seed database (optional)
docker-compose exec api pnpm prisma:seed

# 5. Check status
docker-compose ps
docker-compose logs -f
```

### Development

```bash
# Start with hot reload
docker-compose -f docker-compose.dev.yml up

# In another terminal, run migrations
docker-compose -f docker-compose.dev.yml exec api pnpm prisma:migrate
```

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
```

### Stop Services
```bash
# Stop (keeps volumes)
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose build api
docker-compose build web

# Rebuild all
docker-compose build --no-cache
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U riseup -d riseup_africa

# Run Prisma commands
docker-compose exec api pnpm prisma:studio
docker-compose exec api pnpm prisma:migrate dev
```

### Individual Container Management
```bash
# Build individual images
docker build -f apps/api/Dockerfile -t riseup-api .
docker build -f apps/web/Dockerfile -t riseup-web .

# Run containers manually
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  riseup-api

docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:4000" \
  riseup-web
```

## Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
API_PORT=4001
WEB_PORT=3001
```

### Database Connection Issues
```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec api node -e "console.log(process.env.DATABASE_URL)"
```

### Build Failures
```bash
# Clean build
docker-compose build --no-cache

# Remove old images
docker system prune -a
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Environment Variables

See `.env.example` for all available environment variables.

**Required:**
- `JWT_SECRET` - Must be set for production
- `POSTGRES_PASSWORD` - Database password
- `NEXT_PUBLIC_API_URL` - API URL for web app

## Health Checks

Services include health checks:
- API: `http://localhost:4000/health` (if implemented)
- Web: `http://localhost:3000/api/health` (if implemented)
- Postgres: Automatic via `pg_isready`

Check health:
```bash
docker-compose ps
# Look for "healthy" status
```

## Volumes

Data persistence:
- `postgres_data` - PostgreSQL data directory
- Development volumes mount source code for hot reload

## Networks

All services communicate via `riseup-network` bridge network.

## Production Considerations

1. **Use strong secrets** in `.env`
2. **Enable HTTPS** with reverse proxy (Nginx/Traefik)
3. **Set up backups** for PostgreSQL volume
4. **Monitor resources** with `docker stats`
5. **Use Docker secrets** for sensitive data
6. **Configure resource limits** in docker-compose.yml

## Resource Limits Example

Add to docker-compose.yml:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Backup & Restore

### Backup Database
```bash
docker-compose exec postgres pg_dump -U riseup riseup_africa > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U riseup riseup_africa < backup.sql
```

---

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

