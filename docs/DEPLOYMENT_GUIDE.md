# PlantStore Deployment Guide

## 📋 Overview

This guide covers different deployment strategies for the PlantStore application, from development setup to production deployment on various platforms.

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React SPA)   │───▶│   (.NET API)    │───▶│   (SQLite/SQL)  │
│   Port: 80/443  │    │   Port: 5000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start (Development)

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- Git

### 1. Clone and Setup

```powershell
# Clone repository
git clone <repository-url>
cd PlantStore

# Backend setup
cd Backend/PlantStore.Api
dotnet restore
dotnet ef database update

# Frontend setup
cd ../../Frontend/plant-store-frontend
npm install
```

### 2. Configure Environment

**Backend (`appsettings.Development.json`):**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shop.db"
  },
  "Jwt": {
    "Key": "your-secret-key-minimum-32-characters",
    "Issuer": "PlantStore.Api",
    "Audience": "PlantStore.Client",
    "DurationInMinutes": 60
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_..."
  }
}
```

**Frontend (`.env.local`):**

```bash
VITE_API_URL=https://localhost:7001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development Servers

```powershell
# Terminal 1 - Backend
cd Backend/PlantStore.Api
dotnet run

# Terminal 2 - Frontend
cd Frontend/plant-store-frontend
npm run dev
```

Access:

- Frontend: http://localhost:5173
- Backend API: https://localhost:7001
- Swagger UI: https://localhost:7001/swagger

## 🌐 Production Deployment

### Option 1: Traditional Web Server (IIS/Nginx)

#### Backend Deployment

1. **Publish the API:**

```powershell
cd Backend/PlantStore.Api
dotnet publish -c Release -o ./publish
```

2. **Configure Production Settings:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-sql-server;Database=PlantStore;Trusted_Connection=true;"
  },
  "Jwt": {
    "Key": "your-production-secret-key-minimum-32-characters",
    "Issuer": "PlantStore.Api",
    "Audience": "PlantStore.Client",
    "DurationInMinutes": 60
  },
  "Stripe": {
    "SecretKey": "sk_live_...",
    "PublishableKey": "pk_live_..."
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

3. **Deploy to IIS:**

- Install .NET 8 Hosting Bundle
- Create application pool (.NET CLR Version: No Managed Code)
- Deploy published files to wwwroot
- Configure application pool identity for database access

#### Frontend Deployment

1. **Build for Production:**

```bash
cd Frontend/plant-store-frontend
npm run build
```

2. **Configure Production Variables:**

```bash
VITE_API_URL=https://api.yourplantstore.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

3. **Deploy Static Files:**

- Upload `dist` folder contents to web server
- Configure web server for SPA routing (see Nginx config below)

#### Nginx Configuration

```nginx
# Frontend (SPA)
server {
    listen 80;
    server_name yourplantstore.com;
    root /var/www/plantstore-frontend;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# API Proxy
server {
    listen 80;
    server_name api.yourplantstore.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Cloud Deployment (Azure)

#### Azure App Service Deployment

1. **Create Azure Resources:**

```powershell
# Create resource group
az group create --name PlantStore-RG --location "East US"

# Create App Service plan
az appservice plan create --name PlantStore-Plan --resource-group PlantStore-RG --sku B1

# Create Web App for API
az webapp create --resource-group PlantStore-RG --plan PlantStore-Plan --name plantstore-api --runtime "DOTNET|8.0"

# Create Web App for Frontend
az webapp create --resource-group PlantStore-RG --plan PlantStore-Plan --name plantstore-frontend --runtime "NODE|18-lts"

# Create SQL Database
az sql server create --name plantstore-sql --resource-group PlantStore-RG --admin-user sqladmin --admin-password YourPassword123!
az sql db create --resource-group PlantStore-RG --server plantstore-sql --name PlantStore
```

2. **Configure Application Settings:**

```powershell
# API Configuration
az webapp config appsettings set --resource-group PlantStore-RG --name plantstore-api --settings @appsettings.json

# Frontend Configuration
az webapp config appsettings set --resource-group PlantStore-RG --name plantstore-frontend --settings VITE_API_URL=https://plantstore-api.azurewebsites.net/api
```

3. **Deploy Applications:**

```powershell
# Deploy API
cd Backend/PlantStore.Api
az webapp deploy --resource-group PlantStore-RG --name plantstore-api --src-path ./publish.zip

# Deploy Frontend
cd Frontend/plant-store-frontend
npm run build
az webapp deploy --resource-group PlantStore-RG --name plantstore-frontend --src-path ./dist
```

#### Azure SQL Database Setup

1. **Update Connection String:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:plantstore-sql.database.windows.net,1433;Initial Catalog=PlantStore;Persist Security Info=False;User ID=sqladmin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

2. **Run Migrations:**

```powershell
# From local machine with Azure connectivity
dotnet ef database update --connection "Server=tcp:plantstore-sql.database.windows.net,1433;Initial Catalog=PlantStore;Persist Security Info=False;User ID=sqladmin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

### Option 3: Docker Containerization

#### Backend Dockerfile

```dockerfile
# Backend/PlantStore.Api/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PlantStore.Api.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build "PlantStore.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PlantStore.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlantStore.Api.dll"]
```

#### Frontend Dockerfile

```dockerfile
# Frontend/plant-store-frontend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: plantstore
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: ./Backend/PlantStore.Api
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=database;Database=plantstore;Username=postgres;Password=password123
    ports:
      - "5000:5000"
    depends_on:
      - database

  frontend:
    build:
      context: ./Frontend/plant-store-frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  postgres_data:
```

#### Deploy with Docker

```powershell
# Build and run
docker-compose up -d

# Scale services
docker-compose up -d --scale api=3

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Option 4: Kubernetes Deployment

#### API Deployment

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: plantstore-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: plantstore-api
  template:
    metadata:
      labels:
        app: plantstore-api
    spec:
      containers:
        - name: api
          image: plantstore/api:latest
          ports:
            - containerPort: 5000
          env:
            - name: ConnectionStrings__DefaultConnection
              valueFrom:
                secretKeyRef:
                  name: database-secret
                  key: connection-string
            - name: Jwt__Key
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: key
---
apiVersion: v1
kind: Service
metadata:
  name: plantstore-api-service
spec:
  selector:
    app: plantstore-api
  ports:
    - port: 80
      targetPort: 5000
  type: LoadBalancer
```

#### Frontend Deployment

```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: plantstore-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: plantstore-frontend
  template:
    metadata:
      labels:
        app: plantstore-frontend
    spec:
      containers:
        - name: frontend
          image: plantstore/frontend:latest
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: plantstore-frontend-service
spec:
  selector:
    app: plantstore-frontend
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer
```

## 🗄️ Database Migration Strategies

### Development to Production

1. **Script Generation:**

```powershell
# Generate SQL script for all migrations
dotnet ef migrations script --output migration.sql
```

2. **Manual Deployment:**

- Review generated SQL script
- Execute on production database
- Verify data integrity

3. **Automated Deployment:**

```powershell
# Run migrations on startup (Program.cs)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
}
```

### Data Seeding in Production

```csharp
// Only seed if no data exists
if (!context.Categories.Any())
{
    var seeder = new DbSeeder(context);
    seeder.SeedCategories();
}
```

## 🔐 Security Considerations

### SSL/TLS Configuration

1. **Obtain SSL Certificate:**

   - Let's Encrypt (free)
   - Commercial certificate
   - Azure managed certificate

2. **Configure HTTPS Redirection:**

```csharp
// Program.cs
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}
```

3. **Update CORS for Production:**

```csharp
builder.Services.AddCors(options =>
    options.AddPolicy("Production", policy =>
        policy.WithOrigins("https://yourplantstore.com")
              .AllowAnyMethod()
              .AllowAnyHeader()));
```

### Environment Variables Security

```powershell
# Use secure configuration providers
dotnet user-secrets set "Jwt:Key" "your-production-secret-key"
dotnet user-secrets set "Stripe:SecretKey" "sk_live_..."
```

## 📊 Monitoring and Logging

### Application Insights (Azure)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

### Structured Logging

```csharp
// Install Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));
```

### Health Checks

```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddDbContext<AppDbContext>()
    .AddUrlGroup(new Uri("https://api.stripe.com"), "stripe");

app.MapHealthChecks("/health");
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: 8.0.x

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Build Backend
        run: |
          cd Backend/PlantStore.Api
          dotnet restore
          dotnet build -c Release
          dotnet publish -c Release -o ./publish

      - name: Build Frontend
        run: |
          cd Frontend/plant-store-frontend
          npm ci
          npm run build

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: "plantstore-api"
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./Backend/PlantStore.Api/publish
```

### Azure DevOps Pipeline

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: "ubuntu-latest"

variables:
  buildConfiguration: "Release"

stages:
  - stage: Build
    jobs:
      - job: BuildBackend
        steps:
          - task: DotNetCoreCLI@2
            inputs:
              command: "restore"
              projects: "Backend/PlantStore.Api/*.csproj"

          - task: DotNetCoreCLI@2
            inputs:
              command: "build"
              projects: "Backend/PlantStore.Api/*.csproj"
              arguments: "--configuration $(buildConfiguration)"

          - task: DotNetCoreCLI@2
            inputs:
              command: "publish"
              projects: "Backend/PlantStore.Api/*.csproj"
              arguments: "--configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)"

      - job: BuildFrontend
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: "18.x"

          - script: |
              cd Frontend/plant-store-frontend
              npm ci
              npm run build
            displayName: "Build Frontend"

  - stage: Deploy
    jobs:
      - deployment: DeployToProduction
        environment: "Production"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: "Azure-Subscription"
                    appType: "webApp"
                    appName: "plantstore-api"
                    package: "$(Pipeline.Workspace)/**/*.zip"
```

## 🔧 Performance Optimization

### Backend Optimizations

1. **Response Compression:**

```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});
```

2. **Output Caching:**

```csharp
builder.Services.AddOutputCache();
app.MapGet("/api/categories", () => { ... }).CacheOutput();
```

3. **Database Connection Pooling:**

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure()));
```

### Frontend Optimizations

1. **Bundle Analysis:**

```bash
npm run build -- --analyze
```

2. **Code Splitting:**

```typescript
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
```

3. **Service Worker (PWA):**

```typescript
// vite.config.ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Verify frontend URL in CORS policy
   - Check protocol (HTTP vs HTTPS)
   - Ensure credentials are included if needed

2. **Database Connection:**

   - Verify connection string format
   - Check firewall rules
   - Ensure migrations are applied

3. **Authentication Issues:**

   - Verify JWT secret key consistency
   - Check token expiration
   - Validate issuer/audience claims

4. **Stripe Integration:**
   - Verify webhook endpoints
   - Check environment (test vs live keys)
   - Validate webhook signatures

### Debugging Production Issues

1. **Enable Detailed Errors:**

```csharp
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}
```

2. **Logging Configuration:**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "PlantStore": "Debug"
    }
  }
}
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Update connection strings for production database
- [ ] Configure production JWT secrets
- [ ] Set up Stripe live keys
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS redirection
- [ ] Set up SSL certificates
- [ ] Configure logging and monitoring
- [ ] Run database migrations
- [ ] Update environment variables
- [ ] Build and test applications

### Post-Deployment

- [ ] Verify API endpoints are accessible
- [ ] Test user registration and login
- [ ] Verify payment processing works
- [ ] Check database connectivity
- [ ] Monitor application logs
- [ ] Test critical user flows
- [ ] Verify SSL certificate installation
- [ ] Check performance metrics
- [ ] Set up monitoring alerts
- [ ] Document deployment configuration

## 🔮 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing:**

   - Multiple API instances
   - Session state management
   - Database connection pooling

2. **Microservices Architecture:**

   - Split by domain (auth, products, orders)
   - Service discovery
   - API gateway

3. **Caching Strategy:**
   - Redis for session storage
   - CDN for static assets
   - Database query caching

### Vertical Scaling

1. **Resource Optimization:**

   - CPU and memory allocation
   - Database performance tuning
   - Query optimization

2. **Infrastructure Upgrades:**
   - Faster storage (SSD)
   - More powerful compute instances
   - Dedicated database servers
