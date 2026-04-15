import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load from backend/.env (current directory)
const envPath = path.join(__dirname, '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

import axios from 'axios';
import connectDB from './config/mongodb.js';
import userModel from './models/userModel.js';

async function diagnose() {
  try {
    console.log('=== SMS Delivery Diagnostic ===\n');

    // 1. Check configuration
    console.log('\n1. CHECKING CONFIGURATION:');
    console.log(`   MSG91_API_KEY: ${process.env.MSG91_API_KEY ? '✓ SET' : '✗ MISSING'}`);
    console.log(`   MSG91_API_KEY length: ${process.env.MSG91_API_KEY?.length || 0}`);
    console.log(`   MSG91_API_KEY value: ${process.env.MSG91_API_KEY}`);
    console.log(`   MSG91_TEMPLATE_ID: ${process.env.MSG91_TEMPLATE_ID ? '✓ SET' : '✗ MISSING'}`);
    console.log(`   MSG91_TEMPLATE_ID value: ${process.env.MSG91_TEMPLATE_ID || 'NOT SET'}`);

    // 2. Check user in database
    console.log('\n2. CHECKING USER IN DATABASE:');
    await connectDB();
    const user = await userModel.findOne({ phone: '8797196867' });
    if (user) {
      console.log(`   ✓ User found`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   OTP Code: ${user.otpCode}`);
      console.log(`   OTP Expires: ${user.otpExpires}`);
    } else {
      console.log('   ✗ User NOT found');
      process.exit(1);
    }

    // 3. Test MSG91 API directly
    console.log('\n3. TESTING MSG91 API DIRECTLY:');
    const phoneNumber = '918797196867';
    const testOTP = '123456';
    const testMessage = `${testOTP} is your OTP. Valid for 10 minutes.`;

    const headers = {
      'Content-Type': 'application/json',
      'authkey': process.env.MSG91_API_KEY
    };

    const data = {
      mobile: phoneNumber,
      otp: testOTP,
      template_id: process.env.MSG91_TEMPLATE_ID || ''
    };

    console.log(`   Endpoint: https://api.msg91.com/api/v5/otp`);
    console.log(`   Mobile: ${phoneNumber}`);
    console.log(`   OTP: ${testOTP}`);
    console.log(`   Template ID: ${process.env.MSG91_TEMPLATE_ID || 'NOT SET'}`);
    console.log(`   Authkey: ${process.env.MSG91_API_KEY}`);

    try {
      const response = await axios.post('https://api.msg91.com/api/v5/otp', data, { headers });
      
      console.log(`\n   RESPONSE STATUS: ${response.status}`);
      console.log(`   RESPONSE DATA:`, JSON.stringify(response.data, null, 2));
      
      if (response.data.request_id) {
        console.log(`   ✓ REQUEST ID: ${response.data.request_id}`);
        console.log(`   ✓ SMS was queued for delivery`);
      }

      if (response.data.type === 'error') {
        console.log(`   ✗ ERROR: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`   ✗ API ERROR:`);
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Data:`, JSON.stringify(error.response?.data, null, 2));
      console.log(`   Error Message: ${error.message}`);
    }

    // 4. Check common issues
    console.log('\n4. COMMON ISSUES TO CHECK:');
    console.log(`   a) Is your phone on DND? Check: https://ndnc.org.in`);
    console.log(`   b) Check MSG91 dashboard → SMS → OTP Logs for delivery status`);
    console.log(`   c) Check MSG91 Account Balance → Ensure you have SMS credits`);
    console.log(`   d) Check if sender ID is approved`);
    console.log(`   e) Try a different phone number to test`);

    console.log('\n5. NEXT STEPS:');
    console.log(`   1. Log into MSG91 dashboard`);
    console.log(`   2. Go to Reports → OTP Logs`);
    console.log(`   3. Search for: 918797196867`);
    console.log(`   4. Check delivery status and error codes`);
    console.log(`   5. Check if account has sufficient balance`);

    process.exit(0);
  } catch (error) {
    console.error('Diagnostic error:', error);
    process.exit(1);
  }
}

diagnose();
