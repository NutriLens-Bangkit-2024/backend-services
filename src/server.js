const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
require('dotenv').config();

const noAuthRoutes = require('./user/noAuthRoutes');
const userRoutes = require('./user/routes');

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5005; // Use the PORT environment variable or default to 5000

const init = async () => {
    const server = Hapi.server({
        port: PORT,
        host: '0.0.0.0', // Listen on all network interfaces
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register(jwt);

    // Define the JWT authentication strategy
    server.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: false,
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.sub }
            };
        }
    });

    // Default all routes to require authentication
    server.auth.default('jwt');

    // Register routes without authentication
    server.route(noAuthRoutes);

    // Register routes with authentication
    server.route(userRoutes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();
