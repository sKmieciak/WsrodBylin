# Component Documentation

This document provides detailed information about the key components in the Plant Store Frontend application.

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

- **Pages**: Top-level route components
- **Layouts**: Structural components for page layout
- **Components**: Reusable UI components organized by feature
- **Context Providers**: State management components

## Core Layout Components

### App.tsx

Root application component that sets up the main layout structure.

```tsx
function App() {
  return (
    <CategoryProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CategoryBarWrapper />
        <div className="flex-grow">
          <Container>
            <AppRoutes />
          </Container>
        </div>
        <Footer />
      </div>
    </CategoryProvider>
  );
}
```

### Container.tsx

Wrapper component for consistent content width and spacing.

**Props:**

- `children: React.ReactNode` - Content to be wrapped

## Navigation Components

### Navbar

Main navigation bar component.

**Features:**

- Logo and brand display
- Search functionality
- User authentication status
- Cart icon with item count
- Mobile-responsive hamburger menu

**Sub-components:**

- `NavbarLogo` - Brand logo and name
- `NavbarSearch` - Search input and functionality
- `NavbarActions` - User actions (login, cart, profile)
- `NavbarMobile` - Mobile navigation menu

### CategoryBar

Horizontal category navigation bar.

**Features:**

- Category icons and names
- Active category highlighting
- Mobile scrollable layout
- Category filtering integration

**Sub-components:**

- `CategoryItem` - Individual category button
- `CategoryIcons` - Category icon mapping
- `CategoryBarWrapper` - Container with responsive behavior

## Product Components

### ProductCard

Reusable product display card.

**Props:**

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  showActions?: boolean;
}
```

**Features:**

- Product image with fallback
- Name, price, and category display
- Stock status indicator
- Add to cart button
- Quick view functionality

### ProductList

Grid layout for displaying multiple products.

**Props:**

```typescript
interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}
```

**Features:**

- Responsive grid layout
- Loading skeleton states
- Error handling display
- Empty state messaging

### ProductDetails

Detailed product view component.

**Features:**

- Large product image gallery
- Detailed description
- Price and stock information
- Quantity selector
- Add to cart functionality
- Product reviews section

## Shopping Cart Components

### CartDrawer

Slide-out cart panel.

**Features:**

- Animated slide transition
- Cart item list
- Total price calculation
- Checkout button
- Empty cart state

**Sub-components:**

- `CartDrawerHeader` - Title and close button
- `CartDrawerItemList` - List of cart items
- `CartDrawerFooter` - Total and checkout button

### CartItem

Individual cart item component.

**Props:**

```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}
```

**Features:**

- Product image and details
- Quantity selector with +/- buttons
- Remove item button
- Price calculation
- Stock validation

## Authentication Components

### LoginModal

Modal dialog for user authentication.

**Features:**

- Login and register forms
- Form validation with error display
- Password visibility toggle
- Social login options (if implemented)
- Responsive design

**Sub-components:**

- `Input` - Styled form input component
- `ErrorMessage` - Error display component
- `GridTwo` - Two-column layout component

## Filter Components

### FilterSidebar

Product filtering sidebar.

**Features:**

- Price range filter
- Category selection
- Availability filter
- Search functionality
- Clear filters option

**Sub-components:**

- `FilterPrice` - Price range slider
- `FilterAvailability` - Stock status filter
- `FilterSearch` - Search input
- `FilterSection` - Collapsible filter section

## Checkout Components

### CheckoutCartItems

Cart summary in checkout process.

**Features:**

- Item list with images
- Quantity and price display
- Total calculation
- Edit cart link

### CheckoutDeliveryMethod

Delivery option selection.

**Features:**

- Delivery method cards
- Price display for each option
- Estimated delivery times
- Selection validation

### CheckoutPaymentMethod

Payment method selection.

**Features:**

- Payment option cards
- Stripe integration
- Payment form validation
- Secure payment indicators

## Home Page Components

### HeroSection

Homepage hero banner.

**Features:**

- Hero image/video
- Call-to-action buttons
- Responsive background
- Overlay text content

### FeaturesSection

Feature highlights section.

**Features:**

- Feature cards with icons
- Responsive grid layout
- Animation on scroll
- Feature descriptions

### AboutSection

Company information section.

**Features:**

- Company story
- Mission statement
- Team information
- Image gallery

## Review Components

### ReviewList

Display list of product reviews.

**Features:**

- Star rating display
- Review text
- User information
- Date formatting
- Pagination

### ReviewForm

Form for submitting reviews.

**Features:**

- Star rating input
- Text area for comments
- Form validation
- Submission handling

## Footer Components

### Footer

Main footer component.

**Sub-components:**

- `FooterLinks` - Navigation links
- `FooterContact` - Contact information
- `FooterNewsletter` - Email subscription

## Admin Components

### ProductTable

Admin product management table.

**Features:**

- Sortable columns
- Bulk actions
- Edit/delete buttons
- Pagination
- Search functionality

### ProductForm

Form for creating/editing products.

**Features:**

- Image upload
- Form validation
- Category selection
- Rich text editor for description
- Save/cancel actions

### ProductFormModal

Modal wrapper for product form.

**Features:**

- Modal dialog
- Form submission handling
- Close confirmation
- Responsive design

## Custom Hooks Integration

Many components use custom hooks for logic:

- `useCart` - Cart state management
- `useUser` - User data and authentication
- `useOrder` - Order processing
- `useUserAddresses` - Address management

## Styling Conventions

Components use a consistent styling approach:

- **Tailwind CSS classes** for utility styling
- **Material-UI components** for complex UI elements
- **CSS modules** for component-specific styles
- **Responsive design** with mobile-first approach

## Component Best Practices

1. **TypeScript Interfaces**: All props are typed with interfaces
2. **Error Boundaries**: Critical components wrapped in error boundaries
3. **Loading States**: Components handle loading and error states
4. **Accessibility**: ARIA labels and keyboard navigation support
5. **Performance**: Memoization and lazy loading where appropriate

## Testing Components

Components are structured for easy testing:

- Clear separation of logic and presentation
- Props are well-defined and typed
- External dependencies are injected
- State management is isolated in hooks
