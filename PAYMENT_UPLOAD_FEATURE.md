# Payment Screenshot Upload Feature

## Overview
This feature allows customers to upload payment screenshots for their orders, which can then be verified by administrators in the admin panel.

## Features

### Customer Side
1. **Payment Upload Page** (`/payment-upload`)
   - Customers can enter their Order ID and mobile number
   - Upload payment screenshots (JPG, PNG up to 5MB)
   - Form validation and file type/size checks
   - Success confirmation with upload details

2. **Track Order Page Updates**
   - Added "Upload Payment" button
   - Payment status display (Not Uploaded, Pending Verification, Verified)
   - Visual indicators for payment status

3. **Navigation**
   - Added "Upload Payment" link in the main navigation
   - Available on both desktop and mobile menus

### Admin Side
1. **Order Management**
   - Payment status indicators in order list
   - View payment screenshots with order details
   - Verify or reject payment screenshots
   - Payment verification history

2. **Payment Filters**
   - Filter orders by payment status:
     - All Orders
     - With Payment
     - Pending Verification
     - Verified

3. **Payment Screenshot Viewer**
   - Modal dialog to view uploaded screenshots
   - Customer and order information display
   - Verify/Reject buttons for pending payments
   - Verification status and timestamp

## Backend API Endpoints

### POST `/api/orders/upload-payment`
- Upload payment screenshot for an order
- Requires: `orderId`, `mobile`, `screenshot` (file)
- Validates order exists and mobile number matches
- Stores image in Cloudinary and updates order

### PATCH `/api/orders/verify-payment/:orderId`
- Verify or reject payment screenshot (admin only)
- Requires: `verified` (boolean), `verifiedBy` (string)
- Updates payment verification status and timestamp

## Database Schema Updates

### Order Model
Added `paymentScreenshot` field:
```javascript
paymentScreenshot: {
  imageUrl: String,
  uploadedAt: Date,
  verified: { type: Boolean, default: false },
  verifiedBy: String,
  verifiedAt: Date,
}
```

## File Structure

### New Files
- `src/pages/PaymentUpload.tsx` - Payment upload page
- `PAYMENT_UPLOAD_FEATURE.md` - This documentation

### Modified Files
- `backend/models/order.model.js` - Added payment screenshot fields
- `backend/server.js` - Added payment upload and verification endpoints
- `src/App.tsx` - Added payment upload route
- `src/pages/TrackOrder.tsx` - Added payment status and upload button
- `src/pages/Admin.tsx` - Added payment management features
- `src/components/Navbar.tsx` - Added payment upload navigation link

## Usage

### For Customers
1. Navigate to "Upload Payment" from the main menu
2. Enter Order ID and mobile number
3. Select payment screenshot file
4. Submit form
5. Check payment status in "Track Order" page

### For Administrators
1. Go to Admin Panel → Order Management
2. Use payment filters to find relevant orders
3. Click the eye icon to view payment screenshots
4. Verify or reject payments as appropriate
5. Monitor payment verification status

## Security Features
- Order validation (mobile number must match)
- File type and size validation
- Admin-only verification endpoints
- Secure file storage in Cloudinary

## Future Enhancements
- Email notifications for payment verification
- Bulk payment verification
- Payment screenshot analytics
- Integration with payment gateways 