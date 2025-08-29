# Email Troubleshooting Guide

## Issue: Invoice emails are not being sent to customers

### ✅ What's Working
- Email configuration is correct (tested successfully)
- Invoice generation is working
- Email sending functionality is working

### 🔍 Debugging Steps

#### 1. Check Server Logs
When a customer places an order, check the server console for these log messages:

```
📧 Email sending process started...
📧 Customer email: [customer-email]
📧 Invoice path: [invoice-path]
📧 Email configuration found, attempting to send...
✅ Email sent successfully to: [customer-email]
```

#### 2. Check Email Status in Order Response
The order placement API now returns email status:
```json
{
  "message": "✅ Order placed successfully",
  "orderId": "ORDER-123",
  "emailStatus": "sent|failed|not_configured|invalid_email",
  "emailMessage": "Invoice email sent successfully"
}
```

#### 3. Common Issues and Solutions

##### Issue: Invalid Email Format
- **Symptoms**: `emailStatus: "invalid_email"`
- **Solution**: Ensure customers enter valid email addresses
- **Check**: Email format validation is now active

##### Issue: Email Configuration Missing
- **Symptoms**: `emailStatus: "not_configured"`
- **Solution**: Check `.env` file has `EMAIL_FROM` and `EMAIL_PASS`
- **Current Config**: ✅ Configured correctly

##### Issue: Email Sending Failed
- **Symptoms**: `emailStatus: "failed"`
- **Check**: Server logs for specific error messages
- **Common Causes**:
  - Network connectivity issues
  - Gmail rate limiting
  - Invalid app password

#### 4. Testing Email Functionality

Run the test scripts to verify email setup:

```bash
# Test basic email configuration
node --experimental-modules test-email.js

# Test full order email process
node --experimental-modules test-order-email.js
```

#### 5. Customer Email Validation

The system now validates customer email format:
- Must contain `@` symbol
- Must have domain with `.` (e.g., `.com`, `.in`)
- Invalid emails will show `emailStatus: "invalid_email"`

#### 6. Monitoring Email Delivery

To monitor if emails are actually being delivered:

1. **Check Gmail Sent Folder**: Look in the sender's Gmail sent folder
2. **Check Customer Spam Folder**: Emails might go to spam
3. **Check Server Logs**: Look for email sending confirmation
4. **Test with Known Email**: Try placing an order with your own email

#### 7. Gmail App Password Setup

If you need to regenerate the app password:

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Generate new app password
4. Update `.env` file with new password
5. Restart the server

#### 8. Rate Limiting

Gmail has sending limits:
- **Daily Limit**: 500 emails per day
- **Per Second**: 20 emails per second
- **Solution**: Monitor usage and implement delays if needed

### 🚀 Next Steps

1. **Monitor Real Orders**: Check server logs when customers place orders
2. **Verify Email Delivery**: Check if emails reach customer inboxes
3. **Test with Different Emails**: Try orders with various email providers
4. **Check Spam Filters**: Ensure emails aren't being blocked

### 📞 Support

If issues persist:
1. Check server logs for specific error messages
2. Verify customer email addresses are valid
3. Test email functionality with the provided test scripts
4. Monitor Gmail sending limits and quotas
