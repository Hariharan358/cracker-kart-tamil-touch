# Order Tracking System

## Overview
The order tracking system provides a clear three-step process for customers to track their orders from placement to delivery.

## Order Status Flow

### 1. **Confirmed** 📦
- **Status**: `confirmed`
- **Description**: Order has been placed and confirmed by the system
- **Customer Action**: Upload payment screenshot
- **Next Step**: Wait for admin to verify payment

### 2. **Payment Verified** ✅
- **Status**: `payment_verified`
- **Description**: Payment screenshot has been verified by admin
- **Customer Action**: None (wait for delivery booking)
- **Next Step**: Admin will book order for delivery

### 3. **Booked for Delivery** 🚚
- **Status**: `booked`
- **Description**: Order has been booked for delivery with transport details
- **Customer Action**: None (track delivery)
- **Next Step**: Order is in transit

## How It Works

### Frontend (TrackOrder.tsx)
- Displays a visual progress bar showing the current step
- Shows detailed order information including payment and shipping details
- Provides clear next steps for customers
- Responsive design with proper status icons and descriptions

### Backend (server.js)
- **Status Validation**: Enforces proper status transitions
- **Payment Verification**: Admin can verify payment screenshots
- **Transport Booking**: Admin can add transport details and mark as booked
- **Push Notifications**: Sends status update notifications to customers

## API Endpoints

### Track Order
```
GET /api/orders/track?orderId={orderId}&mobile={mobile}
```

### Upload Payment
```
POST /api/orders/upload-payment
Body: { orderId, mobile, screenshot }
```

### Verify Payment (Admin)
```
PATCH /api/orders/verify-payment/{orderId}
Body: { verified: boolean, verifiedBy: string }
```

### Update Status (Admin)
```
PATCH /api/orders/update-status/{orderId}
Body: { status, transportName?, lrNumber? }
```

## Status Transitions

| Current Status | Allowed Next Status |
|----------------|---------------------|
| `confirmed` | `payment_verified`, `booked` |
| `payment_verified` | `booked` |
| `booked` | `booked` (can stay) |

## Customer Experience

1. **Order Placed**: Customer sees "Order Confirmed" status
2. **Payment Upload**: Customer uploads payment screenshot
3. **Payment Verification**: Admin verifies payment (status becomes "Payment Verified")
4. **Delivery Booking**: Admin books delivery with transport details (status becomes "Booked")
5. **Tracking**: Customer can track their order through the entire process

## Admin Workflow

1. **Review Orders**: View all orders in admin panel
2. **Verify Payments**: Check payment screenshots and mark as verified
3. **Book Delivery**: Add transport details and mark order as booked
4. **Send Notifications**: System automatically notifies customers of status changes

## Technical Implementation

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer for payment screenshots
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Validation**: Status transition validation on backend
- **Progress Bar**: Visual representation of order progress
