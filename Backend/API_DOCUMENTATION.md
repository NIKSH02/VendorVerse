# VendorVerse Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL and Common Headers](#base-url-and-common-headers)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [API Endpoints](#api-endpoints)
   - [User Management](#user-management)
   - [Authentication & Profile](#authentication--profile)
   - [Product Listings](#product-listings)
   - [Sample Management](#sample-management)
   - [Order Management](#order-management)
   - [Reviews](#reviews)
   - [Material Requests](#material-requests)
   - [Negotiations](#negotiations)
   - [Notifications](#notifications)
   - [Analytics](#analytics)
   - [Chat & Messaging](#chat--messaging)

---

## Overview

VendorVerse is a comprehensive marketplace platform connecting vendors, suppliers, and buyers. This API provides endpoints for user management, product listings, sample requests, order processing, negotiations, and real-time chat functionality.

**Version**: 1.0  
**Protocol**: HTTP/HTTPS  
**Data Format**: JSON  

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with a refresh token mechanism.

### Authentication Flow
1. Login with email/password to receive `accessToken` and `refreshToken`
2. Include `accessToken` in the Authorization header for protected routes
3. Use `/api/users/refresh-token` to get a new access token when expired

### Headers for Protected Routes
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## Base URL and Common Headers

**Base URL**: `http://localhost:5001/api`

**Common Headers**:
```
Content-Type: application/json
Accept: application/json
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development)",
  "statusCode": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Chat Messages**: 30 requests per minute per IP

---

# API Endpoints

## User Management

### Register User
**POST** `/users/register`

Create a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullname": "John Michael Doe",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "geolocation": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "isEmailVerified": false
    }
  }
}
```

### Send Email Verification OTP
**POST** `/users/send-verification-otp`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

### Verify Email OTP
**POST** `/users/verify-email-otp`

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Resend Email Verification OTP
**POST** `/users/resend-verification-otp`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

---

## Authentication & Profile

### Login
**POST** `/users/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "isEmailVerified": true
    }
  }
}
```

### Logout
**POST** `/users/logout` 🔒

### Refresh Token
**POST** `/users/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### Get Current User
**GET** `/users/get-user` 🔒

### Change Password
**PATCH** `/users/change-password` 🔒

**Request Body**:
```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newSecurePassword123"
}
```

### Update Account Details
**PATCH** `/users/update-account` 🔒

**Request Body**:
```json
{
  "name": "Updated Name",
  "fullname": "Updated Full Name",
  "phone": "+1987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "pincode": "90210"
  }
}
```

### Change Avatar
**PATCH** `/users/change-avatar` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: `avatar` (image file)

### Change Cover Images
**PATCH** `/users/change-cover-images` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: `cover images` (up to 5 image files)

---

## Product Listings

### Get All Products
**GET** `/products`

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `location` (string): Filter by location
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search query

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "product_id",
        "title": "Organic Cotton T-Shirts",
        "description": "High-quality organic cotton t-shirts",
        "category": "Textiles",
        "type": "raw",
        "price": 25.99,
        "quantity": 100,
        "images": ["image_url_1", "image_url_2"],
        "supplier": {
          "_id": "supplier_id",
          "name": "Supplier Name",
          "username": "supplier_username"
        },
        "isActive": true,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Products by Type
**GET** `/products/type/:type`

**Path Parameters**:
- `type`: `raw` | `half-baked` | `complete`

### Get Products by Supplier
**GET** `/products/supplier/:supplierId`

### Get Product by ID
**GET** `/products/:id`

### Create Product
**POST** `/products` 🔒

**Request Body**:
```json
{
  "title": "Organic Cotton T-Shirts",
  "description": "High-quality organic cotton t-shirts made from 100% organic cotton",
  "category": "Textiles",
  "type": "raw",
  "price": 25.99,
  "quantity": 100,
  "minOrderQuantity": 10,
  "specifications": {
    "material": "100% Organic Cotton",
    "weight": "180gsm",
    "colors": ["White", "Black", "Navy"],
    "sizes": ["S", "M", "L", "XL"]
  },
  "images": ["image_url_1", "image_url_2"],
  "tags": ["organic", "cotton", "sustainable", "clothing"]
}
```

### Upload Product Images
**POST** `/products/upload-images` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: Multiple image files

### Get My Products
**GET** `/products/user/my-products` 🔒

### Update Product
**PUT** `/products/:id` 🔒

### Toggle Product Status
**PATCH** `/products/:id/toggle-status` 🔒

### Delete Product
**DELETE** `/products/:id` 🔒

---

## Sample Management

### Request Sample (Detailed)
**POST** `/samples/request` 🔒

**Request Body**:
```json
{
  "productId": "product_id",
  "quantity": 2,
  "message": "I would like to evaluate this product for bulk ordering",
  "intendedUse": "Quality evaluation for potential bulk order",
  "expectedOrderQuantity": 500,
  "deliveryAddress": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  }
}
```

### Request Sample (One-Click)
**POST** `/samples/request-one-click` 🔒

**Request Body**:
```json
{
  "productId": "product_id"
}
```

### Check Sample Eligibility
**GET** `/samples/check-eligibility` 🔒

**Query Parameters**:
- `productId` (required): Product ID to check eligibility

### Get Incoming Sample Requests
**GET** `/samples/incoming` 🔒

Get sample requests received by the supplier.

**Query Parameters**:
- `status`: `pending` | `accepted` | `rejected` | `shipped` | `delivered`
- `page` (number)
- `limit` (number)

### Get Outgoing Sample Requests
**GET** `/samples/outgoing` 🔒

Get sample requests sent by the user.

### Update Sample Request Status
**PATCH** `/samples/:id/status` 🔒

**Request Body**:
```json
{
  "status": "accepted",
  "message": "Sample approved. Will ship within 2 business days.",
  "estimatedDeliveryDate": "2023-12-25",
  "trackingInfo": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890"
  }
}
```

### Mark Sample as Received
**PATCH** `/samples/:id/received` 🔒

**Request Body**:
```json
{
  "receivedDate": "2023-12-20",
  "condition": "good",
  "feedback": "Sample quality is excellent",
  "rating": 5
}
```

### Get Sample Dashboard
**GET** `/samples/dashboard` 🔒

### Get User Sample Profile
**GET** `/samples/profile` 🔒

### Get Sample Details
**GET** `/samples/:id` 🔒

### Get Sample Order Details
**GET** `/samples/:id/order-details` 🔒

### Get Product Sample History
**GET** `/samples/product/:productId/history` 🔒

### Get Samples by Category
**GET** `/samples/category/:category` 🔒

### Upload Sample Image
**PATCH** `/samples/:id/upload-image` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: `image` (image file)

---

## Order Management

### Place Order
**POST** `/orders/place` 🔒

**Request Body**:
```json
{
  "productId": "product_id",
  "quantity": 50,
  "unitPrice": 25.99,
  "totalAmount": 1299.50,
  "deliveryAddress": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "contactPerson": "John Doe",
    "contactPhone": "+1234567890"
  },
  "specialInstructions": "Please handle with care",
  "expectedDeliveryDate": "2023-12-30"
}
```

### Get Buyer Order History
**GET** `/orders/buyer/history` 🔒

Get orders placed by the current user as a buyer.

**Query Parameters**:
- `status`: `pending` | `accepted` | `processing` | `shipped` | `delivered` | `cancelled`
- `page` (number)
- `limit` (number)
- `startDate` (ISO date)
- `endDate` (ISO date)

### Get Seller Orders
**GET** `/orders/seller/orders` 🔒

Get orders received by the current user as a seller.

### Get All User Orders
**GET** `/orders/all` 🔒

Get all orders for the user (both as buyer and seller).

### Get Reviewable Orders
**GET** `/orders/reviewable` 🔒

Get orders that can be reviewed by the user.

### Update Order Status
**PATCH** `/orders/:orderId/status` 🔒

**Request Body**:
```json
{
  "status": "shipped",
  "message": "Order has been shipped via FedEx",
  "trackingInfo": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "estimatedDelivery": "2023-12-25"
  }
}
```

### Get Exchange Code
**GET** `/orders/:orderId/exchange-code` 🔒

Get the exchange code for order pickup/delivery verification.

### Get Financial Summary
**GET** `/orders/financial/summary` 🔒

### Get Order Dashboard
**GET** `/orders/dashboard` 🔒

### Get Order Details
**GET** `/orders/:orderId` 🔒

---

## Reviews

### Create Review
**POST** `/reviews/create` 🔒

**Request Body**:
```json
{
  "type": "order",
  "orderId": "order_id",
  "revieweeId": "user_id",
  "rating": 5,
  "comment": "Excellent product quality and fast delivery!",
  "aspects": {
    "quality": 5,
    "communication": 5,
    "delivery": 5,
    "value": 4
  }
}
```

### Get Reviewable Items
**GET** `/reviews/reviewable` 🔒

### Get User Given Reviews
**GET** `/reviews/my-reviews` 🔒

### Get Reviews for User
**GET** `/reviews/user/:userId` 🔒

### Get Product Reviews
**GET** `/reviews/product/:productId` 🔒

### Mark Review as Helpful
**PATCH** `/reviews/:reviewId/helpful` 🔒

**Request Body**:
```json
{
  "isHelpful": true
}
```

---

## Material Requests

### Create Material Request
**POST** `/material-requests/create` 🔒

**Request Body**:
```json
{
  "title": "Looking for Organic Cotton Fabric",
  "description": "Need high-quality organic cotton fabric for clothing production",
  "category": "Textiles",
  "quantity": 1000,
  "unit": "meters",
  "targetPrice": 15.99,
  "location": "New York",
  "requiredBy": "2023-12-31",
  "specifications": {
    "material": "100% Organic Cotton",
    "weight": "200gsm",
    "colors": ["White", "Natural"]
  },
  "tags": ["organic", "cotton", "sustainable"]
}
```

### Get All Material Requests
**GET** `/material-requests/all` 🔒

**Query Parameters**:
- `category` (string)
- `location` (string)
- `minPrice` (number)
- `maxPrice` (number)
- `status`: `active` | `fulfilled` | `expired`
- `page` (number)
- `limit` (number)

### Accept/Respond to Material Request
**POST** `/material-requests/:requestId/accept` 🔒

**Request Body**:
```json
{
  "message": "We can supply this material at competitive prices",
  "proposedPrice": 14.99,
  "quantity": 1000,
  "deliveryTimeframe": "2-3 weeks",
  "samples": true,
  "specifications": {
    "material": "100% Organic Cotton",
    "weight": "200gsm",
    "certification": "GOTS Certified"
  }
}
```

### Get User's Material Requests
**GET** `/material-requests/my-requests` 🔒

### Get Request Responses
**GET** `/material-requests/:requestId/responses` 🔒

### Accept/Reject Seller Response
**PUT** `/material-requests/response/:acceptanceId/action` 🔒

**Request Body**:
```json
{
  "action": "accept",
  "message": "Your proposal looks great. Let's proceed."
}
```

---

## Negotiations

### Create Negotiation
**POST** `/negotiations/create` 🔒

**Request Body**:
```json
{
  "productId": "product_id",
  "sellerId": "seller_id",
  "initialOffer": {
    "price": 20.99,
    "quantity": 100,
    "message": "Interested in bulk purchase. Can you offer a better price?"
  }
}
```

### Get User Negotiations
**GET** `/negotiations/my-negotiations` 🔒

**Query Parameters**:
- `status`: `active` | `accepted` | `rejected` | `cancelled`
- `role`: `buyer` | `seller`
- `page` (number)
- `limit` (number)

### Get Negotiation Statistics
**GET** `/negotiations/stats` 🔒

### Get Negotiation Details
**GET** `/negotiations/:negotiationId` 🔒

### Send Negotiation Message
**POST** `/negotiations/:negotiationId/message` 🔒

**Request Body**:
```json
{
  "type": "counteroffer",
  "price": 18.99,
  "quantity": 150,
  "message": "How about this price for a larger quantity?"
}
```

### Accept Negotiation Offer
**PUT** `/negotiations/:negotiationId/accept` 🔒

### Cancel Negotiation
**PUT** `/negotiations/:negotiationId/cancel` 🔒

**Request Body**:
```json
{
  "reason": "Found a better deal elsewhere"
}
```

---

## Notifications

### Get User Notifications
**GET** `/notifications` 🔒

**Query Parameters**:
- `type`: `order` | `sample` | `negotiation` | `review` | `system`
- `isRead`: `true` | `false`
- `page` (number)
- `limit` (number)

### Get Notification Summary
**GET** `/notifications/summary` 🔒

### Get Notifications by Type
**GET** `/notifications/type/:type` 🔒

### Mark Notification as Read
**PUT** `/notifications/:notificationId/read` 🔒

### Mark All Notifications as Read
**PUT** `/notifications/mark-all-read` 🔒

### Delete Notification
**DELETE** `/notifications/:notificationId` 🔒

### Create Notification (Admin/System)
**POST** `/notifications/create` 🔒

**Request Body**:
```json
{
  "userId": "user_id",
  "type": "system",
  "title": "System Maintenance",
  "message": "System will be under maintenance from 2-4 AM EST",
  "data": {
    "maintenanceWindow": "2023-12-25T02:00:00Z"
  }
}
```

---

## Analytics

### Get User Analytics
**GET** `/analytics/user` 🔒

### Get User Performance Metrics
**GET** `/analytics/user/performance` 🔒

### Get Platform Statistics
**GET** `/analytics/platform` 🔒

---

## Chat & Messaging

### Get Messages by Location
**GET** `/messages/:location`

Get chat messages for a specific location-based room.

**Path Parameters**:
- `location`: Location identifier (e.g., "geo-21.1,79.1")

### Get Recent Messages
**GET** `/messages/:location/recent`

Get recent messages for a location-based chat room.

### Get Location Statistics
**GET** `/messages/:location/stats`

Get statistics for a location-based chat room (active users, message count, etc.).

---

## User Profile Management

### Get User Statistics
**GET** `/profile/statistics/:userId?` 🔒

Get comprehensive user statistics and analytics.

### Update User Profile
**PUT** `/profile/update` 🔒

**Request Body**:
```json
{
  "bio": "Experienced textile manufacturer with 10+ years in organic cotton",
  "company": "Green Textiles Co.",
  "website": "https://greentextiles.com",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe"
  },
  "businessHours": {
    "monday": { "open": "09:00", "close": "17:00" },
    "tuesday": { "open": "09:00", "close": "17:00" }
  }
}
```

### Get Connections
**GET** `/profile/connections` 🔒

### Send Connection Request
**POST** `/profile/connections/request/:userId` 🔒

### Respond to Connection Request
**PUT** `/profile/connections/respond/:requestId` 🔒

**Request Body**:
```json
{
  "action": "accept"
}
```

### Upload Profile Picture
**POST** `/profile/upload/profile` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: `profilePicture` (image file)

### Upload Cover Image
**POST** `/profile/upload/cover` 🔒

**Content-Type**: `multipart/form-data`
**Form Data**: `coverImage` (image file)

### Get Connection Suggestions
**GET** `/profile/suggestions/connections` 🔒

### Get User Order History (Profile)
**GET** `/profile/orders` 🔒

### Get User Review Sections
**GET** `/profile/reviews` 🔒

### Get User Product Listings (Profile)
**GET** `/profile/listings` 🔒

### Get User Material Requests (Profile)
**GET** `/profile/material-requests` 🔒

### Get User Notification Summary (Profile)
**GET** `/profile/notifications/summary` 🔒

### Get User Negotiations (Profile)
**GET** `/profile/negotiations` 🔒

---

## Socket.IO Events

### Connection
Connect to the socket server for real-time features.

**URL**: `http://localhost:5001`
**Transport**: WebSocket, Polling

### Location Chat Events

#### Join Location
**Event**: `joinLocation`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "location": "geo-21.1,79.1",
  "coordinates": {
    "lat": 21.1,
    "lng": 79.1
  }
}
```

#### Send Message
**Event**: `sendMessage`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "message": "Hello everyone!",
  "location": "geo-21.1,79.1",
  "coordinates": {
    "lat": 21.1,
    "lng": 79.1
  }
}
```

#### Typing Indicator
**Event**: `typing`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "location": "geo-21.1,79.1",
  "isTyping": true
}
```

#### Leave Location
**Event**: `leaveLocation`
**Data**:
```json
{
  "userId": "user_id",
  "location": "geo-21.1,79.1"
}
```

### Received Events

#### Receive Message
**Event**: `receiveMessage`
**Data**:
```json
{
  "_id": "message_id",
  "senderId": "user_id",
  "senderName": "John Doe",
  "message": "Hello everyone!",
  "location": "geo-21.1,79.1",
  "timestamp": "2023-12-20T10:30:00.000Z"
}
```

#### User Joined
**Event**: `userJoined`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "location": "geo-21.1,79.1",
  "timestamp": "2023-12-20T10:30:00.000Z"
}
```

#### User Left
**Event**: `userLeft`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "location": "geo-21.1,79.1",
  "timestamp": "2023-12-20T10:30:00.000Z"
}
```

#### Active Users Update
**Event**: `activeUsersUpdate`
**Data**:
```json
{
  "location": "geo-21.1,79.1",
  "activeCount": 5,
  "message": "5 users active in your area"
}
```

#### Nearby Users
**Event**: `nearbyUsers`
**Data**:
```json
{
  "count": 3,
  "users": [
    {
      "userId": "user_id_1",
      "userName": "User 1",
      "distance": "2.5"
    }
  ]
}
```

#### User Typing
**Event**: `userTyping`
**Data**:
```json
{
  "userId": "user_id",
  "userName": "John Doe",
  "isTyping": true
}
```

---

## Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "username": "string",
  "email": "string",
  "fullname": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "geolocation": {
      "lat": "number",
      "lng": "number"
    }
  },
  "isSupplier": "boolean",
  "isVendor": "boolean",
  "isProfileComplete": "boolean",
  "isEmailVerified": "boolean",
  "avatar": "string",
  "coverImages": ["string"],
  "rating": "number",
  "trustScore": "number",
  "ordersFulfilled": "number",
  "samplesGiven": "number",
  "samplesReceived": "number",
  "reviews": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Product Model
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "category": "string",
  "type": "raw|half-baked|complete",
  "price": "number",
  "quantity": "number",
  "minOrderQuantity": "number",
  "images": ["string"],
  "specifications": "object",
  "tags": ["string"],
  "supplier": "ObjectId",
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Order Model
```json
{
  "_id": "ObjectId",
  "orderId": "string",
  "buyer": "ObjectId",
  "seller": "ObjectId",
  "product": "ObjectId",
  "quantity": "number",
  "unitPrice": "number",
  "totalAmount": "number",
  "status": "pending|accepted|processing|shipped|delivered|cancelled",
  "deliveryAddress": "object",
  "trackingInfo": "object",
  "exchangeCode": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Testing

### Test Credentials
For testing purposes, you can use these sample credentials:
- **Email**: `test@example.com`
- **Password**: `testPassword123`

### Sample API Calls

#### Login Example (cURL)
```bash
curl -X POST http://localhost:5001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

#### Get Products Example (cURL)
```bash
curl -X GET "http://localhost:5001/api/products?page=1&limit=10&category=Textiles" \
  -H "Accept: application/json"
```

#### Create Product Example (cURL)
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Organic Cotton T-Shirts",
    "description": "High-quality organic cotton t-shirts",
    "category": "Textiles",
    "type": "raw",
    "price": 25.99,
    "quantity": 100
  }'
```

---

## Support and Contact

For API support, feature requests, or bug reports, please contact:
- **Email**: support@vendorverse.com
- **Documentation**: [API Docs URL]
- **GitHub Issues**: [Repository URL]

---

**Last Updated**: July 27, 2025  
**API Version**: 1.0
