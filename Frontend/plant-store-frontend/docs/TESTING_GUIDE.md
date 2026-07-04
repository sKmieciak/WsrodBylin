# Testing Guide

This guide covers testing strategies, tools, and best practices for the Plant Store Frontend application.

## Testing Strategy

### Testing Pyramid

Our testing approach follows the testing pyramid principle:

1. **Unit Tests (Base)**: Test individual functions and components
2. **Integration Tests (Middle)**: Test component interactions and API integration
3. **E2E Tests (Top)**: Test complete user workflows

### Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: React component testing utilities
- **MSW (Mock Service Worker)**: API mocking for tests
- **Cypress**: End-to-end testing framework
- **Playwright**: Alternative E2E testing (optional)

## Setup and Configuration

### Jest Configuration

```javascript
// jest.config.js
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**/*",
    "!src/**/*.stories.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

### Mock Service Worker Setup

```typescript
// src/test/mocks/handlers.ts
import { rest } from "msw";
import { API_URL } from "../../data/Api_URL";

export const handlers = [
  // Products API
  rest.get(`${API_URL}/products`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          name: "Monstera Deliciosa",
          price: 29.99,
          description: "Beautiful tropical plant",
          imageUrl: "/images/monstera.jpg",
          inStock: 10,
          categoryName: "Tropical Plants",
        },
      ])
    );
  }),

  // Auth API
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.json({
        token: "mock-jwt-token",
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
      })
    );
  }),

  // Cart API
  rest.get(`${API_URL}/cart`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          productId: 1,
          quantity: 2,
          product: {
            name: "Monstera Deliciosa",
            price: 29.99,
            imageUrl: "/images/monstera.jpg",
          },
        },
      ])
    );
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

## Unit Testing

### Component Testing

```typescript
// src/components/ProductCard/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { Product } from "../../types/Product";

const mockProduct: Product = {
  id: 1,
  name: "Monstera Deliciosa",
  description: "Beautiful tropical plant",
  price: 29.99,
  imageUrl: "/images/monstera.jpg",
  inStock: 10,
  categoryName: "Tropical Plants",
};

describe("ProductCard", () => {
  it("displays product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Monstera Deliciosa")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("Tropical Plants")).toBeInTheDocument();
  });

  it("shows out of stock when product has no stock", () => {
    const outOfStockProduct = { ...mockProduct, inStock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onAddToCart when add button is clicked", () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    fireEvent.click(screen.getByText("Add to Cart"));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });
});
```

### Hook Testing

```typescript
// src/hooks/useCart.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";
import { CartProvider } from "../context/CartProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("useCart", () => {
  it("adds item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(1, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(1, 2);
    });

    act(() => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  it("removes item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(1, 2);
    });

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.cart).toHaveLength(0);
  });
});
```

### Utility Function Testing

```typescript
// src/utils/getTokenData.test.ts
import { getTokenData } from "./getTokenData";

describe("getTokenData", () => {
  it("returns null for invalid token", () => {
    expect(getTokenData("invalid-token")).toBeNull();
  });

  it("parses valid JWT token", () => {
    const validToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    const result = getTokenData(validToken);

    expect(result).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });
});
```

## Integration Testing

### Component Integration

```typescript
// src/pages/ProductPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProductPage } from "./ProductPage";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartProvider";

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe("ProductPage Integration", () => {
  it("loads and displays product data", async () => {
    render(<ProductPage />, { wrapper: AllProviders });

    await waitFor(() => {
      expect(screen.getByText("Monstera Deliciosa")).toBeInTheDocument();
    });

    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("handles adding product to cart", async () => {
    render(<ProductPage />, { wrapper: AllProviders });

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Add to Cart"));

    await waitFor(() => {
      expect(screen.getByText("Added to Cart")).toBeInTheDocument();
    });
  });
});
```

### API Integration Testing

```typescript
// src/api/productsApi.test.ts
import { productsApi } from "./productsApi";
import { server } from "../test/mocks/server";
import { rest } from "msw";

describe("Products API", () => {
  it("fetches products successfully", async () => {
    const products = await productsApi.getAll();

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe("Monstera Deliciosa");
  });

  it("handles API errors gracefully", async () => {
    server.use(
      rest.get("*/products", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(productsApi.getAll()).rejects.toThrow();
  });

  it("filters products by category", async () => {
    const products = await productsApi.getByCategory("Tropical Plants");

    expect(products).toHaveLength(1);
    expect(products[0].categoryName).toBe("Tropical Plants");
  });
});
```

## End-to-End Testing

### Cypress Setup

```typescript
// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

### E2E Test Examples

```typescript
// cypress/e2e/shopping-flow.cy.ts
describe("Shopping Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("completes full shopping journey", () => {
    // Browse products
    cy.get("[data-cy=product-card]").first().click();

    // Add to cart
    cy.get("[data-cy=add-to-cart]").click();
    cy.get("[data-cy=cart-notification]").should("be.visible");

    // Go to cart
    cy.get("[data-cy=cart-icon]").click();
    cy.get("[data-cy=cart-drawer]").should("be.visible");

    // Proceed to checkout
    cy.get("[data-cy=checkout-button]").click();
    cy.url().should("include", "/checkout");

    // Fill shipping information
    cy.get("[data-cy=shipping-form]").within(() => {
      cy.get('input[name="street"]').type("123 Main St");
      cy.get('input[name="city"]').type("Test City");
      cy.get('input[name="postalCode"]').type("12345");
    });

    // Select payment method
    cy.get("[data-cy=payment-method-card]").click();

    // Complete order
    cy.get("[data-cy=place-order]").click();
    cy.url().should("include", "/order/success");
  });
});
```

```typescript
// cypress/e2e/authentication.cy.ts
describe("Authentication", () => {
  it("allows user to register and login", () => {
    cy.visit("/");

    // Open login modal
    cy.get("[data-cy=login-button]").click();

    // Switch to register
    cy.get("[data-cy=register-tab]").click();

    // Fill registration form
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");

    // Submit registration
    cy.get("[data-cy=register-submit]").click();

    // Verify successful login
    cy.get("[data-cy=user-menu]").should("be.visible");
  });
});
```

### Custom Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addToCart(productId: number): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.get("[data-cy=login-button]").click();
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("[data-cy=login-submit]").click();
});

Cypress.Commands.add("addToCart", (productId: number) => {
  cy.visit(`/product/${productId}`);
  cy.get("[data-cy=add-to-cart]").click();
});
```

## Performance Testing

### Load Time Testing

```typescript
// src/test/performance/loadTime.test.ts
describe("Performance Tests", () => {
  it("loads homepage within acceptable time", async () => {
    const startTime = performance.now();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });
});
```

### Bundle Size Testing

```typescript
// scripts/bundle-size-test.js
const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "../dist");
const files = fs.readdirSync(distPath);

const jsFiles = files.filter((file) => file.endsWith(".js"));
const cssFiles = files.filter((file) => file.endsWith(".css"));

let totalSize = 0;

jsFiles.forEach((file) => {
  const stats = fs.statSync(path.join(distPath, file));
  totalSize += stats.size;
});

cssFiles.forEach((file) => {
  const stats = fs.statSync(path.join(distPath, file));
  totalSize += stats.size;
});

const maxSize = 2 * 1024 * 1024; // 2MB
if (totalSize > maxSize) {
  console.error(`Bundle size ${totalSize} exceeds maximum ${maxSize}`);
  process.exit(1);
}

console.log(
  `Bundle size: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)}MB)`
);
```

## Visual Regression Testing

### Storybook Integration

```typescript
// .storybook/main.ts
export default {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
};
```

### Component Stories

```typescript
// src/components/ProductCard/ProductCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: {
      id: 1,
      name: "Monstera Deliciosa",
      price: 29.99,
      description: "Beautiful tropical plant",
      imageUrl: "/images/monstera.jpg",
      inStock: 10,
      categoryName: "Tropical Plants",
    },
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...Default.args.product,
      inStock: 0,
    },
  },
};
```

## Test Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:performance": "node scripts/performance-test.js",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
```

## Best Practices

### Test Organization

- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests isolated and independent

### Mocking Guidelines

- Mock external dependencies
- Use MSW for API mocking
- Mock only what's necessary
- Prefer integration over mocking when possible

### Coverage Goals

- Aim for 80%+ code coverage
- Focus on critical business logic
- Test error scenarios
- Include edge cases

### Performance Considerations

- Run tests in parallel when possible
- Use test databases for integration tests
- Clean up resources after tests
- Optimize slow tests

### Maintenance

- Review and update tests regularly
- Remove obsolete tests
- Refactor test code like production code
- Keep test dependencies up to date
