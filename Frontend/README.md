# PlantStore Frontend Documentation

## 📋 Overview

The PlantStore frontend is a modern React application built with TypeScript, providing an intuitive and responsive user interface for the plant e-commerce platform. It features a clean design, smooth user experience, and seamless integration with the backend API.

## 🛠️ Technology Stack

- **React 19** - Component-based UI library
- **TypeScript** - Type-safe JavaScript superset
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - React component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form library
- **Zod** - Schema validation library
- **Axios** - HTTP client for API communication
- **React Router DOM** - Client-side routing
- **Stripe.js** - Payment processing integration
- **Lucide React** - Icon library

## 🏗️ Project Structure

```
src/
├── admin/                  # Admin-specific components
│   ├── components/         # Admin UI components
│   ├── pages/             # Admin pages
│   └── layouts/           # Admin layouts
├── api/                   # API service layer
│   ├── auth.ts            # Authentication API calls
│   ├── products.ts        # Product API calls
│   ├── cart.ts            # Cart API calls
│   ├── orders.ts          # Order API calls
│   └── payments.ts        # Payment API calls
├── components/            # Reusable UI components
│   ├── Navbar/            # Navigation component
│   ├── Footer/            # Footer component
│   ├── CategoryBar/       # Category navigation
│   ├── ProductCard/       # Product display card
│   ├── Cart/              # Cart components
│   └── ...
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── CartContext.tsx    # Shopping cart state
│   └── CategoryContext.tsx # Category data
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useCart.ts         # Cart management hook
│   └── useApi.ts          # API interaction hook
├── layouts/               # Page layout components
│   ├── MainLayout.tsx     # Main application layout
│   └── AdminLayout.tsx    # Admin panel layout
├── pages/                 # Page components
│   ├── Home/              # Homepage
│   ├── Products/          # Product listing/detail
│   ├── Cart/              # Shopping cart
│   ├── Checkout/          # Checkout process
│   ├── Profile/           # User profile
│   └── Auth/              # Login/Register
├── routes/                # Routing configuration
│   ├── AppRoutes.tsx      # Main route definitions
│   ├── ProtectedRoute.tsx # Authentication guard
│   └── AdminRoute.tsx     # Admin access guard
├── types/                 # TypeScript type definitions
│   ├── api.ts             # API response types
│   ├── auth.ts            # Authentication types
│   ├── product.ts         # Product types
│   └── order.ts           # Order types
├── utils/                 # Utility functions
│   ├── auth.ts            # Auth helpers
│   ├── formatting.ts      # Data formatting
│   └── validation.ts      # Form validation schemas
├── data/                  # Static data and constants
└── assets/                # Static assets (images, icons)
```

## 🎨 Design System

### Theme Configuration

The application uses Material-UI's theming system with custom Tailwind CSS utilities:

```typescript
// theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#22c55e", // Green theme for plants
      light: "#4ade80",
      dark: "#16a34a",
    },
    secondary: {
      main: "#64748b",
      light: "#94a3b8",
      dark: "#475569",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### Component Guidelines

1. **Functional Components**: Use function components with hooks
2. **TypeScript**: Strict typing for all props and state
3. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
4. **Accessibility**: ARIA labels and semantic HTML
5. **Performance**: React.memo for expensive components

## 🔐 Authentication System

### AuthContext

The authentication system is built around React Context:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
```

### Protected Routes

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

### JWT Token Management

```typescript
// utils/auth.ts
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  setToken: (token: string): void => {
    localStorage.setItem("authToken", token);
  },

  removeToken: (): void => {
    localStorage.removeItem("authToken");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};
```

## 🛒 Shopping Cart System

### CartContext

State management for shopping cart functionality:

```typescript
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
}
```

### Cart Persistence

- **Authenticated Users**: Cart stored on server, synced on login
- **Guest Users**: Cart stored in localStorage (future enhancement)

## 🌐 API Integration

### API Service Layer

Centralized API communication with interceptors for authentication:

```typescript
// api/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7001/api",
  timeout: 10000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### API Services

#### Products API

```typescript
export const productsApi = {
  getProducts: (params?: ProductSearchParams): Promise<ProductsResponse> =>
    apiClient.get("/products", { params }).then((res) => res.data),

  getProduct: (id: number): Promise<Product> =>
    apiClient.get(`/products/${id}`).then((res) => res.data),

  createProduct: (data: CreateProductDto): Promise<Product> =>
    apiClient.post("/products", data).then((res) => res.data),

  updateProduct: (id: number, data: UpdateProductDto): Promise<Product> =>
    apiClient.put(`/products/${id}`, data).then((res) => res.data),

  deleteProduct: (id: number): Promise<void> =>
    apiClient.delete(`/products/${id}`),
};
```

## 📱 Responsive Design

### Breakpoint Strategy

Using Tailwind CSS responsive utilities:

```typescript
// Breakpoints
sm: '640px'   // Small devices (landscape phones)
md: '768px'   // Medium devices (tablets)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X Extra large devices
```

### Component Responsiveness

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## 🎯 State Management

### Local State

- Component-level state with `useState`
- Form state with React Hook Form
- Complex local state with `useReducer`

### Global State

- Authentication: Context API
- Shopping Cart: Context API
- Categories: Context API
- Application Settings: Context API

### Server State

- API data caching with custom hooks
- Optimistic updates for better UX
- Error boundary handling

## 📝 Form Management

### React Hook Form Integration

```typescript
interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />
        )}
      />
    </form>
  );
};
```

## 💳 Payment Integration

### Stripe Checkout

```typescript
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const handleCheckout = async (orderId: number) => {
  try {
    const stripe = await stripePromise;
    const response = await paymentsApi.createCheckoutSession({
      orderId,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    });

    await stripe?.redirectToCheckout({
      sessionId: response.sessionId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
  }
};
```

## 🧭 Routing

### Route Configuration

```typescript
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
```

## 🎨 Component Library

### Custom Components

#### ProductCard

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        className="h-48 object-cover"
      />
      <CardContent className="flex-grow">
        <Typography variant="h6" component="h3">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" className="mt-2">
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => onAddToCart?.(product.id)}
          disabled={product.inStock === 0}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};
```

## 🔍 Search & Filtering

### Product Search

```typescript
interface SearchFilters {
  query?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "created";
  sortOrder?: "asc" | "desc";
}

export const useProductSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsApi.getProducts(filters);
      setProducts(response.products);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    searchProducts();
  }, [searchProducts]);

  return { products, loading, filters, setFilters };
};
```

## 🏃‍♂️ Performance Optimization

### Code Splitting

```typescript
// Lazy loading of admin components
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const ProductManagement = lazy(() => import("./admin/pages/ProductManagement"));

// Route-based code splitting
<Route
  path="/admin/dashboard"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  }
/>;
```

### Memoization

```typescript
// Expensive component memoization
export const ProductList = React.memo<ProductListProps>(
  ({ products, onAddToCart }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }
);
```

### Image Optimization

```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "./ProductCard";

const mockProduct: Product = {
  id: 1,
  name: "Test Plant",
  description: "A beautiful test plant",
  price: 19.99,
  imageUrl: "/test-image.jpg",
  inStock: 5,
  categoryId: 1,
};

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Plant")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Plant");
  });

  it("calls onAddToCart when button is clicked", () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByText("Add to Cart"));
    expect(onAddToCart).toHaveBeenCalledWith(1);
  });
});
```

## 🔧 Environment Configuration

### Environment Variables

```bash
# .env.local
VITE_API_URL=https://localhost:7001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_NAME=PlantStore
VITE_ENABLE_ANALYTICS=false
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://localhost:7001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@mui/material", "@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
});
```

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Production Considerations

1. **Environment Variables**: Configure for production API endpoints
2. **Error Boundaries**: Implement global error handling
3. **Analytics**: Google Analytics integration
4. **SEO**: Meta tags and Open Graph data
5. **PWA**: Service worker for offline functionality (future)

## 🔮 Future Enhancements

### Planned Features

1. **PWA Support**: Offline functionality and push notifications
2. **Dark Mode**: Theme switching capability
3. **Internationalization**: Multi-language support
4. **Advanced Search**: Filters, sorting, autocomplete
5. **Wishlist**: Save products for later
6. **Social Features**: Product sharing, reviews
7. **Chat Support**: Customer service integration
8. **Mobile App**: React Native version

### Technical Improvements

1. **State Management**: Consider Redux Toolkit for complex state
2. **Testing**: Increase test coverage to 80%+
3. **Performance**: Implement virtual scrolling for large lists
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Bundle Analysis**: Optimize chunk sizes
6. **Error Tracking**: Sentry integration
7. **Performance Monitoring**: Web Vitals tracking

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
