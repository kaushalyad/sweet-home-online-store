import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '../utils/emailService.js';

// Test email functionality
const testEmails = async () => {
  console.log('Testing email functionality...');

  // Test order data
  const testOrderData = {
    orderId: '507f1f77bcf86cd799439011', // Example MongoDB ObjectId
    customerName: 'John Doe',
    customerEmail: 'test@example.com',
    items: [
      {
        name: 'Rasgulla (500g)',
        quantity: 2,
        price: 150,
        image: ['https://example.com/rasgulla.jpg']
      },
      {
        name: 'Gulab Jamun (250g)',
        quantity: 1,
        price: 120,
        image: ['https://example.com/gulab-jamun.jpg']
      }
    ],
    totalAmount: 420,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '+91-9876543210',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001'
    },
    paymentMethod: 'cod',
    orderDate: new Date()
  };

  try {
    console.log('Sending order confirmation email...');
    const customerResult = await sendOrderConfirmationEmail(testOrderData);
    console.log('Customer email result:', customerResult);

    console.log('Sending admin notification email...');
    const adminResult = await sendAdminOrderNotification(testOrderData);
    console.log('Admin email result:', adminResult);

    console.log('Email test completed successfully!');
  } catch (error) {
    console.error('Email test failed:', error);
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmails();
}

export { testEmails };