# PlantStore - E-commerce Plant Store Application

A full-stack e-commerce application for selling plants, built with .NET 8 Web API backend and React/TypeScript frontend.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🌱 Project Overview

PlantStore is a modern e-commerce platform designed specifically for plant enthusiasts. The application provides a seamless shopping experience with features like product browsing, cart management, user authentication, order processing, and payment integration through Stripe.

## 🏗️ Architecture

The application follows a clean architecture pattern with clear separation of concerns:

- **Backend**: RESTful API built with .NET 8 Web API
- **Frontend**: Single Page Application (SPA) built with React and TypeScript
- **Database**: SQLite for development (easily configurable for production databases)
- **Authentication**: JWT-based authentication with role-based authorization
- **Payment Processing**: Stripe integration for secure payments

## ✨ Features

### Customer Features

- 🔐 User registration and authentication
- 🌿 Browse plants by categories
- 🛒 Shopping cart management
- 📝 Product reviews and ratings
- 📦 Order tracking
- 💳 Secure payment processing with Stripe
- 📍 Multiple delivery addresses
- 👤 Profile management

### Admin Features

- 📊 Admin dashboard
- 🌱 Product management (CRUD operations)
- 📂 Category management
- 📋 Order management
- 👥 User management
- 📈 Basic analytics

## 🛠️ Technology Stack

### Backend

- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **SQLite** - Database (development)
- **JWT Bearer** - Authentication
- **Stripe.NET** - Payment processing
- **BCrypt.NET** - Password hashing
- **FluentValidation** - Input validation
- **Swagger/OpenAPI** - API documentation

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Stripe.js** - Payment integration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd PlantStore
   ```

2. **Backend Setup**

   ```bash
   cd Backend/PlantStore.Api
   dotnet restore
   dotnet ef database update
   ```

3. **Frontend Setup**

   ```bash
   cd Frontend/plant-store-frontend
   npm install
   ```

4. **Environment Configuration**
   - Copy `appsettings.json` to `appsettings.Development.json` in the backend
   - Update connection strings and JWT settings as needed
   - Configure Stripe keys in the application settings

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend API**

   ```bash
   cd Backend/PlantStore.Api
   dotnet run
   ```

   The API will be available at `https://localhost:7001` or `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend/plant-store-frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Production Build

1. **Build the Frontend**

   ```bash
   cd Frontend/plant-store-frontend
   npm run build
   ```

2. **Publish the Backend**
   ```bash
   cd Backend/PlantStore.Api
   dotnet publish -c Release
   ```

## 📁 Project Structure

```
PlantStore/
├── Backend/
│   └── PlantStore.Api/          # .NET Web API project
│       ├── Controllers/         # API controllers
│       ├── Models/             # Entity models
│       ├── DTOs/               # Data transfer objects
│       ├── Services/           # Business logic services
│       ├── Data/               # Database context and migrations
│       ├── Auth/               # Authentication attributes
│       ├── Configuration/      # App configuration
│       ├── Mappers/            # Object mapping
│       └── Validators/         # Input validation
├── Frontend/
│   └── plant-store-frontend/   # React TypeScript project
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── context/        # React context providers
│       │   ├── hooks/          # Custom React hooks
│       │   ├── api/            # API service layer
│       │   ├── types/          # TypeScript type definitions
│       │   ├── utils/          # Utility functions
│       │   └── routes/         # Routing configuration
│       └── public/             # Static assets
└── docs/                       # Additional documentation
```

## 📚 API Documentation

The API documentation is available through Swagger UI when running the backend in development mode:

- Navigate to `https://localhost:7001/swagger` or `http://localhost:5000/swagger`

### Main API Endpoints

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Payments**: `/api/payments/*`
- **Reviews**: `/api/reviews/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Currently using SQLite for development - consider migrating to PostgreSQL/SQL Server for production
- Image upload functionality needs implementation
- Email notifications are not yet implemented

## 🔮 Future Enhancements

- [ ] Inventory management system
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Mobile app development

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
