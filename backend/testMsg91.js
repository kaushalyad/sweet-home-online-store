import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testMsg91SMS() {
  console.log('🔍 Testing MSG91 v5 OTP API...\n');
  
  const phoneNumber = '918797196867'; // Full format with country code
  const otpCode = '123456';
  
  try {
    const url = 'https://api.msg91.com/api/v5/otp';
    
    const headers = {
      'Content-Type': 'application/json',
      'authkey': process.env.MSG91_API_KEY
    };

    const data = {
      mobile: phoneNumber,
      otp: otpCode,
      route: '4',
      template_id: process.env.MSG91_TEMPLATE_ID || ''
    };

    console.log('📤 Request Details:');
    console.log('  URL:', url);
    console.log('  Phone:', phoneNumber);
    console.log('  OTP:', otpCode);
    console.log('  Route: 4 (Transactional)');
    console.log('  API Key:', process.env.MSG91_API_KEY?.substring(0, 10) + '...');
    console.log('\n⏳ Sending request...\n');

    const response = await axios.post(url, data, { 
      headers,
      timeout: 5000 
    });

    console.log('✅ Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.request_id) {
      console.log('\n📋 Message Details:');
      console.log('  Request ID:', response.data.request_id);
      console.log('  Type:', response.data.type);
      console.log('  Message:', response.data.message);
    }
    
    console.log('\n✅ TEST PASSED - MSG91 API accepted the request');
    console.log('⚠️  Note: API accepted ≠ SMS delivered. Check MSG91 OTP Logs for actual delivery status.');
    
  } catch (error) {
    console.log('❌ Request Failed');
    console.log('  Status:', error.response?.status);
    console.log('  Error:', error.response?.data || error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n⚠️  Cannot reach MSG91 API - Network issue or DNS problem');
    }
  }
}

testMsg91SMS();
