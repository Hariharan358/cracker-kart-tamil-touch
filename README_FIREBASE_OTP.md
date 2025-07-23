# Firebase OTP Authentication Implementation

This document explains the Firebase OTP authentication implementation for the KM Crackers application.

## 🚀 Features Implemented

### 1. Firebase Phone Authentication
- **Phone number verification** using Firebase Authentication
- **OTP generation and verification** via Firebase
- **reCAPTCHA integration** for security
- **Automatic country code** (+91 for India)

### 2. Order Tracking with OTP
- **Secure order access** requiring phone verification
- **Automatic verification** after successful OTP
- **Session management** for verified users
- **Graceful error handling**

### 3. User Experience
- **Clean UI** with modern design
- **Loading states** and error messages
- **Resend OTP** with countdown timer
- **Toast notifications** for feedback

## 📁 Files Created/Modified

### New Files
1. **`src/lib/firebase.ts`** - Firebase configuration and initialization
2. **`src/hooks/useFirebaseAuth.ts`** - Custom hook for Firebase authentication
3. **`src/components/FirebaseOTP.tsx`** - OTP verification component
4. **`src/components/FirebaseTest.tsx`** - Test component for debugging

### Modified Files
1. **`src/pages/TrackOrder.tsx`** - Integrated Firebase OTP verification

## 🔧 Firebase Configuration

The Firebase configuration is set up in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAkrP1UTnDZOPQGnwuE_rJw2ifVF607FjU",
  authDomain: "kmcracker-23330.firebaseapp.com",
  projectId: "kmcracker-23330",
  storageBucket: "kmcracker-23330.firebasestorage.app",
  messagingSenderId: "774414865285",
  appId: "1:774414865285:web:cf74731b57b2436d302aec",
  measurementId: "G-XYKZKLQ5BD"
};
```

## 🔄 User Flow

### Order Tracking with OTP
1. **User enters Order ID and mobile number**
2. **System checks if user is authenticated**
3. **If not authenticated, shows OTP verification form**
4. **User clicks "Send OTP"** (triggers reCAPTCHA)
5. **Firebase sends OTP to phone number**
6. **User enters 6-digit OTP**
7. **System verifies OTP with Firebase**
8. **On success, automatically fetches order details**
9. **User can view order information**

### Authentication States
- **Not Authenticated**: User needs to verify phone number
- **Authenticated**: User can access order details directly
- **Session Persistence**: Authentication state persists across page reloads

## 🛡️ Security Features

1. **reCAPTCHA Integration**: Prevents automated OTP requests
2. **Phone Number Validation**: Only verified numbers can access orders
3. **Session Management**: Secure authentication state
4. **Error Handling**: Graceful handling of authentication failures

## 📱 OTP Component Features

### FirebaseOTP Component
- **Phone number display** for confirmation
- **Send OTP button** with loading state
- **OTP input field** with validation
- **Resend OTP** with 60-second countdown
- **Verify OTP** button with validation
- **Cancel option** to abort verification

### Error Handling
- **Invalid phone number** format
- **OTP sending failures**
- **Invalid OTP** entry
- **Network errors**
- **reCAPTCHA failures**

## 🧪 Testing

### FirebaseTest Component
Use the `FirebaseTest` component to verify authentication status:

```tsx
import FirebaseTest from './components/FirebaseTest';

// Add to any page for testing
<FirebaseTest />
```

### Manual Testing Steps
1. **Go to Track Order page**
2. **Enter Order ID and mobile number**
3. **Click "Track Order"**
4. **OTP verification form should appear**
5. **Click "Send OTP"**
6. **Complete reCAPTCHA if prompted**
7. **Enter OTP received on phone**
8. **Click "Verify OTP"**
9. **Order details should appear**

## 🔧 Configuration Options

### Country Code
Default country code is +91 (India). To change:

```typescript
// In useFirebaseAuth.ts
const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
```

### reCAPTCHA Settings
Configure reCAPTCHA in `firebase.ts`:

```typescript
recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
  size: 'invisible', // or 'normal'
  callback: () => console.log('reCAPTCHA solved'),
  'expired-callback': () => console.log('reCAPTCHA expired')
});
```

### OTP Resend Timer
Change countdown duration in `FirebaseOTP.tsx`:

```typescript
setCountdown(60); // 60 seconds
```

## 🚀 Deployment Notes

### Firebase Console Setup
1. **Enable Phone Authentication** in Firebase Console
2. **Add test phone numbers** for development
3. **Configure reCAPTCHA** domain settings
4. **Set up production phone numbers**

### Environment Variables
No additional environment variables needed - Firebase config is hardcoded.

### Security Rules
Firebase Authentication handles security automatically.

## 📊 Error Codes

Common Firebase authentication errors:
- **auth/invalid-phone-number**: Invalid phone number format
- **auth/invalid-verification-code**: Invalid OTP
- **auth/too-many-requests**: Too many OTP requests
- **auth/quota-exceeded**: SMS quota exceeded

## 🔄 Future Enhancements

1. **Email OTP**: Add email verification as backup
2. **Voice OTP**: Add voice call OTP option
3. **Multi-factor**: Add additional verification methods
4. **Analytics**: Track authentication success rates
5. **Caching**: Cache verified phone numbers

## 📞 Support

For issues with:
- **Firebase Configuration**: Check Firebase Console settings
- **OTP Delivery**: Verify phone number in Firebase Console
- **reCAPTCHA**: Check domain settings in Firebase Console
- **Implementation**: Check browser console for errors

## 🎉 Benefits

1. **Secure**: Firebase handles all security aspects
2. **Reliable**: Google's infrastructure ensures high uptime
3. **Free**: Firebase Phone Auth is free for most use cases
4. **Scalable**: Handles high traffic automatically
5. **User-friendly**: Simple and intuitive interface 