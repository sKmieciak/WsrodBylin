# Plant Store Frontend

A modern, responsive e-commerce frontend application for a plant store built with React, TypeScript, and Vite. This application provides a complete shopping experience including product browsing, cart management, user authentication, order processing, and admin functionality.

## 🌱 Features

### Customer Features

- **Product Catalog**: Browse plants by categories with filtering and search
- **Product Details**: Detailed product pages with images, descriptions, and reviews
- **Shopping Cart**: Add/remove items, quantity management, and persistent cart
- **User Authentication**: Register, login, and profile management
- **Checkout Process**: Secure checkout with multiple payment and delivery options
- **Order Management**: View order history and track orders
- **Reviews**: Read and write product reviews
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features

- **Product Management**: CRUD operations for products
- **Dashboard**: Admin interface for managing the store
- **Order Processing**: View and manage customer orders

## 🛠 Technology Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS + Material-UI components
- **State Management**: React Context API
- **Routing**: React Router DOM 7.6.1
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT with Jose library
- **Payment Processing**: Stripe integration
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── admin/                 # Admin panel components and pages
│   ├── components/        # Admin-specific components
│   ├── pages/            # Admin pages
│   └── Api/              # Admin API services
├── api/                  # API service modules
├── components/           # Reusable UI components
│   ├── Cart/             # Shopping cart components
│   ├── CategoryBar/      # Product category navigation
│   ├── Checkout/         # Checkout process components
│   ├── FilterSidebar/    # Product filtering components
│   ├── Footer/           # Footer components
│   ├── Home/             # Homepage components
│   ├── LoginModal/       # Authentication modal components
│   ├── Navbar/           # Navigation components
│   ├── ProductCard/      # Product display components
│   └── ...               # Other component modules
├── context/              # React Context providers
├── data/                 # Static data and configuration
├── hooks/                # Custom React hooks
├── layouts/              # Page layout components
├── lib/                  # Third-party library configurations
├── pages/                # Page components
├── routes/               # Routing configuration
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend API server running (default: https://localhost:7116)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd plant-store-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=https://localhost:7116/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗 Architecture Overview

### Context Providers

- **AuthContext**: Manages user authentication state
- **CartProvider**: Handles shopping cart operations
- **CategoryContext**: Manages product categories
- **ThemeContext**: Handles application theming

### API Integration

The application communicates with a RESTful backend API through dedicated service modules:

- `authApi.ts` - Authentication endpoints
- `productsApi.ts` - Product management
- `cartApi.ts` - Shopping cart operations
- `orderApi.ts` - Order processing
- `reviewsApi.ts` - Product reviews
- `userApi.ts` - User profile management
- `addressApi.ts` - Address management

### Routing Structure

- `/` - Homepage with featured products
- `/products` - Product listing with filters
- `/product/:id` - Individual product details
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/profile` - User profile and settings
- `/orders` - Order history
- `/admin/*` - Admin panel routes

## 🎨 Styling and UI

The application uses a combination of:

- **Tailwind CSS** for utility-first styling
- **Material-UI** for pre-built components
- **Custom CSS** for specific styling needs
- **Responsive Design** principles for mobile compatibility

## 🔒 Authentication

The application implements JWT-based authentication:

- User registration with profile information
- Secure login/logout functionality
- Protected routes for authenticated users
- Admin role-based access control

## 🛒 Shopping Cart

Features include:

- Persistent cart state across sessions
- Real-time quantity updates
- Price calculations
- Stock validation

## 💳 Payment Integration

Stripe integration for secure payments:

- Multiple payment methods
- Secure payment processing
- Order confirmation and tracking

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interfaces
- Optimized navigation for all screen sizes

## 🔧 Configuration

### Vite Configuration

The Vite configuration includes:

- React plugin for Fast Refresh
- Proxy setup for API calls
- Build optimization settings

### ESLint Configuration

Comprehensive linting rules for:

- TypeScript best practices
- React-specific rules
- Code quality enforcement

## 🧪 Development Guidelines

### Component Structure

- Use TypeScript for all components
- Implement proper prop interfaces
- Follow React best practices
- Use custom hooks for logic separation

### State Management

- Use Context API for global state
- Local state for component-specific data
- Custom hooks for state logic

### API Calls

- Centralized API service modules
- Error handling and loading states
- Type-safe responses

## 📦 Build and Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

The build generates optimized static files in the `dist/` directory ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow the coding standards
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**

   - Verify the backend server is running
   - Check the `VITE_API_URL` environment variable
   - Ensure CORS is properly configured on the backend

2. **Build Errors**

   - Clear node_modules and reinstall dependencies
   - Check TypeScript configurations
   - Verify all imports are correct

3. **Development Server Issues**
   - Check if port 5173 is available
   - Clear browser cache
   - Restart the development server

## 📞 Support

For support and questions, please refer to the project documentation or create an issue in the repository.
...reactDom.configs.recommended.rules,
},
})

```

```
