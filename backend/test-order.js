import dotenv from 'dotenv';
dotenv.config();

const testOrder = async () => {
  console.log('🧪 Testing Order Placement with Email...');
  
  const orderData = {
    items: [
      {
        id: "1",
        name_en: "Test Product",
        name_ta: "டெஸ்ட்",
        price: 100,
        quantity: 1,
        category: "ATOM BOMB"
      }
    ],
    total: 100,
    customerDetails: {
      fullName: "Test User",
      mobile: "9999999999",
      email: "harikukh8@gmail.com", // Change this to your email
      address: "Test Address",
      pincode: "600001"
    }
  };

  try {
    console.log('📤 Sending order to API...');
    const response = await fetch('http://localhost:5000/api/orders/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    console.log('📥 API Response:', result);
    
    if (result.emailStatus === 'sent') {
      console.log('✅ Email should have been sent! Check your inbox.');
    } else {
      console.log('❌ Email status:', result.emailStatus);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testOrder();

