const conf = require('../config');

const getEndpointsMiddleware = (req, res, next) => {
  if (req.method === 'GET' && req.headers.authorization !== conf.auth.tokenGET) {
    console.log('Unauthorized request');
    res.status(401).end('Unauthorized');
    return;
  }

  next();
};

exports.getEndpointsMiddleware = getEndpointsMiddleware;