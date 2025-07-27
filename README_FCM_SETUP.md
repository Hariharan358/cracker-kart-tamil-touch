# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up Firebase Cloud Messaging for push notifications in the KMPyrotech application.

## 🚀 Features Implemented

### 1. Frontend FCM Integration
- **Automatic permission request** for notifications
- **Token generation and storage** in localStorage
- **Foreground message handling** with toast notifications
- **Background message handling** via service worker
- **Notification permission UI** in navbar

### 2. Backend FCM Integration
- **Token registration** API endpoint
- **Send to individual user** API endpoint
- **Send to all users** API endpoint
- **Token management** and storage
- **Admin notification panel** for sending notifications

### 3. User Experience
- **Seamless permission flow** with clear feedback
- **Visual indicators** for notification status
- **Toast notifications** for foreground messages
- **Background notifications** with custom actions

## 📁 Files Created/Modified

### New Files
1. **`src/lib/firebase.ts`** - Firebase configuration and FCM setup
2. **`src/hooks/useFCM.ts`** - Custom hook for FCM functionality
3. **`src/components/NotificationPermission.tsx`** - Notification permission UI
4. **`public/firebase-messaging-sw.js`** - Service worker for background notifications
5. **`README_FCM_SETUP.md`** - This setup guide

### Modified Files
1. **`src/components/Navbar.tsx`** - Added notification permission component
2. **`src/pages/Admin.tsx`** - Added notification sending panel
3. **`backend/server.js`** - Added FCM API endpoints
4. **`package.json`** - Added Firebase dependencies

## 🔧 Firebase Console Setup

### 1. Enable Cloud Messaging
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kmpyrotech-ff59c`
3. Go to **Project Settings** > **Cloud Messaging**
4. Enable **Cloud Messaging API**

### 2. Generate VAPID Key
1. In **Cloud Messaging** tab, scroll to **Web configuration**
2. Click **Generate Key Pair**
3. Copy the **Key pair** (VAPID key)
4. Replace `YOUR_VAPID_KEY_HERE` in `src/lib/firebase.ts`

### 3. Download Service Account Key
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the following values for environment variables:
   - `client_email`
   - `private_key`

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Firebase Admin SDK
FIREBASE_CLIENT_EMAIL=your-service-account-email@kmpyrotech-ff59c.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

## 🔧 VAPID Key Configuration

Update the VAPID key in `src/lib/firebase.ts`:

```typescript
const token = await getToken(messaging, {
  vapidKey: 'YOUR_ACTUAL_VAPID_KEY_HERE' // Replace with your VAPID key
});
```

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file with Firebase credentials.

### 3. Update VAPID Key
Replace the placeholder VAPID key in the Firebase configuration.

### 4. Start the Application
```bash
npm run dev
```

## 📱 How It Works

### Frontend Flow
1. **App loads** → FCM hook initializes
2. **Permission request** → User grants/denies notification permission
3. **Token generation** → FCM token is generated and stored
4. **Token registration** → Token is sent to backend
5. **Message listening** → App listens for foreground messages
6. **Service worker** → Handles background messages

### Backend Flow
1. **Token storage** → FCM tokens are stored in memory (use database in production)
2. **Notification sending** → Admin can send notifications via API
3. **Message delivery** → Firebase delivers messages to registered devices

### Admin Panel
1. **Notification form** → Admin enters title and message
2. **Send to all** → Notification is sent to all registered users
3. **Success feedback** → Shows number of successful deliveries

## 🧪 Testing

### 1. Enable Notifications
1. Open the app in browser
2. Click "Enable Notifications" in navbar
3. Grant permission when prompted
4. Should see "Notifications enabled" status

### 2. Send Test Notification
1. Go to Admin panel
2. Fill notification form
3. Click "Send Notification to All Users"
4. Check for notification on device

### 3. Background Notifications
1. Close the browser tab
2. Send notification from admin panel
3. Should receive system notification
4. Click notification to open app

## 🔧 API Endpoints

### Register FCM Token
```http
POST /api/notifications/register-token
Content-Type: application/json

{
  "token": "fcm_token_here",
  "userId": "user_id_here"
}
```

### Send to Individual User
```http
POST /api/notifications/send
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification Message",
  "userId": "user_id_here",
  "data": { "key": "value" }
}
```

### Send to All Users
```http
POST /api/notifications/send-to-all
Content-Type: application/json

{
  "title": "Notification Title",
  "body": "Notification Message",
  "data": { "key": "value" }
}
```

### Get Token Count
```http
GET /api/notifications/tokens-count
```

## 🛡️ Security Considerations

1. **VAPID Key**: Keep your VAPID key secure
2. **Service Account**: Never commit service account keys to version control
3. **Token Storage**: Use secure database storage in production
4. **Rate Limiting**: Implement rate limiting for notification sending
5. **User Consent**: Always request explicit permission

## 🚀 Production Deployment

### 1. Database Storage
Replace in-memory token storage with database:

```javascript
// In server.js, replace Map with database operations
const fcmTokens = new Map(); // Replace with database queries
```

### 2. Environment Variables
Set production environment variables:
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### 3. HTTPS Required
FCM requires HTTPS in production for security.

### 4. Service Worker
Ensure service worker is properly cached and served.

## 📊 Monitoring

### Firebase Console
- Monitor message delivery in Firebase Console
- Check delivery rates and failures
- Analyze user engagement

### Application Logs
- Monitor token registration success/failure
- Track notification sending results
- Log user permission changes

## 🔄 Future Enhancements

1. **Topic-based notifications** for different user segments
2. **Scheduled notifications** for promotions
3. **Rich notifications** with images and actions
4. **Analytics integration** for notification performance
5. **User preferences** for notification types
6. **Database integration** for persistent token storage

## 📞 Support

For issues with:
- **Firebase Configuration**: Check Firebase Console settings
- **VAPID Key**: Verify key is correctly set
- **Service Worker**: Check browser console for errors
- **Token Registration**: Verify backend API is running
- **Permission Issues**: Check browser notification settings

## 🎉 Benefits

1. **Engagement**: Keep users informed about offers and updates
2. **Retention**: Increase user engagement with timely notifications
3. **Marketing**: Promote new products and discounts
4. **User Experience**: Provide real-time updates
5. **Scalability**: Handle thousands of notifications efficiently 