# Development Guide

This guide provides detailed information for developers working on the Plant Store Frontend project.

## Development Environment Setup

### Prerequisites

- Node.js 16+ (recommended: 18+)
- npm or yarn
- Git
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Initial Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start development server: `npm run dev`

## Code Standards and Conventions

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing
- Use enum for constants with multiple values
- Prefer `interface` over `type` for object shapes

```typescript
// Good
interface ProductProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

// Avoid
const ProductCard = (props: any) => {
  // ...
};
```

### React Components

- Use functional components with hooks
- Use TypeScript for all components
- Follow naming conventions: PascalCase for components
- Use default exports for main components
- Use named exports for utilities and sub-components

```typescript
// Component structure
interface ComponentProps {
  // props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // hooks
  // event handlers
  // render logic

  return (
    // JSX
  );
};

export default Component;
```

### File and Folder Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       ├── index.ts
│       └── types.ts
```

### CSS and Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Create custom CSS classes only when necessary
- Use consistent spacing scale (4, 8, 12, 16, 24, 32px)

```tsx
// Good - Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Custom CSS only when needed
<div className="custom-gradient">
```

### State Management

- Use React Context for global state
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Custom hooks for reusable state logic

```typescript
// Custom hook example
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    // logic
  }, []);

  return { cart, addToCart };
};
```

## API Integration

### Service Structure

- Create dedicated API service files
- Use Axios for HTTP requests
- Implement proper error handling
- Type all API responses

```typescript
// api/productsApi.ts
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};
```

### Error Handling

- Implement global error handling
- Show user-friendly error messages
- Log errors for debugging
- Handle network errors gracefully

```typescript
const handleApiError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle general errors
  }
};
```

## Form Handling

### React Hook Form + Zod

- Use React Hook Form for form state
- Use Zod for validation schemas
- Implement proper error display

```typescript
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
};
```

## Testing Strategy

### Unit Testing

- Test utility functions
- Test custom hooks
- Test component logic
- Use Jest and React Testing Library

```typescript
// Component test example
describe("ProductCard", () => {
  it("displays product information correctly", () => {
    const mockProduct = {
      id: 1,
      name: "Test Plant",
      price: 29.99,
    };

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Plant")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });
});
```

### Integration Testing

- Test user workflows
- Test API integration
- Test routing behavior

## Performance Optimization

### Code Splitting

- Use React.lazy for route-based splitting
- Implement dynamic imports for large components

```typescript
const AdminPage = React.lazy(() => import("./pages/AdminPage"));

// In router
<Suspense fallback={<LoadingSpinner />}>
  <AdminPage />
</Suspense>;
```

### Memoization

- Use React.memo for pure components
- Use useMemo for expensive calculations
- Use useCallback for stable function references

```typescript
const ProductCard = React.memo<ProductCardProps>(({ product, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id);
  }, [product.id, onAddToCart]);

  return (
    // component JSX
  );
});
```

### Image Optimization

- Use appropriate image formats (WebP when possible)
- Implement lazy loading for images
- Optimize image sizes for different devices

## Security Best Practices

### Authentication

- Store JWT tokens securely
- Implement token refresh
- Handle token expiration gracefully
- Validate tokens on protected routes

### Data Validation

- Validate all user inputs
- Sanitize data before display
- Use TypeScript for compile-time safety
- Implement server-side validation

### XSS Prevention

- Use React's built-in XSS protection
- Sanitize HTML content when using dangerouslySetInnerHTML
- Validate and escape user-generated content

## Debugging and Development Tools

### Browser DevTools

- React Developer Tools
- Redux DevTools (if using Redux)
- Performance profiler
- Network tab for API debugging

### VS Code Extensions

- Debugger for Chrome
- Error Lens
- Auto Rename Tag
- Bracket Pair Colorizer

### Logging

- Use console.log sparingly in production
- Implement proper logging service
- Use different log levels (error, warn, info, debug)

```typescript
const logger = {
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service
  },

  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[INFO] ${message}`, data);
    }
  },
};
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/component-name` - Code refactoring

### Commit Messages

Follow conventional commits:

- `feat: add user authentication`
- `fix: resolve cart total calculation`
- `docs: update API documentation`
- `style: improve button hover effects`
- `refactor: extract cart logic to custom hook`

### Pull Request Process

1. Create feature branch from main
2. Make changes and commit
3. Push branch and create PR
4. Request code review
5. Address feedback
6. Merge after approval

## Build and Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview  # Preview production build locally
```

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key
- `VITE_APP_VERSION` - Application version

### Performance Checks

- Run Lighthouse audits
- Check bundle size with analyzer
- Test on various devices and browsers
- Validate accessibility compliance

## Troubleshooting Common Issues

### Build Errors

1. **TypeScript errors**: Check type definitions and imports
2. **Dependency conflicts**: Clear node_modules and reinstall
3. **Environment variables**: Verify .env file configuration

### Runtime Errors

1. **API connection**: Check network tab and API status
2. **Authentication issues**: Verify token storage and validation
3. **Routing problems**: Check route definitions and navigation

### Performance Issues

1. **Slow loading**: Implement code splitting and lazy loading
2. **Memory leaks**: Check for unsubscribed listeners and intervals
3. **Bundle size**: Analyze and remove unused dependencies

## Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components follow naming conventions
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is maintained
- [ ] Accessibility standards are met
- [ ] Performance considerations are addressed
- [ ] Tests are included for new features
- [ ] Documentation is updated if needed
- [ ] Code is properly formatted and linted
