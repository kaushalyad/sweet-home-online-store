console.log('Test file running...');

try {
    import('express').then(() => {
        console.log('Express is installed');
    }).catch(e => {
        console.error('Express is not installed:', e.message);
    });
} catch (e) {
    console.error('Error importing express:', e.message);
}

try {
    import('mongoose').then(() => {
        console.log('Mongoose is installed');
    }).catch(e => {
        console.error('Mongoose is not installed:', e.message);
    });
} catch (e) {
    console.error('Error importing mongoose:', e.message);
}

try {
    import('dotenv').then(() => {
        console.log('Dotenv is installed');
    }).catch(e => {
        console.error('Dotenv is not installed:', e.message);
    });
} catch (e) {
    console.error('Error importing dotenv:', e.message);
}

// Test environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set'); 