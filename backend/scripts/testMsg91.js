import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const testMsg91 = async () => {
  try {
    console.log('Testing Msg91 API...');
    console.log('API Key:', process.env.MSG91_API_KEY ? 'Configured' : 'Not configured');

    const phoneNumber = '8797196867';
    const otpCode = '123456';
    const otpMessage = `${otpCode} is your OTP. Valid for 10 minutes.`;

    console.log('\nSending test SMS to:', phoneNumber);
    console.log('Message:', otpMessage);

    const url = 'https://api.msg91.com/api/v2/sendsms';
    const data = {
      sender: 'SWEETH',
      route: '4',
      country: '91',
      sms: [
        {
          message: otpMessage,
          to: [phoneNumber]
        }
      ]
    };
    const headers = {
      'Content-Type': 'application/json',
      'authkey': process.env.MSG91_API_KEY
    };

    const response = await axios.post(url, data, { headers });

    console.log('\n✅ Success!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('\n❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    console.error('Response Data:', error.response?.data);
    console.error('Data:', error.config?.data);
  }
};

testMsg91();
