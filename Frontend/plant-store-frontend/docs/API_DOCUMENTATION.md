# API Documentation

This document outlines the API structure and endpoints used by the Plant Store Frontend application.

## Base Configuration

- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Default**: `https://localhost:7116/api`
- **HTTP Client**: Axios with custom configuration

## Authentication

### JWT Token Management

- Tokens are stored in localStorage
- Automatic token inclusion in Authorization headers
- Token refresh functionality implemented

### Auth Endpoints

#### POST `/auth/login`

Login user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### POST `/auth/register`

Register new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "street": "Main St",
  "houseNumber": "123",
  "postalCode": "12345",
  "city": "City",
  "country": "Country",
  "addressAddon": "Apt 4B",
  "isCompanyAccount": false
}
```

## Products API

### GET `/products`

Retrieve all products with optional filtering.

**Query Parameters:**

- `category` - Filter by category name
- `search` - Search in product names and descriptions
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter only in-stock items

**Response:**

```json
[
  {
    "id": 1,
    "name": "Monstera Deliciosa",
    "description": "Beautiful tropical plant",
    "price": 29.99,
    "imageUrl": "/images/monstera.jpg",
    "inStock": 15,
    "categoryName": "Tropical Plants"
  }
]
```

### GET `/products/:id`

Get single product details.

### POST `/products` (Admin)

Create new product.

### PUT `/products/:id` (Admin)

Update existing product.

### DELETE `/products/:id` (Admin)

Delete product.

## Cart API

### GET `/cart`

Get current user's cart items.

### POST `/cart/add`

Add item to cart.

**Request Body:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

### PUT `/cart/update`

Update cart item quantity.

### DELETE `/cart/remove/:productId`

Remove item from cart.

### DELETE `/cart/clear`

Clear entire cart.

## Orders API

### GET `/orders`

Get user's order history.

### GET `/orders/:id`

Get specific order details.

### POST `/orders`

Create new order.

**Request Body:**

```json
{
  "deliveryMethod": "standard",
  "paymentMethod": "stripe",
  "shippingAddress": {
    "street": "Main St",
    "houseNumber": "123",
    "city": "City",
    "postalCode": "12345",
    "country": "Country"
  }
}
```

## Reviews API

### GET `/products/:id/reviews`

Get reviews for a product.

### POST `/products/:id/reviews`

Add review for a product.

**Request Body:**

```json
{
  "rating": 5,
  "comment": "Great plant, highly recommended!"
}
```

## User API

### GET `/user/profile`

Get current user profile.

### PUT `/user/profile`

Update user profile.

### GET `/user/addresses`

Get user's saved addresses.

### POST `/user/addresses`

Add new address.

### PUT `/user/addresses/:id`

Update address.

### DELETE `/user/addresses/:id`

Delete address.

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Request/Response Examples

### Adding Product to Cart

```typescript
// Request
const response = await cartApi.addToCart({
  productId: 1,
  quantity: 2
});

// Response
{
  "success": true,
  "cartItem": {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "product": {
      "name": "Monstera Deliciosa",
      "price": 29.99
    }
  }
}
```

### Creating Order

```typescript
// Request
const orderData = {
  deliveryMethod: 'express',
  paymentMethod: 'stripe',
  shippingAddress: {
    street: 'Oak Avenue',
    houseNumber: '456',
    city: 'Springfield',
    postalCode: '54321',
    country: 'USA'
  }
};

const response = await orderApi.createOrder(orderData);

// Response
{
  "success": true,
  "order": {
    "id": 12345,
    "status": "pending",
    "total": 89.97,
    "items": [...],
    "createdAt": "2025-06-27T10:00:00Z"
  }
}
```
