const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/api/*'],
    createProxyMiddleware({
      target: 'https://synchro-api-ea00.onrender.com:10000',
      changeOrigin: true,
    })
  );
};
