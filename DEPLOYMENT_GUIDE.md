# NeuroKinetics AI - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Database Deployment](#database-deployment)
7. [AI Services Deployment](#ai-services-deployment)
8. [Security Configuration](#security-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Scaling & Performance](#scaling--performance)
11. [Backup & Recovery](#backup--recovery)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive instructions for deploying NeuroKinetics AI to production environments. The platform consists of:

- **Backend**: Encore.ts application with PostgreSQL database
- **Frontend**: React + Vite application
- **AI Services**: Computer vision and ML services
- **Infrastructure**: Cloud-native deployment with containerization

### Deployment Options
1. **Encore Cloud** (Recommended for startups)
2. **AWS** (Production-ready enterprise)
3. **Google Cloud Platform** (Alternative enterprise option)
4. **Azure** (Microsoft ecosystem integration)
5. **Self-hosted** (On-premises deployment)

---

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Docker**: v20.0.0 or higher
- **Git**: For deployment automation

### Required Services
- **Cloud Provider Account** (AWS, GCP, or Azure)
- **Domain Name** with SSL certificate
- **Container Registry** (ECR, GCR, or ACR)
- **Load Balancer** (Application/Network)
- **CDN** (CloudFront, Cloud CDN, or Azure CDN)

### Development Tools
- **Encore CLI**: Latest version
- **Docker Desktop**: For local testing
- **kubectl**: For Kubernetes deployments
- **Helm**: For package management

---

## Environment Setup

### 1. Production Environment Variables

#### Backend Environment (.env.production)
```bash
# Application
NODE_ENV=production
PORT=4000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://username:password@host:5432/neurokinetics
DB_POOL_SIZE=20
DB_TIMEOUT=30000

# Authentication
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# AI Services
AI_SERVICE_URL=https://ai-api.yourdomain.com
AI_API_KEY=your-ai-service-api-key
COMPUTER_VISION_URL=https://cv-api.yourdomain.com
COMPUTER_VISION_KEY=your-cv-api-key

# External Services
EMAIL_SERVICE_URL=https://email-api.yourdomain.com
SMS_SERVICE_URL=https://sms-api.yourdomain.com
STORAGE_BUCKET=your-storage-bucket-name

# Security
CORS_ORIGIN=https://app.yourdomain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
DATADOG_API_KEY=your-datadog-api-key
```

#### Frontend Environment (.env.production)
```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_CLIENT_TARGET=https://api.yourdomain.com

# Authentication
VITE_AUTH_DOMAIN=yourdomain.auth0.com
VITE_AUTH_CLIENT_ID=your-auth0-client-id
VITE_AUTH_REDIRECT_URI=https://app.yourdomain.com/callback

# AI Services
VITE_AI_SERVICE_URL=https://ai-api.yourdomain.com
VITE_COMPUTER_VISION_URL=https://cv-api.yourdomain.com

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_REALTIME_NOTIFICATIONS=true

# Third-party Services
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=your-hotjar-id
```

### 2. Infrastructure Configuration

#### Docker Compose (Development)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: neurokinetics
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/neurokinetics
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:4000
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Backend Deployment

### Option 1: Encore Cloud Deployment (Recommended)

#### Prerequisites
- Encore account with billing enabled
- Git repository connected to Encore

#### Deployment Steps
```bash
# 1. Install Encore CLI
curl -L https://encore.dev/install.sh | bash

# 2. Login to Encore
encore auth login

# 3. Create production environment
encore env create production

# 4. Configure environment variables
encore config set --env=production DATABASE_URL=postgresql://...
encore config set --env=production JWT_SECRET=your-secret-key

# 5. Deploy to production
git push encore main

# 6. Monitor deployment
encore logs --env=production
```

#### Scaling Configuration
```typescript
// encore.app configuration
{
  "id": "neurokinetics-ai",
  "services": [
    {
      "name": "backend",
      "resources": {
        "cpu": "1000m",
        "memory": "2Gi",
        "replicas": 3
      }
    }
  ]
}
```

### Option 2: AWS Deployment

#### Infrastructure Setup
```bash
# 1. Create VPC and subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16
aws ec2 create-subnets --vpc-id vpc-xxx

# 2. Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier neurokinetics-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20

# 3. Create ECS cluster
aws ecs create-cluster --cluster-name neurokinetics-cluster

# 4. Create Application Load Balancer
aws elbv2 create-load-balancer --name neurokinetics-alb
```

#### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

#### ECS Task Definition
```json
{
  "family": "neurokinetics-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::xxx:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "xxx.dkr.ecr.region.amazonaws.com/neurokinetics-backend:latest",
      "portMappings": [
        {
          "containerPort": 4000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:xxx:secret:database-url"
        }
      ]
    }
  ]
}
```

### Option 3: Google Cloud Platform

#### Cloud Run Deployment
```bash
# 1. Build and push Docker image
gcloud builds submit --tag gcr.io/PROJECT-ID/neurokinetics-backend

# 2. Deploy to Cloud Run
gcloud run deploy neurokinetics-backend \
  --image gcr.io/PROJECT-ID/neurokinetics-backend \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 1 \
  --allow-unauthenticated

# 3. Setup Cloud SQL PostgreSQL
gcloud sql instances create neurokinetics-db \
  --database-version POSTGRES_14 \
  --tier db-f1-micro \
  --region us-central1
```

---

## Frontend Deployment

### Static Site Deployment (Recommended)

#### AWS S3 + CloudFront
```bash
# 1. Create S3 bucket
aws s3 mb s3://neurokinetics-app-bucket

# 2. Configure bucket for static hosting
aws s3 website s3://neurokinetics-app-bucket --index-document index.html

# 3. Build frontend
npm run build

# 4. Deploy to S3
aws s3 sync dist/ s3://neurokinetics-app-bucket --delete

# 5. Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name neurokinetics-app-bucket.s3.amazonaws.com \
  --default-root-object index.html
```

#### Netlify Deployment
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build frontend
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=dist

# 4. Configure environment variables
netlify env:set VITE_API_URL https://api.yourdomain.com
```

#### Vercel Deployment
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy to Vercel
vercel --prod

# 3. Configure environment variables
vercel env:add VITE_API_URL production
```

### SPA Configuration
```typescript
// vercel.json or netlify.toml
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

---

## Database Deployment

### PostgreSQL Production Setup

#### AWS RDS
```bash
# 1. Create parameter group
aws rds create-db-parameter-group \
  --db-parameter-group-name neurokinetics-params \
  --db-parameter-group-family postgres14 \
  --description "NeuroKinetics DB parameters"

# 2. Modify parameters for performance
aws rds modify-db-parameter-group \
  --db-parameter-group-name neurokinetics-params \
  --parameters \
    "ParameterName=max_connections,ParameterValue=200,ApplyMethod=immediate" \
    "ParameterName=shared_buffers,ParameterValue=256MB,ApplyMethod=pending-reboot"

# 3. Create production database
aws rds create-db-instance \
  --db-instance-identifier neurokinetics-prod \
  --db-instance-class db.r5.large \
  --engine postgres \
  --engine-version 14.9 \
  --master-username postgres \
  --master-user-password your-secure-password \
  --allocated-storage 100 \
  --storage-type gp2 \
  --storage-encrypted \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --db-parameter-group-name neurokinetics-params \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name neurokinetics-subnet-group
```

#### Google Cloud SQL
```bash
# 1. Create Cloud SQL instance
gcloud sql instances create neurokinetics-prod \
  --database-version POSTGRES_14 \
  --tier db-n1-standard-2 \
  --region us-central1 \
  --storage-size 100GB \
  --storage-type SSD \
  --backup-start-time 03:00 \
  --maintenance-window-day SUN \
  --maintenance-window-hour 4 \
  --storage-auto-increase \
  --storage-encryption-key projects/PROJECT/locations/global/keyRings/KEYRING/cryptoKeys/KEY

# 2. Create database
gcloud sql databases create neurokinetics --instance=neurokinetics-prod

# 3. Create user
gcloud sql users create dbuser --instance=neurokinetics-prod --password=your-password
```

#### Database Migration Strategy
```bash
# 1. Backup existing database
pg_dump -h old-host -U postgres neurokinetics > backup.sql

# 2. Create new database
createdb -h new-host -U postgres neurokinetics

# 3. Restore backup
psql -h new-host -U postgres -d neurokinetics < backup.sql

# 4. Run migrations
npm run migrate:production
```

---

## AI Services Deployment

### Computer Vision Service

#### Docker Configuration
```dockerfile
FROM python:3.9-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8080

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: computer-vision-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: computer-vision
  template:
    metadata:
      labels:
        app: computer-vision
    spec:
      containers:
      - name: computer-vision
        image: gcr.io/PROJECT/computer-vision:latest
        ports:
        - containerPort: 8080
        env:
        - name: MODEL_PATH
          value: "/models"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: model-storage
          mountPath: /models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
```

#### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: computer-vision-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: computer-vision-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## Security Configuration

### SSL/TLS Configuration

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Security Headers
```typescript
// Backend middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

### Database Security
```sql
-- Create dedicated application user
CREATE USER neurokinetics_app WITH PASSWORD 'secure-password';
GRANT CONNECT ON DATABASE neurokinetics TO neurokinetics_app;
GRANT USAGE ON SCHEMA public TO neurokinetics_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO neurokinetics_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO neurokinetics_app;

-- Enable SSL connections
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';
```

---

## Monitoring & Logging

### Application Monitoring

#### Prometheus Configuration
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'neurokinetics-backend'
    static_configs:
      - targets: ['backend:4000']
    metrics_path: '/metrics'
    scrape_interval: 30s
    
  - job_name: 'neurokinetics-database'
    static_configs:
      - targets: ['postgres:5432']
    metrics_path: '/metrics'
```

#### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "NeuroKinetics AI Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

### Log Management

#### Structured Logging
```typescript
// Backend logging configuration
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### Log Aggregation with ELK Stack
```yaml
# docker-compose.yml for ELK
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
```

---

## Scaling & Performance

### Horizontal Scaling

#### Backend Scaling
```typescript
// Load balancer configuration
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Start server
  require('./server');
}
```

#### Database Scaling
```sql
-- Read replica setup
CREATE PUBLICATION neurokinetics_publication FOR ALL TABLES;

-- On replica server
CREATE SUBSCRIPTION neurokinetics_subscription
CONNECTION 'host=primary-db port=5432 dbname=neurokinetics user=replica_user password=password'
PUBLICATION neurokinetics_publication;
```

### Performance Optimization

#### Caching Strategy
```typescript
// Redis caching
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

// Cache middleware
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, ttl, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

#### CDN Configuration
```yaml
# CloudFront configuration
DistributionConfig:
  Origins:
    - DomainName: your-frontend-bucket.s3.amazonaws.com
      Id: S3-frontend
      S3OriginConfig:
        OriginAccessIdentity: ''
  DefaultCacheBehavior:
    TargetOriginId: S3-frontend
    ViewerProtocolPolicy: redirect-to-https
    AllowedMethods:
      - GET
      - HEAD
    CachedMethods:
      - GET
      - HEAD
    Compress: true
    CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
```

---

## Backup & Recovery

### Database Backup Strategy

#### Automated Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="neurokinetics_backup_${DATE}.sql"

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d neurokinetics > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp ${BACKUP_FILE}.gz s3://neurokinetics-backups/database/

# Clean up old backups (keep 30 days)
find /backups -name "neurokinetics_backup_*.sql.gz" -mtime +30 -delete
```

#### Point-in-Time Recovery
```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'test ! -f /archive/%f && cp %p /archive/%f';

-- Create base backup
SELECT pg_start_backup('base_backup');
-- Copy data directory
SELECT pg_stop_backup();
```

### Application Backup

#### Configuration Backup
```bash
# Backup application configuration
kubectl get configmaps -o yaml > configmaps-backup.yaml
kubectl get secrets -o yaml > secrets-backup.yaml

# Backup persistent volumes
kubectl get pv -o yaml > persistent-volumes-backup.yaml
```

#### Disaster Recovery Plan
```yaml
# Recovery procedures
disaster_recovery:
  database:
    rpo: 1 hour  # Recovery Point Objective
    rto: 4 hours # Recovery Time Objective
    procedure:
      1. "Restore latest backup from S3"
      2. "Apply WAL files for point-in-time recovery"
      3. "Verify data integrity"
      4. "Update application configuration"
  
  application:
    rpo: 24 hours
    rto: 2 hours
    procedure:
      1. "Deploy from latest container image"
      2. "Restore configuration from backup"
      3. "Update DNS records if needed"
      4. "Verify application functionality"
```

---

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Test database connection
psql -h your-db-host -U postgres -d neurokinetics -c "SELECT version();"

# Check connection pool
SELECT count(*) FROM pg_stat_activity;

# Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### Performance Issues
```bash
# Check CPU and memory usage
top -p $(pgrep node)

# Monitor Node.js performance
node --inspect server.js

# Check for memory leaks
node --expose-gc server.js
```

#### Deployment Issues
```bash
# Check pod status
kubectl get pods -n neurokinetics

# View pod logs
kubectl logs -f deployment/neurokinetics-backend -n neurokinetics

# Check service endpoints
kubectl get endpoints -n neurokinetics

# Debug networking
kubectl run debug --image=nicolaka/netshoot --rm -it -- /bin/bash
```

### Health Checks

#### Application Health Endpoint
```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      ai_service: await checkAIService()
    }
  };
  
  const isHealthy = Object.values(health.services).every(s => s.status === 'healthy');
  res.status(isHealthy ? 200 : 503).json(health);
});
```

#### Kubernetes Health Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 4000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 4000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
```

### Support Resources

#### Monitoring Dashboards
- **Application Metrics**: Grafana dashboard at https://grafana.yourdomain.com
- **Infrastructure Metrics**: CloudWatch/Google Cloud Monitoring
- **Error Tracking**: Sentry dashboard at https://sentry.io/organizations/your-org

#### Log Analysis
- **Centralized Logging**: ELK stack at https://kibana.yourdomain.com
- **Application Logs**: Encore dashboard or cloud provider logs
- **Database Logs**: RDS/Cloud SQL logging console

#### Performance Monitoring
- **Real User Monitoring**: Datadog RUM or Google Analytics
- **Synthetic Monitoring**: Pingdom or UptimeRobot
- **Load Testing**: K6 or JMeter for performance testing

---

## Post-Deployment Checklist

### ✅ Immediate Checks
- [ ] Application is accessible at configured domain
- [ ] SSL certificate is properly installed and valid
- [ ] Database connections are working
- [ ] All API endpoints are responding
- [ ] Frontend assets are loading correctly
- [ ] Authentication is working
- [ ] AI services are accessible

### ✅ Performance Validation
- [ ] Page load times are under 3 seconds
- [ ] API response times are under 500ms
- [ ] Database queries are optimized
- [ ] CDN is serving static assets
- [ ] Auto-scaling is configured and tested

### ✅ Security Validation
- [ ] Security headers are properly configured
- [ ] Rate limiting is working
- [ ] Input validation is in place
- [ ] Database access is restricted
- [ ] Secrets are properly managed
- [ ] Monitoring and alerting is configured

### ✅ Backup and Recovery
- [ ] Automated backups are configured
- [ ] Backup restoration is tested
- [ ] Disaster recovery plan is documented
- [ ] Data retention policies are in place

---

## Contact Information

### Support Team
- **Email**: support@neurokinetics-ai.com
- **Phone**: +1-555-123-4567
- **Slack**: #neurokinetics-support
- **Emergency**: +1-555-999-8888

### Documentation
- **User Manual**: docs.neurokinetics-ai.com/user-manual
- **Developer Manual**: docs.neurokinetics-ai.com/developer-manual
- **API Documentation**: api.neurokinetics-ai.com/docs
- **Status Page**: status.neurokinetics-ai.com

---

*This deployment guide is updated regularly. For the latest version, visit: docs.neurokinetics-ai.com/deployment*