import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const testDownload = async () => {
  console.log('🧪 Testing Invoice Download Endpoint...');
  
  // Test with a known order ID (you can change this to a real order ID)
  const testOrderId = 'TEST-2025-002'; // This should exist from our email test
  
  try {
    console.log(`📤 Testing download for order: ${testOrderId}`);
    
    const response = await fetch(`http://localhost:5000/api/orders/${testOrderId}/invoice`);
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const blob = await response.blob();
      console.log('✅ Download successful!');
      console.log('📊 File size:', blob.size, 'bytes');
      console.log('📄 Content type:', blob.type);
      
      // Save the file locally for testing
      const buffer = await blob.arrayBuffer();
      const testPath = path.join(__dirname, 'test-download.pdf');
      fs.writeFileSync(testPath, Buffer.from(buffer));
      console.log('💾 Test file saved to:', testPath);
      
    } else {
      const errorText = await response.text();
      console.log('❌ Download failed:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testDownload();

