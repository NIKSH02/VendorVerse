# Updated Order Flow Documentation

## Overview

Complete order management system with exchange code verification, seller limits, and integrated review system.

## Order Flow

### 1. Placing an Order

**Endpoint**: `POST /api/orders/place`

When User A places an order for User B's product:

- `buyerId` = User A (person placing the order)
- `sellerId` = User B (product owner who needs to fulfill the order)
- **Seller Limit**: Maximum 3 pending orders allowed per seller

### 2. Order Status Flow

#### Status Progression:

1. **pending** → Seller must "Accept"
2. **confirmed** → Seller must "Start Processing"
3. **processing** → Exchange code generated, Seller can "Ship"
4. **shipped** → Seller can "Mark as Complete" with exchange code
5. **completed** → Order finished, buyer can review

#### Actions Available:

**Seller Actions** (`PATCH /api/orders/:orderId/status`):

- `action: "accept"` (pending → confirmed)
- `action: "process"` (confirmed → processing) - **Generates exchange code**
- `action: "ship"` (processing → shipped)
- `action: "complete"` (shipped → completed) - **Requires exchange code from buyer**
- `action: "cancel"` (any status → cancelled)

**Buyer Actions**:

- `GET /api/orders/:orderId/exchange-code` - Get exchange code when order is in processing
- Provide exchange code to seller for completion
- Review completed orders

### 3. Exchange Code System

- **Generated**: When order moves to "processing" status
- **Visible to**: Buyer only (via GET endpoint)
- **Required for**: Seller to mark order as complete
- **Purpose**: Secure delivery verification

### 4. Seller Restrictions

- **Maximum 3 pending orders** (pending + confirmed + processing + shipped)
- Must complete existing orders before accepting new ones
- Cannot accept new orders when limit reached

### 5. Review System

After order completion:

- **Buyer**: Gets "Add Review" option
- **Endpoint**: Use existing review system (`POST /api/reviews`)
- **Integration**: Reviews appear on seller's profile and product listings
- **Reviewable Orders**: `GET /api/orders/reviewable`

## API Endpoints

### Core Order Management

| Endpoint                      | Method | Purpose             | User   |
| ----------------------------- | ------ | ------------------- | ------ |
| `/api/orders/place`           | POST   | Place new order     | Buyer  |
| `/api/orders/buyer/history`   | GET    | Orders I placed     | Buyer  |
| `/api/orders/seller/orders`   | GET    | Orders to fulfill   | Seller |
| `/api/orders/:orderId/status` | PATCH  | Update order status | Seller |

### Exchange Code System

| Endpoint                             | Method | Purpose           | User  |
| ------------------------------------ | ------ | ----------------- | ----- |
| `/api/orders/:orderId/exchange-code` | GET    | Get exchange code | Buyer |

### Review Integration

| Endpoint                 | Method | Purpose                         | User  |
| ------------------------ | ------ | ------------------------------- | ----- |
| `/api/orders/reviewable` | GET    | Get orders available for review | Buyer |
| `/api/reviews`           | POST   | Create review for order         | Buyer |

### Financial Tracking

| Endpoint                        | Method | Purpose                      | User |
| ------------------------------- | ------ | ---------------------------- | ---- |
| `/api/orders/financial/summary` | GET    | Get expenditure/revenue data | Any  |

## Updated Workflow

### For Sellers:

1. **Receive Order** → Status: `pending`
   - Action: Click "Accept Order"
2. **Order Accepted** → Status: `confirmed`
   - Action: Click "Start Processing"
3. **Processing Started** → Status: `processing`
   - Exchange code generated
   - Buyer can now see exchange code
   - Action: Click "Ship Order"
4. **Order Shipped** → Status: `shipped`
   - Wait for buyer to provide exchange code
   - Action: Click "Mark as Complete" + enter exchange code
5. **Order Completed** → Status: `completed`
   - Order finished successfully

### For Buyers:

1. **Order Placed** → Status: `pending`
   - Wait for seller acceptance
2. **Order Accepted** → Status: `confirmed`
   - Seller is preparing order
3. **Order Processing** → Status: `processing`
   - **Exchange code now available**
   - Can view code via API
4. **Order Shipped** → Status: `shipped`
   - Await delivery
   - Provide exchange code to seller upon delivery
5. **Order Completed** → Status: `completed`
   - **Can now add review**

## Key Features

### ✅ Exchange Code Security

- Generated only when processing starts
- Visible only to buyer
- Required for order completion
- Prevents fraudulent completion

### ✅ Seller Capacity Management

- Maximum 3 pending orders per seller
- Prevents order overflow
- Ensures quality service

### ✅ Financial Tracking

- Total expenditure (buyer perspective)
- Total revenue (seller perspective)
- Monthly breakdown
- Net balance calculation

### ✅ Review Integration

- Automatic review eligibility after completion
- Reviews linked to orders
- Profile integration for reputation building

## Response Examples

### Order with Exchange Code (Processing Status)

```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "processing",
    "exchangeCode": "ABC123XY",
    "buyerId": {...},
    "sellerId": {...}
  }
}
```

### Financial Summary

```json
{
  "success": true,
  "data": {
    "expenditure": {
      "total": 1250.0,
      "orderCount": 8
    },
    "revenue": {
      "total": 3400.0,
      "salesCount": 15
    },
    "netBalance": 2150.0
  }
}
```

This system ensures secure, trackable order completion with proper seller capacity management and integrated review functionality.
