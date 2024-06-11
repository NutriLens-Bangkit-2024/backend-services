require('dotenv').config();

const jwt = require('jsonwebtoken');

// Define your secret key (this should be the same as the one used in your Hapi server)
const secretKey = process.env.JWT_SECRET;

// Define the payload (the data you want to include in the token)
const payload = {
    user: 'example_user',
    aud: 'urn:audience:test',
    iss: 'urn:issuer:test'
};

// Generate the token with a 4-hour expiration time
const token = jwt.sign(payload, secretKey, { expiresIn: '4h' });

// Output the generated token
console.log('Generated JWT Token:', token);
