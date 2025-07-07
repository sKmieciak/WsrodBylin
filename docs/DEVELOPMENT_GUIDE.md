# PlantStore Development Guide

## 📋 Overview

This guide provides comprehensive information for developers working on the PlantStore project, including setup instructions, coding standards, development workflows, and contribution guidelines.

## 🛠️ Development Environment Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** - Backend development
- **[Node.js 18+](https://nodejs.org/)** - Frontend development
- **[Git](https://git-scm.com/)** - Version control
- **[Visual Studio Code](https://code.visualstudio.com/)** or **[Visual Studio 2022](https://visualstudio.microsoft.com/)** - IDE
- **[SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/)** (optional) - Database management

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-dotnettools.csharp",
    "ms-dotnettools.vscode-dotnet-runtime",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Project Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd PlantStore
   ```

2. **Backend Setup**

   ```bash
   cd Backend/PlantStore.Api

   # Restore packages
   dotnet restore

   # Create development database
   dotnet ef database update

   # Seed initial data
   dotnet run --seed-data
   ```

3. **Frontend Setup**

   ```bash
   cd Frontend/plant-store-frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

4. **Environment Configuration**

   **Backend (`appsettings.Development.json`):**

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=shop.db"
     },
     "Jwt": {
       "Key": "development-secret-key-minimum-32-characters-long",
       "Issuer": "PlantStore.Api",
       "Audience": "PlantStore.Client",
       "DurationInMinutes": 60
     },
     "Stripe": {
       "SecretKey": "sk_test_your_test_key_here",
       "PublishableKey": "pk_test_your_test_key_here"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information",
         "Microsoft.AspNetCore": "Warning",
         "PlantStore": "Debug"
       }
     }
   }
   ```

   **Frontend (`.env.local`):**

   ```bash
   VITE_API_URL=https://localhost:7001/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
   VITE_APP_NAME=PlantStore
   VITE_ENABLE_DEBUG=true
   ```

## 🏗️ Project Architecture

### Backend Architecture (.NET 8 Web API)

```
PlantStore.Api/
├── Controllers/         # API endpoints
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   ├── CartController.cs
│   └── ...
├── Models/             # Domain entities
│   ├── User.cs
│   ├── Product.cs
│   ├── Order.cs
│   └── ...
├── DTOs/               # Data transfer objects
│   ├── UserDto.cs
│   ├── ProductDto.cs
│   └── ...
├── Services/           # Business logic
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   └── ...
├── Data/               # Database layer
│   ├── AppDbContext.cs
│   ├── DbSeeder.cs
│   └── Migrations/
├── Mappers/            # Object mapping
├── Validators/         # Input validation
├── Auth/               # Authentication
└── Configuration/      # App settings
```

### Frontend Architecture (React + TypeScript)

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Generic components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── pages/             # Page components
│   ├── Home/
│   ├── Products/
│   ├── Cart/
│   └── Auth/
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── services/          # API service layer
├── types/             # TypeScript definitions
├── utils/             # Utility functions
├── styles/            # Global styles
└── assets/            # Static assets
```

## 📝 Coding Standards

### Backend (.NET)

#### Code Style

- Follow [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Use PascalCase for public members
- Use camelCase for private fields with `_` prefix
- Use meaningful names for variables and methods

#### Example Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductService productService,
        ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] ProductSearchParameters parameters)
    {
        try
        {
            var products = await _productService.GetProductsAsync(parameters);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products");
            return StatusCode(500, "An error occurred while retrieving products");
        }
    }
}
```

#### Service Pattern

```csharp
public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetProductsAsync(ProductSearchParameters parameters);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(ProductCreateDto createDto);
    Task<ProductDto> UpdateProductAsync(int id, ProductUpdateDto updateDto);
    Task DeleteProductAsync(int id);
}

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ProductService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsAsync(
        ProductSearchParameters parameters)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrEmpty(parameters.Search))
        {
            query = query.Where(p => p.Name.Contains(parameters.Search) ||
                                   p.Description.Contains(parameters.Search));
        }

        if (parameters.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == parameters.CategoryId);
        }

        var products = await query
            .Include(p => p.Category)
            .OrderBy(p => p.Name)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}
```

### Frontend (React + TypeScript)

#### Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript for all new code
- Follow React hooks rules
- Use meaningful component and variable names

#### Component Structure

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!onAddToCart) return;

    setIsLoading(true);
    try {
      await onAddToCart(product.id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onAddToCart, product.id]);

  return (
    <Card className={cn("h-full flex flex-col", className)}>
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
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={handleAddToCart}
          disabled={isLoading || product.inStock === 0}>
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
};
```

#### Custom Hooks

```typescript
export const useProducts = (searchParams?: ProductSearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsApi.getProducts(searchParams);
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
```

## 🔄 Development Workflow

### Git Flow

We use a simplified Git flow with the following branches:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/feature-name**: Feature development
- **bugfix/bug-description**: Bug fixes
- **hotfix/critical-fix**: Critical production fixes

#### Branch Naming Convention

```bash
feature/add-product-reviews
feature/implement-user-addresses
bugfix/fix-cart-quantity-update
hotfix/security-vulnerability-fix
```

### Development Process

1. **Create Feature Branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**

   - Write code following coding standards
   - Add/update tests
   - Update documentation if needed

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add product review functionality

   - Add Review model and controller
   - Implement review CRUD operations
   - Add review form component
   - Update product detail page to show reviews"
   ```

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(auth): add password reset functionality
fix(cart): resolve quantity update issue
docs: update API documentation
style: format code with prettier
refactor(products): extract product service logic
test(auth): add unit tests for login flow
chore: update dependencies
```

## 🧪 Testing

### Backend Testing

#### Unit Tests Structure

```
PlantStore.Api.Tests/
├── Controllers/
│   ├── ProductsControllerTests.cs
│   └── AuthControllerTests.cs
├── Services/
│   ├── ProductServiceTests.cs
│   └── AuthServiceTests.cs
├── Validators/
└── Helpers/
    ├── TestDbContext.cs
    └── TestDataFactory.cs
```

#### Example Unit Test

```csharp
public class ProductServiceTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly Mock<IMapper> _mockMapper;
    private readonly ProductService _productService;

    public ProductServiceTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _mockMapper = new Mock<IMapper>();
        _productService = new ProductService(_mockContext.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetProductByIdAsync_ExistingId_ReturnsProduct()
    {
        // Arrange
        var productId = 1;
        var product = new Product { Id = productId, Name = "Test Plant" };
        var productDto = new ProductDto { Id = productId, Name = "Test Plant" };

        _mockContext.Setup(c => c.Products.FindAsync(productId))
                   .ReturnsAsync(product);
        _mockMapper.Setup(m => m.Map<ProductDto>(product))
                   .Returns(productDto);

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(productId, result.Id);
        Assert.Equal("Test Plant", result.Name);
    }

    [Fact]
    public async Task GetProductByIdAsync_NonExistentId_ReturnsNull()
    {
        // Arrange
        var productId = 999;
        _mockContext.Setup(c => c.Products.FindAsync(productId))
                   .ReturnsAsync((Product)null);

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        Assert.Null(result);
    }
}
```

#### Integration Tests

```csharp
public class ProductsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ProductsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsSuccessAndCorrectContentType()
    {
        // Act
        var response = await _client.GetAsync("/api/products");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8",
                    response.Content.Headers.ContentType?.ToString());
    }
}
```

### Frontend Testing

#### Test Setup

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

#### Component Testing

```typescript
// ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "./ProductCard";
import { Product } from "../../types/product";

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
    expect(screen.getByText("A beautiful test plant")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Plant");
  });

  it("calls onAddToCart when button is clicked", async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const addToCartButton = screen.getByText("Add to Cart");
    fireEvent.click(addToCartButton);

    expect(onAddToCart).toHaveBeenCalledWith(1);
  });

  it("disables button when product is out of stock", () => {
    const outOfStockProduct = { ...mockProduct, inStock: 0 };
    render(<ProductCard product={outOfStockProduct} />);

    const addToCartButton = screen.getByText("Add to Cart");
    expect(addToCartButton).toBeDisabled();
  });
});
```

#### Hook Testing

```typescript
// useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "./useProducts";
import * as productsApi from "../api/products";

vi.mock("../api/products");

describe("useProducts", () => {
  it("fetches products on mount", async () => {
    const mockProducts = [{ id: 1, name: "Test Plant" }];
    vi.mocked(productsApi.getProducts).mockResolvedValue({
      products: mockProducts,
      pagination: {
        /* mock pagination */
      },
    });

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBe(null);
  });
});
```

### Running Tests

#### Backend

```bash
cd Backend/PlantStore.Api

# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test
dotnet test --filter "ProductServiceTests"
```

#### Frontend

```bash
cd Frontend/plant-store-frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🔧 Database Management

### Entity Framework Migrations

#### Create Migration

```bash
# Navigate to API project
cd Backend/PlantStore.Api

# Add new migration
dotnet ef migrations add AddProductReviews

# Update database
dotnet ef database update

# Revert migration
dotnet ef database update PreviousMigrationName

# Remove last migration (if not applied)
dotnet ef migrations remove
```

#### Migration Best Practices

1. **Descriptive Names**: Use clear migration names

   ```bash
   dotnet ef migrations add AddProductReviewsTable
   dotnet ef migrations add UpdateUserAddressSchema
   dotnet ef migrations add RemoveObsoleteColumns
   ```

2. **Data Migrations**: Handle data transformations

   ```csharp
   protected override void Up(MigrationBuilder migrationBuilder)
   {
       // Schema changes
       migrationBuilder.AddColumn<string>(
           name: "NewColumn",
           table: "Products",
           type: "nvarchar(100)",
           maxLength: 100,
           nullable: true);

       // Data migration
       migrationBuilder.Sql(@"
           UPDATE Products
           SET NewColumn = 'Default Value'
           WHERE NewColumn IS NULL");
   }
   ```

3. **Rollback Strategy**: Always test rollbacks
   ```csharp
   protected override void Down(MigrationBuilder migrationBuilder)
   {
       migrationBuilder.DropColumn(
           name: "NewColumn",
           table: "Products");
   }
   ```

### Database Seeding

```csharp
public class DbSeeder
{
    private readonly AppDbContext _context;

    public DbSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        if (await _context.Categories.AnyAsync())
            return; // Database already seeded

        await SeedCategoriesAsync();
        await SeedProductsAsync();
        await SeedUsersAsync();
    }

    private async Task SeedCategoriesAsync()
    {
        var categories = new[]
        {
            new Category { Name = "Indoor Plants", Description = "Plants for indoor growing" },
            new Category { Name = "Outdoor Plants", Description = "Plants for gardens and patios" },
            new Category { Name = "Succulents", Description = "Low-maintenance water-storing plants" }
        };

        _context.Categories.AddRange(categories);
        await _context.SaveChangesAsync();
    }
}
```

## 🐛 Debugging

### Backend Debugging

#### Logging Configuration

```csharp
// Program.cs
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsDevelopment())
{
    builder.Logging.SetMinimumLevel(LogLevel.Debug);
}
```

#### Structured Logging

```csharp
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        _logger.LogInformation("Getting product with ID: {ProductId}", id);

        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Product not found with ID: {ProductId}", id);
                return NotFound();
            }

            _logger.LogDebug("Successfully retrieved product: {@Product}", product);
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product with ID: {ProductId}", id);
            return StatusCode(500, "An error occurred while retrieving the product");
        }
    }
}
```

### Frontend Debugging

#### Debug Configuration

```typescript
// utils/debug.ts
export const DEBUG = import.meta.env.VITE_ENABLE_DEBUG === "true";

export const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

export const debugError = (message: string, error: any) => {
  if (DEBUG) {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

#### React DevTools Usage

```typescript
// Custom hook for debugging
export const useDebugValue = (value: any, label: string) => {
  React.useDebugValue(value, (val) => `${label}: ${JSON.stringify(val)}`);
  return value;
};

// Usage in component
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useDebugValue(products, "Products");

  return { products, setProducts };
};
```

## 📊 Performance Guidelines

### Backend Performance

#### Database Optimization

```csharp
// Use projections to limit data
public async Task<IEnumerable<ProductSummaryDto>> GetProductSummariesAsync()
{
    return await _context.Products
        .Select(p => new ProductSummaryDto
        {
            Id = p.Id,
            Name = p.Name,
            Price = p.Price
        })
        .ToListAsync();
}

// Use pagination
public async Task<PagedResult<ProductDto>> GetProductsAsync(
    int page, int pageSize)
{
    var query = _context.Products.AsQueryable();

    var totalCount = await query.CountAsync();
    var products = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<ProductDto>
    {
        Items = _mapper.Map<IEnumerable<ProductDto>>(products),
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize
    };
}
```

#### Caching

```csharp
public class CachedProductService : IProductService
{
    private readonly IProductService _productService;
    private readonly IMemoryCache _cache;

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        return await _cache.GetOrCreateAsync("categories", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            return await _productService.GetCategoriesAsync();
        });
    }
}
```

### Frontend Performance

#### Component Optimization

```typescript
// Memoize expensive calculations
const ExpensiveComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  return <div>{expensiveValue}</div>;
};

// Memoize components
export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
});

// Use callback to prevent unnecessary re-renders
const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const handleAddToCart = useCallback((productId: number) => {
    // Add to cart logic
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

#### Bundle Optimization

```typescript
// Code splitting
const AdminDashboard = lazy(() => import("./admin/Dashboard"));
const ProductManagement = lazy(() => import("./admin/ProductManagement"));

// Dynamic imports
const loadAdminModule = async () => {
  const module = await import("./admin/AdminModule");
  return module.AdminModule;
};
```

## 🚀 Build and Deployment

### Development Build

#### Backend

```bash
cd Backend/PlantStore.Api

# Debug build
dotnet build

# Release build
dotnet build -c Release

# Run with specific environment
dotnet run --environment Development
```

#### Frontend

```bash
cd Frontend/plant-store-frontend

# Development server
npm run dev

# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment-Specific Configurations

#### Backend Environments

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  },
  "DetailedErrors": true,
  "Swagger": {
    "Enabled": true
  }
}

// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "DetailedErrors": false,
  "Swagger": {
    "Enabled": false
  }
}
```

#### Frontend Environments

```bash
# .env.development
VITE_API_URL=https://localhost:7001/api
VITE_ENABLE_DEBUG=true
VITE_LOG_LEVEL=debug

# .env.production
VITE_API_URL=https://api.plantstore.com/api
VITE_ENABLE_DEBUG=false
VITE_LOG_LEVEL=error
```

## 🤝 Contributing

### Pull Request Process

1. **Fork the Repository**
2. **Create Feature Branch** from `develop`
3. **Make Changes** following coding standards
4. **Add/Update Tests** for new functionality
5. **Update Documentation** if needed
6. **Submit Pull Request** with clear description

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes without proper migration strategy
```

### Code Review Guidelines

#### For Reviewers

- Check code follows project standards
- Verify tests are included and pass
- Ensure documentation is updated
- Look for potential security issues
- Consider performance implications

#### For Authors

- Keep PRs focused and small
- Provide clear description and context
- Respond to feedback promptly
- Update PR based on review comments

## 📚 Resources

### Documentation

- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Database management
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

### Learning Resources

- [ASP.NET Core Tutorial](https://docs.microsoft.com/en-us/aspnet/core/tutorials/)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Entity Framework Core Tutorial](https://www.entityframeworktutorial.net/efcore/entity-framework-core.aspx)
