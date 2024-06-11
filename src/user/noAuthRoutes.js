const { registerHandler, loginHandler } = require('./Authhandler');

const noAuthRoutes = [
    {
        method: 'POST',
        path: '/user',
        handler: registerHandler,
        options: {
            auth: false // Disable authentication for this route
        }
    },
    {
        method: 'POST',
        path: '/user/login',
        handler: loginHandler,
        options: {
            auth: false // Disable authentication for this route
        }
    },
];

module.exports = noAuthRoutes;
