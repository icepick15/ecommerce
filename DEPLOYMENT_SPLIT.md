# AWS Deployment Guide - Split Architecture
## Frontend (AWS Amplify) + Backend (AWS EC2 Docker + Redis)

---

## Part 1: Frontend Deployment to AWS Amplify

### Step 1: Prepare Frontend

The frontend is already configured to use environment variables for the backend API URL.

**Configuration:** `frontend/src/lib/axios.js`
```javascript
baseURL: import.meta.env.VITE_API_URL || "/api"
```

### Step 2: Deploy to AWS Amplify

1. **Connect Repository**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select branch: `main`

2. **Configure Build Settings**
   - Amplify will auto-detect the [`amplify.yml`](amplify.yml ) configuration
   - Verify it matches:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - cd frontend
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: frontend/dist
         files:
           - "**/*"
     ```

3. **Add Environment Variable**
   - Go to App Settings → Environment variables
   - Add:
     ```
     VITE_API_URL=http://your-ec2-ip-or-domain:5000/api
     ```
   - **Important:** You'll update this after deploying the backend

4. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete (~3-5 minutes)
   - Note your Amplify URL: `https://main.xxxxxxxxx.amplifyapp.com`

### Step 3: Update After Backend Deployment

Once your EC2 backend is running, update `VITE_API_URL`:
```
VITE_API_URL=https://api.yourdomain.com/api
```
Or use EC2 public IP:
```
VITE_API_URL=http://3.xxx.xxx.xxx:5000/api
```

Then trigger a redeploy in Amplify Console.

---

## Part 2: Backend Deployment to AWS EC2 with Docker + Redis

### Prerequisites

- AWS Account
- EC2 instance (t3.small or larger recommended)
- Domain name (optional but recommended)
- MongoDB Atlas account
- Cloudinary account
- Paystack account

### Step 1: Launch EC2 Instance

1. **Create EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.small (2 vCPU, 2GB RAM minimum)
   - Storage: 20GB gp3
   - Security Group:
     - SSH (22) - Your IP only
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
     - Custom TCP (5000) - 0.0.0.0/0 (temporary, will use reverse proxy)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

### Step 2: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### Step 3: Clone Repository & Setup Environment

```bash
# Clone your repository
git clone https://github.com/your-username/ecommerce.git
cd ecommerce

# Create production environment file
cp .env.docker.example .env.docker
nano .env.docker
```

**Edit `.env.docker` with production values:**

```bash
# MongoDB Atlas (Whitelist EC2 IP in MongoDB Network Access!)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Generate NEW JWT secrets for production
ACCESS_TOKEN_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
REFRESH_TOKEN_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Paystack LIVE key
PAYSTACK_SECRET_KEY=sk_live_your_paystack_live_key

# Your Amplify frontend URL
CLIENT_URL=https://main.xxxxxxxxx.amplifyapp.com
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start services
docker-compose --env-file .env.docker up -d

# Check logs
docker-compose logs -f

# Verify services are running
docker ps
```

You should see:
- `ecommerce-backend` (Node.js API)
- `ecommerce-redis` (Redis cache)

### Step 5: Configure Reverse Proxy (Nginx)

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/ecommerce-api
```

**Add configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Or use EC2 IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Configure SSL with Certbot (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

Now your backend will be available at `https://api.yourdomain.com`

### Step 7: Update Frontend Environment Variable

Go back to AWS Amplify Console:
1. App Settings → Environment variables
2. Update `VITE_API_URL` to:
   ```
   VITE_API_URL=https://api.yourdomain.com/api
   ```
3. Redeploy frontend

---

## Environment Variables Summary

### Frontend (AWS Amplify)
| Variable | Value |
|----------|-------|
| VITE_API_URL | `https://api.yourdomain.com/api` |

### Backend (EC2 Docker)
| Variable | Required | Example |
|----------|----------|---------|
| MONGO_URI | Yes | `mongodb+srv://...` |
| ACCESS_TOKEN_SECRET | Yes | 64-char hex string |
| REFRESH_TOKEN_SECRET | Yes | 64-char hex string |
| CLOUDINARY_CLOUD_NAME | Yes | `your-cloud-name` |
| CLOUDINARY_API_KEY | Yes | `123456789012345` |
| CLOUDINARY_API_SECRET | Yes | `AbCdEfGhIjKlMnOp` |
| PAYSTACK_SECRET_KEY | Yes | `sk_live_...` |
| CLIENT_URL | Yes | Your Amplify URL |

---

## MongoDB Atlas Configuration

1. **Whitelist EC2 IP**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address → Add your EC2 public IP
   - Or use `0.0.0.0/0` (allow all - ensure strong password!)

2. **Database User**
   - Ensure user has read/write permissions
   - Use strong password

---

## Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f redis

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild after code changes
git pull
docker-compose down
docker-compose up -d --build

# Check service health
docker ps
docker-compose ps

# Access Redis CLI
docker exec -it ecommerce-redis redis-cli
```

---

## Testing the Deployment

### 1. Test Backend API
```bash
curl https://api.yourdomain.com/api/products
```

### 2. Test Frontend
- Visit your Amplify URL
- Try signing up/logging in
- Add products to cart
- Test checkout flow

### 3. Test Redis Caching
```bash
# Check Redis connection
docker exec -it ecommerce-redis redis-cli ping
# Should return: PONG

# Check cached data
docker exec -it ecommerce-redis redis-cli
127.0.0.1:6379> KEYS *
127.0.0.1:6379> GET featured_products
```

---

## Monitoring & Maintenance

### 1. Set Up CloudWatch (AWS)
- Monitor EC2 CPU, memory, disk usage
- Set up alarms for high usage

### 2. Application Logs
```bash
# View application logs
docker-compose logs --tail=100 -f backend

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Backup Strategy
- **MongoDB:** Enable automated backups in MongoDB Atlas
- **Redis Data:** Included in docker-compose volume
- **Docker Volumes Backup:**
  ```bash
  docker run --rm -v ecommerce_redis-data:/data -v $(pwd):/backup ubuntu tar czf /backup/redis-backup.tar.gz /data
  ```

### 4. Auto-Restart on Reboot
```bash
# Docker compose services auto-restart with "unless-stopped"
# Ensure Docker starts on boot:
sudo systemctl enable docker
```

---

## Troubleshooting

### Backend not responding
```bash
# Check if containers are running
docker ps

# Check backend logs
docker-compose logs backend

# Restart services
docker-compose restart
```

### Redis connection failed
```bash
# Check Redis container
docker-compose ps redis

# Test Redis connectivity
docker exec -it ecommerce-redis redis-cli ping
```

### MongoDB connection timeout
- Verify EC2 IP is whitelisted in MongoDB Atlas
- Check MONGO_URI in `.env.docker`

### CORS errors
- Verify `CLIENT_URL` in `.env.docker` matches your Amplify URL
- Check backend logs for CORS-related errors

### SSL certificate issues
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Cost Optimization

### AWS EC2
- Use t3.small ($0.0208/hour ≈ $15/month)
- Use Reserved Instances for 30% savings
- Set up Auto Scaling if traffic grows

### MongoDB Atlas
- Use M0 free tier (512MB) for development
- Upgrade to M10 ($0.08/hour ≈ $57/month) for production

### Cloudinary
- Free tier: 25GB storage, 25GB bandwidth
- Monitor usage to avoid overages

### Total Estimated Monthly Cost
- EC2 t3.small: ~$15
- MongoDB M10: ~$57
- Cloudinary: $0 (free tier)
- **Total: ~$72/month**

---

## Security Checklist

- ✅ Use SSL/TLS (HTTPS) for both frontend and backend
- ✅ Firewall rules limiting SSH to your IP only
- ✅ Strong passwords for MongoDB
- ✅ Different JWT secrets for production
- ✅ Paystack LIVE keys (not test keys)
- ✅ Regular security updates: `sudo apt update && sudo apt upgrade`
- ✅ Nginx rate limiting (prevent DDoS)
- ✅ MongoDB IP whitelisting

---

## Quick Reference Commands

```bash
# Deploy/Update Backend
cd ecommerce
git pull
docker-compose down
docker-compose --env-file .env.docker up -d --build

# View Logs
docker-compose logs -f

# Stop All Services
docker-compose down

# Database Backup
docker exec ecommerce-backend node backend/scripts/backup.js

# SSL Certificate Renewal
sudo certbot renew
```

---

**Your split deployment is ready!** 🚀

- Frontend: AWS Amplify (auto-scaling, CDN, HTTPS)
- Backend: AWS EC2 (Docker + Redis)
- Database: MongoDB Atlas (managed)
- Images: Cloudinary (managed)
