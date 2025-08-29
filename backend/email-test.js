// Standalone email test - can be run without server
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateInvoice } from './utils/generateInvoice.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function testCustomerEmail() {
  console.log('🧪 Testing Customer Email Functionality...\n');
  
  // Test with a real customer email (replace with actual customer email)
  const customerEmail = 'harikukh8@gmail.com'; // Change this to test with different emails
  
  console.log('📧 Testing with customer email:', customerEmail);
  
  // Create a mock order
  const mockOrder = {
    orderId: 'TEST-2025-002',
    customerDetails: {
      fullName: 'Test Customer',
      mobile: '9876543210',
      email: customerEmail,
      address: 'Test Address, Test City',
      pincode: '123456'
    },
    items: [
      {
        name_en: 'Test Product 1',
        name_ta: 'டெஸ்ட் பொருள் 1',
        price: 100,
        quantity: 2
      },
      {
        name_en: 'Test Product 2',
        name_ta: 'டெஸ்ட் பொருள் 2',
        price: 150,
        quantity: 1
      }
    ],
    total: 350,
    status: 'confirmed'
  };
  
  try {
    // Step 1: Generate invoice
    console.log('\n📄 Step 1: Generating invoice...');
    const invoiceDir = path.join(__dirname, 'invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir);
    }
    
    const invoicePath = path.join(invoiceDir, `${mockOrder.orderId}.pdf`);
    generateInvoice(mockOrder, invoicePath);
    
    // Wait for PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!fs.existsSync(invoicePath)) {
      throw new Error('Invoice generation failed');
    }
    
    console.log('✅ Invoice generated:', invoicePath);
    console.log('📊 Invoice size:', fs.statSync(invoicePath).size, 'bytes');
    
    // Step 2: Send email
    console.log('\n📧 Step 2: Sending email...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Verify transporter
    await transporter.verify();
    console.log('✅ Email transporter verified');
    
    const mailOptions = {
      from: `"KMPyrotech Invoice" <${process.env.EMAIL_FROM}>`,
      to: customerEmail,
      subject: 'KMPyrotech - Your Order Invoice',
      text: `Dear ${mockOrder.customerDetails.fullName},\n\nThank you for your order!\n\nOrder ID: ${mockOrder.orderId}\nTotal Amount: ₹${mockOrder.total}\n\nPlease find your invoice attached.\n\nBest regards,\nKMPyrotech Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Order Confirmation</h2>
          <p>Dear ${mockOrder.customerDetails.fullName},</p>
          <p>Thank you for your order!</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${mockOrder.orderId}</p>
            <p><strong>Total Amount:</strong> ₹${mockOrder.total}</p>
            <p><strong>Status:</strong> ${mockOrder.status}</p>
          </div>
          <p>Please find your invoice attached.</p>
          <br>
          <p>Best regards,<br>KMPyrotech Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `${mockOrder.orderId}.pdf`,
          path: invoicePath,
          contentType: 'application/pdf'
        }
      ]
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Sent to:', customerEmail);
    
    console.log('\n🎉 Test completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check your email inbox for the invoice');
    console.log('2. Check spam/junk folder if not in inbox');
    console.log('3. Verify the PDF attachment opens correctly');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed. Please check:');
      console.error('  1. Gmail 2-Factor Authentication is enabled');
      console.error('  2. App Password is correctly generated');
      console.error('  3. EMAIL_FROM matches your Gmail address');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Connection failed. Check internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n⏰ Connection timed out. Try again.');
    }
  }
}

// Instructions for testing different emails
console.log('📝 Instructions:');
console.log('1. Change the customerEmail variable to test with different email addresses');
console.log('2. Run this script to test email delivery');
console.log('3. Check the recipient email inbox and spam folder');
console.log('');

testCustomerEmail();
