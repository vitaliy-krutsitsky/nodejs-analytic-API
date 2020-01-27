const conf = require('../config');
const logger = require('../services/logger');

const getEndpointsMiddleware = (req, res, next) => {
  if (req.method === 'GET' && req.headers.authorization !== conf.auth.tokenGET) {
    logger.info('Unauthorized request');
    res.status(401).end('Unauthorized');
    return;
  }

  next();
};

exports.getEndpointsMiddleware = getEndpointsMiddleware;