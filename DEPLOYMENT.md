# AWS Amplify Deployment Guide

## Environment Variables Configuration

### Backend Environment Variables (Required)

Configure these in AWS Amplify Console → App Settings → Environment Variables:

```bash
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Redis Cache (Upstash)
UPSTASH_REDIS_URL=rediss://default:<password>@<host>.upstash.io:6379

# JWT Secrets (Generate new ones for production)
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Paystack Payment (Use LIVE keys for production)
PAYSTACK_SECRET_KEY=sk_live_<your-paystack-live-secret-key>

# Application URLs
CLIENT_URL=https://<your-amplify-app-url>
NODE_ENV=production

# Server Port (Optional - Amplify manages this)
PORT=5000
```

### Frontend Environment Variables

**None required** - The frontend uses Vite proxy configuration which is for development only. In production, API calls should target the backend URL directly.

## Security Checklist

✅ **Verified - No secrets in source code**

- All sensitive values use `process.env.*` variables
- `.env` file is properly gitignored
- No hardcoded API keys, tokens, or passwords found

✅ **Code cleaned**

- Duplicate `backend/lib/stripe.js` removed (functionality in `paystack.js`)
- Development console.log statements removed from production-critical paths
- Code is consolidated and ready for deployment

## Pre-Deployment Steps

### 1. MongoDB Atlas Configuration

- Whitelist AWS Amplify IP ranges in MongoDB Atlas Network Access
- Or use `0.0.0.0/0` (allow all IPs) if using proper authentication

### 2. Upstash Redis Configuration

- Ensure Redis URL is accessible from AWS
- Verify TLS configuration is compatible

### 3. Cloudinary Setup

- Confirm API keys are active
- Check upload preset configuration if needed

### 4. Paystack Configuration

**CRITICAL**: Update to production keys

- Replace `sk_test_*` with `sk_live_*` in environment variables
- Configure webhook URL in Paystack dashboard (if using webhooks)
- Test payment flow in production mode

### 5. Generate Production JWT Secrets

**IMPORTANT**: Do NOT use the same secrets from development

Generate new secrets for production:

```bash
# Run this locally to generate new secrets
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

## AWS Amplify Build Configuration

### Backend Build Settings (amplify.yml)

```yaml
version: 1
backend:
  phases:
    preBuild:
      commands:
        - cd backend
        - npm ci
    build:
      commands:
        - npm run build
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
  cache:
    paths:
      - frontend/node_modules/**/*
      - backend/node_modules/**/*
```

### Backend Server Configuration

Ensure `backend/server.js` serves the frontend static files in production:

```javascript
// This is already implemented in your server.js
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}
```

## Deployment Steps

### Option 1: Deploy as a Fullstack App (Recommended)

1. **Connect Repository**

   - Go to AWS Amplify Console
   - Connect your GitHub/GitLab repository
   - Select the main/master branch

2. **Configure Build Settings**

   - Use the amplify.yml configuration above
   - Set Node.js version to 18 or higher

3. **Add Environment Variables**

   - Copy all backend environment variables from the list above
   - Ensure NODE_ENV=production

4. **Deploy**
   - Click "Save and Deploy"
   - Monitor build logs for any errors

### Option 2: Separate Backend and Frontend

**Backend (AWS Elastic Beanstalk or EC2):**

- Deploy Node.js backend separately
- Configure environment variables
- Get backend URL (e.g., `https://api.yourdomain.com`)

**Frontend (AWS Amplify):**

- Update `frontend/src/lib/axios.js` to use production backend URL:
  ```javascript
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
  });
  ```
- Add `VITE_API_URL=https://api.yourdomain.com/api` to Amplify environment variables

## Post-Deployment Verification

1. **Test Authentication Flow**

   - Sign up new user
   - Login
   - Verify JWT tokens are working

2. **Test Product Operations**

   - Create product (admin)
   - Upload images (verify Cloudinary integration)
   - View products (public)

3. **Test Payment Flow**

   - Add items to cart
   - Apply coupon
   - Complete checkout with test card
   - Verify order creation

4. **Test Analytics**
   - Access admin dashboard
   - Verify analytics data loads
   - Check charts render correctly

## Common Issues and Solutions

### Issue: "Bearer undefined" in Payment

**Solution**: Verify `PAYSTACK_SECRET_KEY` is set in environment variables

### Issue: MongoDB Connection Failed

**Solution**: Whitelist Amplify's IP in MongoDB Atlas Network Access

### Issue: Images Not Uploading

**Solution**: Check Cloudinary credentials in environment variables

### Issue: 401 Errors on API Calls

**Solution**: Verify `CLIENT_URL` matches your Amplify domain for CORS

### Issue: Redis Connection Timeout

**Solution**: Ensure `UPSTASH_REDIS_URL` uses `rediss://` (TLS) protocol

## Environment Variables Summary

| Variable              | Type               | Required | Example                         |
| --------------------- | ------------------ | -------- | ------------------------------- |
| MONGO_URI             | Connection String  | Yes      | mongodb+srv://...               |
| UPSTASH_REDIS_URL     | Connection String  | Yes      | rediss://...                    |
| ACCESS_TOKEN_SECRET   | Secret (64+ chars) | Yes      | Generated hex string            |
| REFRESH_TOKEN_SECRET  | Secret (64+ chars) | Yes      | Generated hex string            |
| CLOUDINARY_CLOUD_NAME | String             | Yes      | your-cloud-name                 |
| CLOUDINARY_API_KEY    | String             | Yes      | 123456789012345                 |
| CLOUDINARY_API_SECRET | Secret             | Yes      | AbCdEfGhIjKlMnOp                |
| PAYSTACK_SECRET_KEY   | Secret             | Yes      | sk*live*...                     |
| CLIENT_URL            | URL                | Yes      | https://your-app.amplifyapp.com |
| NODE_ENV              | String             | Yes      | production                      |
| PORT                  | Number             | Optional | 5000                            |

## Security Best Practices

1. **Never commit `.env` files** (already gitignored ✅)
2. **Use different secrets for production and development**
3. **Rotate JWT secrets periodically**
4. **Use Paystack live keys only in production**
5. **Enable MongoDB IP whitelisting**
6. **Use HTTPS only (Amplify provides this automatically)**
7. **Review Cloudinary upload limits and security settings**
8. **Monitor Paystack webhook signatures if implementing webhooks**

---

**Your codebase is now clean and ready for deployment!** 🚀
