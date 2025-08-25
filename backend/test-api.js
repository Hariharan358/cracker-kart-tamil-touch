// test-api.js - Simple test script for API endpoints
import fetch from 'node-fetch';

const BASE_URL = 'https://api.kmpyrotech.com';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  // Test 1: Health check
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Orders endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/orders`);
    const data = await response.json();
    console.log('✅ Orders endpoint:', data);
  } catch (error) {
    console.log('❌ Orders endpoint failed:', error.message);
  }

  // Test 3: Order placement endpoint
  try {
    const testOrder = {
      items: [
        {
          id: "test123",
          name_en: "Test Product",
          name_ta: "சோதனை பொருள்",
          price: 100,
          quantity: 1,
          category: "TEST",
          imageUrl: "test.jpg"
        }
      ],
      total: 100,
      customerDetails: {
        fullName: "Test Customer",
        mobile: "1234567890",
        email: "test@example.com",
        address: "Test Address",
        pincode: "123456"
      }
    };

    const response = await fetch(`${BASE_URL}/api/orders/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Order placement endpoint:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Order placement failed:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ Order placement endpoint failed:', error.message);
  }

  // Test 4: Categories endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/categories`);
    const data = await response.json();
    console.log('✅ Categories endpoint:', data);
  } catch (error) {
    console.log('❌ Categories endpoint failed:', error.message);
  }
}

testEndpoints();

