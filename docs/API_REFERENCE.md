# PlantStore API Reference

## 📋 Overview

This document provides detailed information about the PlantStore REST API endpoints, request/response formats, authentication requirements, and usage examples.

**Base URL**: `https://localhost:7001/api` (Development)

## 🔐 Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

Obtain a JWT token by calling the login endpoint:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "data": { ... },
  "message": "Success message",
  "success": true
}
```

### Error Response

```json
{
  "error": "Error description",
  "message": "User-friendly error message",
  "success": false,
  "statusCode": 400
}
```

### Paginated Response

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "success": true
}
```

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isAdmin": false,
    "createdAt": "2025-06-27T10:00:00Z"
  }
}
```

**Validation Rules:**

- `firstName`: Required, max 50 characters
- `lastName`: Required, max 50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

### Login User

Authenticate user and receive JWT token.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isAdmin": false
  }
}
```

## 🌱 Product Endpoints

### Get Products

Retrieve paginated list of products with optional filtering.

```http
GET /api/products?page=1&pageSize=10&categoryId=1&search=plant
```

**Query Parameters:**

- `page` (integer): Page number (default: 1)
- `pageSize` (integer): Items per page (default: 10, max: 50)
- `categoryId` (integer): Filter by category ID
- `search` (string): Search in product name and description
- `minPrice` (decimal): Minimum price filter
- `maxPrice` (decimal): Maximum price filter
- `sortBy` (string): Sort field (name, price, createdAt)
- `sortOrder` (string): Sort direction (asc, desc)

**Response:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Monstera Deliciosa",
      "description": "Beautiful tropical houseplant with split leaves",
      "price": 29.99,
      "imageUrl": "/images/monstera.jpg",
      "inStock": 15,
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Indoor Plants"
      },
      "averageRating": 4.5,
      "reviewCount": 12
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 3,
    "totalItems": 25,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Get Product by ID

Retrieve specific product details.

```http
GET /api/products/{id}
```

**Response:**

```json
{
  "id": 1,
  "name": "Monstera Deliciosa",
  "description": "Beautiful tropical houseplant with split leaves. Perfect for bright, indirect light.",
  "price": 29.99,
  "imageUrl": "/images/monstera.jpg",
  "inStock": 15,
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Indoor Plants",
    "description": "Plants suitable for indoor growing"
  },
  "reviews": [
    {
      "id": 1,
      "userId": 2,
      "userName": "Jane Smith",
      "rating": 5,
      "comment": "Beautiful plant, arrived in perfect condition!",
      "createdAt": "2025-06-20T14:30:00Z"
    }
  ],
  "averageRating": 4.5,
  "reviewCount": 12
}
```

### Create Product (Admin Only)

Create a new product.

```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Snake Plant",
  "description": "Low-maintenance plant perfect for beginners",
  "price": 19.99,
  "imageUrl": "/images/snake-plant.jpg",
  "inStock": 25,
  "categoryId": 1
}
```

**Validation Rules:**

- `name`: Required, max 100 characters, unique
- `description`: Required, max 500 characters
- `price`: Required, positive decimal
- `imageUrl`: Required, valid URL format
- `inStock`: Required, non-negative integer
- `categoryId`: Required, must exist

### Update Product (Admin Only)

Update existing product.

```http
PUT /api/products/{id}
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:** (Same as Create Product)

### Delete Product (Admin Only)

Delete a product.

```http
DELETE /api/products/{id}
Authorization: Bearer <admin-token>
```

## 📂 Category Endpoints

### Get Categories

Retrieve all product categories.

```http
GET /api/categories
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Indoor Plants",
    "description": "Plants suitable for indoor growing",
    "productCount": 15
  },
  {
    "id": 2,
    "name": "Outdoor Plants",
    "description": "Plants for garden and outdoor spaces",
    "productCount": 8
  }
]
```

### Create Category (Admin Only)

```http
POST /api/categories
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Succulents",
  "description": "Water-storing plants perfect for dry climates"
}
```

## 🛒 Cart Endpoints

### Get Cart Items

Retrieve current user's cart items.

```http
GET /api/cart
Authorization: Bearer <user-token>
```

**Response:**

```json
[
  {
    "id": 1,
    "productId": 1,
    "product": {
      "id": 1,
      "name": "Monstera Deliciosa",
      "price": 29.99,
      "imageUrl": "/images/monstera.jpg",
      "inStock": 15
    },
    "quantity": 2,
    "unitPrice": 29.99,
    "totalPrice": 59.98
  }
]
```

### Add to Cart

Add product to cart or update quantity if already exists.

```http
POST /api/cart
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

**Validation Rules:**

- `productId`: Required, must exist and be in stock
- `quantity`: Required, positive integer, not exceed stock

### Update Cart Item

Update quantity of cart item.

```http
PUT /api/cart/{cartItemId}
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "quantity": 3
}
```

### Remove from Cart

Remove item from cart.

```http
DELETE /api/cart/{cartItemId}
Authorization: Bearer <user-token>
```

## 📦 Order Endpoints

### Get User Orders

Retrieve user's order history.

```http
GET /api/orders?page=1&pageSize=10
Authorization: Bearer <user-token>
```

**Response:**

```json
{
  "orders": [
    {
      "id": 1,
      "orderDate": "2025-06-25T10:30:00Z",
      "status": "Delivered",
      "paymentStatus": "Paid",
      "totalAmount": 89.97,
      "itemCount": 3,
      "shippingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "street": "123 Main St",
        "city": "Springfield",
        "postalCode": "12345",
        "country": "USA"
      }
    }
  ],
  "pagination": { ... }
}
```

### Get Order Details

Retrieve specific order details.

```http
GET /api/orders/{orderId}
Authorization: Bearer <user-token>
```

**Response:**

```json
{
  "id": 1,
  "orderDate": "2025-06-25T10:30:00Z",
  "status": "Delivered",
  "paymentStatus": "Paid",
  "totalAmount": 89.97,
  "stripeSessionId": "cs_test_...",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  },
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Monstera Deliciosa",
      "quantity": 2,
      "unitPrice": 29.99,
      "totalPrice": 59.98
    }
  ]
}
```

### Create Order

Create new order from current cart items.

```http
POST /api/orders
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  }
}
```

### Get All Orders (Admin Only)

Retrieve all orders for admin management.

```http
GET /api/orders/admin?page=1&pageSize=10&status=Pending
Authorization: Bearer <admin-token>
```

**Query Parameters:**

- `status`: Filter by order status
- `paymentStatus`: Filter by payment status
- `dateFrom`: Filter orders from date
- `dateTo`: Filter orders to date

### Update Order Status (Admin Only)

Update order status.

```http
PUT /api/orders/{orderId}/status
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "Shipped"
}
```

**Valid Status Values:**

- `Pending` (0)
- `Processing` (1)
- `Shipped` (2)
- `Delivered` (3)
- `Cancelled` (4)

## 💳 Payment Endpoints

### Create Checkout Session

Create Stripe checkout session for order payment.

```http
POST /api/payments/create-checkout-session
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "orderId": 1,
  "successUrl": "https://yoursite.com/checkout/success",
  "cancelUrl": "https://yoursite.com/checkout/cancel"
}
```

**Response:**

```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

## ⭐ Review Endpoints

### Get Product Reviews

Retrieve reviews for a specific product.

```http
GET /api/products/{productId}/reviews?page=1&pageSize=10
```

**Response:**

```json
{
  "reviews": [
    {
      "id": 1,
      "userId": 2,
      "userName": "Jane Smith",
      "rating": 5,
      "comment": "Beautiful plant, arrived in perfect condition!",
      "createdAt": "2025-06-20T14:30:00Z"
    }
  ],
  "pagination": { ... },
  "averageRating": 4.5,
  "totalReviews": 12
}
```

### Create Review

Add a review for a product (requires purchase).

```http
POST /api/reviews
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent plant quality and fast delivery!"
}
```

**Validation Rules:**

- `productId`: Required, must exist and user must have purchased
- `rating`: Required, integer between 1-5
- `comment`: Optional, max 500 characters
- One review per user per product

## 👤 User Endpoints

### Get User Profile

Retrieve current user's profile information.

```http
GET /api/users/profile
Authorization: Bearer <user-token>
```

**Response:**

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "isAdmin": false,
  "createdAt": "2025-06-01T09:00:00Z",
  "addresses": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Springfield",
      "postalCode": "12345",
      "country": "USA",
      "isDefault": true
    }
  ]
}
```

### Update User Profile

Update user profile information.

```http
PUT /api/users/profile
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

### Change Password

Change user password.

```http
PUT /api/users/change-password
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

### Add User Address

Add new delivery address.

```http
POST /api/users/addresses
Authorization: Bearer <user-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "street": "456 Oak Ave",
  "city": "Springfield",
  "postalCode": "12345",
  "country": "USA",
  "isDefault": false
}
```

## 🚦 HTTP Status Codes

| Code | Description                                       |
| ---- | ------------------------------------------------- |
| 200  | OK - Request successful                           |
| 201  | Created - Resource created successfully           |
| 204  | No Content - Request successful, no response body |
| 400  | Bad Request - Invalid request data                |
| 401  | Unauthorized - Authentication required            |
| 403  | Forbidden - Insufficient permissions              |
| 404  | Not Found - Resource not found                    |
| 409  | Conflict - Resource already exists                |
| 422  | Unprocessable Entity - Validation failed          |
| 500  | Internal Server Error - Server error              |

## 🔧 Error Handling

### Validation Errors

```json
{
  "error": "Validation failed",
  "message": "The request contains invalid data",
  "success": false,
  "statusCode": 422,
  "validationErrors": {
    "Email": ["Email is required", "Invalid email format"],
    "Password": ["Password must be at least 6 characters"]
  }
}
```

### Authentication Errors

```json
{
  "error": "Unauthorized",
  "message": "Please log in to access this resource",
  "success": false,
  "statusCode": 401
}
```

### Not Found Errors

```json
{
  "error": "Not found",
  "message": "Product with ID 999 was not found",
  "success": false,
  "statusCode": 404
}
```

## 📊 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Unauthenticated requests**: 100 requests per hour per IP
- **Authenticated requests**: 1000 requests per hour per user
- **Admin requests**: 5000 requests per hour per admin

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🔍 Testing the API

### Using cURL

```bash
# Register new user
curl -X POST https://localhost:7001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Get products
curl -X GET "https://localhost:7001/api/products?page=1&pageSize=5"

# Add to cart (requires token)
curl -X POST https://localhost:7001/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'
```

### Using Postman

1. Import the API collection (if available)
2. Set base URL to `https://localhost:7001/api`
3. Configure authentication with Bearer token
4. Test endpoints with sample data

## 📝 Changelog

### Version 1.0.0 (Current)

- Initial API release
- User authentication and authorization
- Product management
- Shopping cart functionality
- Order processing
- Stripe payment integration
- Review system

### Planned Features

- Email notifications
- Advanced search
- Inventory management
- Analytics endpoints
- File upload for product images
