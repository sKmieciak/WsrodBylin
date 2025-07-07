# PlantStore Backend API Documentation

## 📋 Overview

The PlantStore backend is a RESTful Web API built with .NET 8, providing comprehensive e-commerce functionality for a plant store application. It features JWT authentication, role-based authorization, payment processing with Stripe, and a clean architecture design.

## 🏗️ Architecture

### Project Structure

```
PlantStore.Api/
├── Controllers/         # API endpoints
├── Models/             # Entity models
├── DTOs/               # Data transfer objects
├── Services/           # Business logic
├── Data/               # Database context and seeding
├── Auth/               # Authentication attributes
├── Configuration/      # Settings and configurations
├── Mappers/            # Object mapping between models and DTOs
├── Validators/         # Input validation rules
├── Migrations/         # Entity Framework migrations
└── wwwroot/           # Static files (React build output)
```

### Design Patterns

- **Repository Pattern**: Data access abstraction through Entity Framework
- **DTO Pattern**: Separation of internal models from API contracts
- **Mapper Pattern**: Clean object transformation
- **Dependency Injection**: Built-in .NET DI container
- **Middleware Pattern**: Authentication, CORS, error handling

## 🗄️ Database Schema

### Core Entities

#### User

```csharp
public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<CartItem> CartItems { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<UserAddress> Addresses { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
```

#### Product

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int InStock { get; set; }
    public int CategoryId { get; set; }

    // Navigation properties
    public Category Category { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
```

#### Order

```csharp
public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public string? StripeSessionId { get; set; }

    // Address information
    public string ShippingFirstName { get; set; }
    public string ShippingLastName { get; set; }
    public string ShippingStreet { get; set; }
    public string ShippingCity { get; set; }
    public string ShippingPostalCode { get; set; }
    public string ShippingCountry { get; set; }

    // Navigation properties
    public User User { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}
```

#### Category

```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    // Navigation properties
    public ICollection<Product> Products { get; set; }
}
```

### Enums

```csharp
public enum OrderStatus
{
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

public enum PaymentStatus
{
    Pending = 0,
    Paid = 1,
    Failed = 2,
    Refunded = 3
}
```

## 🔐 Authentication & Authorization

### JWT Configuration

The API uses JWT Bearer tokens for authentication with the following configuration:

```csharp
// JwtSettings.cs
public class JwtSettings
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int DurationInMinutes { get; set; }
}
```

### Authorization Levels

1. **Public**: No authentication required

   - Product browsing
   - Category listing
   - User registration
   - Login

2. **User**: Authenticated users

   - Cart management
   - Order placement
   - Profile management
   - Review submission

3. **Admin**: Administrative users
   - Product management
   - Category management
   - Order management
   - User management

### AdminOnly Attribute

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var isAdmin = user.FindFirst("IsAdmin")?.Value;
        if (isAdmin != "True")
        {
            context.Result = new ForbidResult();
        }
    }
}
```

## 🌐 API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "user": {
    "id": 0,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isAdmin": false
  }
}
```

#### POST `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

### Products (`/api/products`)

#### GET `/api/products`

Retrieve paginated products with optional filtering.

**Query Parameters:**

- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 10)
- `categoryId` (int?): Filter by category
- `search` (string?): Search in name/description

#### GET `/api/products/{id}`

Get specific product by ID.

#### POST `/api/products` [Admin Only]

Create a new product.

#### PUT `/api/products/{id}` [Admin Only]

Update existing product.

#### DELETE `/api/products/{id}` [Admin Only]

Delete product.

### Cart (`/api/cart`)

#### GET `/api/cart` [Authenticated]

Get current user's cart items.

#### POST `/api/cart` [Authenticated]

Add item to cart.

**Request Body:**

```json
{
  "productId": 0,
  "quantity": 0
}
```

#### PUT `/api/cart/{id}` [Authenticated]

Update cart item quantity.

#### DELETE `/api/cart/{id}` [Authenticated]

Remove item from cart.

### Orders (`/api/orders`)

#### GET `/api/orders` [Authenticated]

Get user's order history.

#### GET `/api/orders/admin` [Admin Only]

Get all orders (admin view).

#### POST `/api/orders` [Authenticated]

Create new order from cart.

#### PUT `/api/orders/{id}/status` [Admin Only]

Update order status.

### Payments (`/api/payments`)

#### POST `/api/payments/create-checkout-session` [Authenticated]

Create Stripe checkout session for order payment.

**Request Body:**

```json
{
  "orderId": 0,
  "successUrl": "string",
  "cancelUrl": "string"
}
```

## 🔧 Services

### AuthService

Handles user authentication, registration, and JWT token generation.

### PaymentService

Manages Stripe payment processing and checkout session creation.

### EmailService (Future Implementation)

Will handle order confirmations and notifications.

## 📝 DTOs (Data Transfer Objects)

### User DTOs

- `UserRegisterDto`: User registration input
- `UserLoginDto`: User login credentials
- `UserDto`: User information output
- `UpdateUserDto`: User profile updates
- `ChangePasswordDto`: Password change input

### Product DTOs

- `ProductDto`: Product information output
- `ProductCreateDto`: New product input
- `ProductUpdateDto`: Product modification input

### Order DTOs

- `CreateOrderDto`: Order creation input
- `OrderDto`: Order information output (user view)
- `OrderAdminDto`: Order information output (admin view)
- `UpdateOrderStatusDto`: Order status modification

### Cart DTOs

- `CartItemDto`: Cart item output
- `CartItemCreateDto`: Add to cart input
- `CartItemUpdateDto`: Cart item modification

## 🛡️ Validation

The API uses FluentValidation for input validation:

```csharp
public class UserRegisterDtoValidator : AbstractValidator<UserRegisterDto>
{
    public UserRegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6);

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);
    }
}
```

## 🗄️ Database Configuration

### Connection String

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shop.db"
  }
}
```

### Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Data Seeding

The `DbSeeder` class provides initial data for development:

- Default categories
- Sample products
- Admin user account

## 🔧 Configuration

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=shop.db"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
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

## 🚀 Deployment

### Development

```bash
dotnet run
```

### Production

```bash
dotnet publish -c Release -o ./publish
```

### Docker (Future Enhancement)

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PlantStore.Api.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlantStore.Api.dll"]
```

## 🧪 Testing

### Unit Tests (Recommended Structure)

```
PlantStore.Api.Tests/
├── Controllers/
├── Services/
├── Validators/
└── Helpers/
```

### Integration Tests

```bash
dotnet test
```

## 📊 Performance Considerations

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement caching for categories and popular products
3. **Pagination**: Implemented for product listings
4. **Lazy Loading**: Configured in Entity Framework
5. **Connection Pooling**: Built-in with Entity Framework

## 🔒 Security

1. **Password Hashing**: BCrypt implementation
2. **JWT Tokens**: Secure token-based authentication
3. **CORS**: Configured for frontend origin
4. **Input Validation**: FluentValidation rules
5. **SQL Injection Protection**: Entity Framework parameterized queries

## 📈 Monitoring & Logging

- Built-in .NET logging framework
- Structured logging with Serilog (recommended)
- Application Insights integration (future enhancement)

## 🐛 Error Handling

Global error handling middleware captures and standardizes error responses:

```csharp
app.UseExceptionHandler("/error");
```

## 🔮 Future Enhancements

1. **Caching Layer**: Redis implementation
2. **Background Jobs**: Hangfire for email notifications
3. **File Upload**: Azure Blob Storage for product images
4. **Search**: Elasticsearch integration
5. **Monitoring**: Application Insights
6. **Rate Limiting**: API throttling
7. **Health Checks**: Endpoint monitoring
