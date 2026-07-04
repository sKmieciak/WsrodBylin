# Deployment Guide

This guide covers the deployment process for the Plant Store Frontend application.

## Build Process

### Production Build

The application uses Vite for building and bundling:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build locally
npm run preview
```

This generates a `dist/` folder containing optimized static files ready for deployment.

### Build Optimization

The build process includes:

- TypeScript compilation
- Code minification and compression
- Tree shaking to remove unused code
- Asset optimization (images, CSS, JS)
- Source map generation for debugging

## Environment Configuration

### Environment Variables

Create appropriate `.env` files for different environments:

#### Development (.env.development)

```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_APP_VERSION=1.0.0-dev
NODE_ENV=development
```

#### Production (.env.production)

```env
VITE_API_URL=https://api.plantstore.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

### Build Configuration

Vite configuration for different environments:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    sourcemap: mode === "development",
    minify: mode === "production",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@mui/material", "@emotion/react"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7116",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
```

## Hosting Platforms

### Vercel (Recommended)

#### Setup

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Environment Variables

Set in Vercel dashboard:

- `VITE_API_URL`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_APP_VERSION`

#### Custom Domain

1. Add domain in Vercel dashboard
2. Configure DNS records:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

### Netlify

#### Setup

1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Redirects Configuration

Create `_redirects` file in `public/` folder:

```
/*    /index.html   200
/api/* https://api.plantstore.com/api/:splat 200
```

#### Environment Variables

Set in Netlify dashboard under "Environment variables"

### AWS S3 + CloudFront

#### S3 Setup

1. Create S3 bucket
2. Enable static website hosting
3. Configure bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

#### CloudFront Distribution

1. Create CloudFront distribution
2. Configure origin to point to S3 bucket
3. Set up custom error pages for SPA routing:
   - Error Code: 403, 404
   - Response Page Path: /index.html
   - Response Code: 200

#### Deployment Script

```bash
#!/bin/bash
# build-and-deploy.sh

# Build the application
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## CI/CD Pipeline

### GitHub Actions

#### Workflow Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_STRIPE_PUBLIC_KEY: ${{ secrets.VITE_STRIPE_PUBLIC_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm test

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:production:
  stage: deploy
  script:
    - aws s3 sync dist/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  only:
    - main
```

## Performance Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Generate bundle report
npm run build -- --mode analyze
```

### Code Splitting

Implement route-based code splitting:

```typescript
import { lazy, Suspense } from "react";

const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));

// In routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/products/:id" element={<ProductPage />} />
    <Route path="/cart" element={<CartPage />} />
  </Routes>
</Suspense>;
```

### Asset Optimization

- Compress images using tools like `imagemin`
- Use WebP format for modern browsers
- Implement lazy loading for images
- Minify CSS and JavaScript

## Monitoring and Analytics

### Error Tracking

Integrate with error tracking services:

```typescript
// utils/errorTracking.ts
class ErrorTracker {
  static init() {
    if (process.env.NODE_ENV === "production") {
      // Initialize error tracking service (e.g., Sentry)
    }
  }

  static captureError(error: Error, context?: any) {
    if (process.env.NODE_ENV === "production") {
      // Send error to tracking service
    } else {
      console.error(error, context);
    }
  }
}
```

### Performance Monitoring

- Use Lighthouse CI for performance audits
- Monitor Core Web Vitals
- Set up real user monitoring (RUM)

### Analytics

Integrate with analytics platforms:

```typescript
// utils/analytics.ts
class Analytics {
  static trackPageView(path: string) {
    if (typeof gtag !== "undefined") {
      gtag("config", "GA_MEASUREMENT_ID", {
        page_path: path,
      });
    }
  }

  static trackEvent(eventName: string, parameters?: any) {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, parameters);
    }
  }
}
```

## Security Considerations

### Content Security Policy

```html
<!-- In index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://js.stripe.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https:;
               connect-src 'self' https://api.plantstore.com;" />
```

### HTTPS Configuration

- Enforce HTTPS in production
- Use HTTP Strict Transport Security (HSTS)
- Configure secure headers

### Environment Security

- Never commit sensitive keys to version control
- Use environment variables for configuration
- Rotate API keys regularly
- Implement proper CORS policies

## Rollback Strategy

### Version Tagging

```bash
# Tag releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### Deployment Rollback

Most hosting platforms support instant rollback:

- **Vercel**: Rollback through dashboard
- **Netlify**: Deploy previous commit
- **AWS**: Update CloudFront to point to previous S3 version

### Database Considerations

- Ensure frontend is backward compatible
- Coordinate with backend deployment
- Test rollback scenarios in staging

## Health Checks

### Application Health

Implement health check endpoint:

```typescript
// utils/healthCheck.ts
export const healthCheck = {
  async checkServices() {
    const checks = {
      api: await this.checkAPI(),
      auth: await this.checkAuth(),
      payment: await this.checkPayment(),
    };

    return {
      status: Object.values(checks).every(Boolean) ? "healthy" : "unhealthy",
      checks,
    };
  },
};
```

### Monitoring Setup

- Set up uptime monitoring
- Configure alerting for downtime
- Monitor performance metrics
- Track error rates

## Backup and Recovery

### Static Assets

- Backup build artifacts
- Version control for all source code
- Document deployment procedures
- Maintain staging environment for testing

### Data Recovery

- Coordinate with backend for user data
- Implement graceful degradation
- Cache critical data locally
- Plan for API outages
