const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logging
morgan.token('reqId', (req) => req.reqId || 'unknown');
morgan.token('userId', (req) => req.user?.id || 'anonymous');

const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" reqId=:reqId userId=:userId';

const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Fast synchronous request ID generation using Node built-in crypto
const addRequestId = (req, res, next) => {
  req.reqId = crypto.randomUUID().slice(0, 8);
  res.setHeader('X-Request-ID', req.reqId);
  next();
};

const requestLogger = morgan(logFormat, {
  stream: accessLogStream,
  skip: (req) => req.url === '/health'
});

const errorLogger = morgan(logFormat, {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400
});

const suspiciousPatterns = [
  /script.*alert/i,
  /union.*select/i,
  /drop.*table/i,
  /<script/i,
  /javascript:/i
];

const securityLogger = (req, res, next) => {
  const url = req.url.toLowerCase();
  const userAgent = (req.get('User-Agent') || '').toLowerCase();

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'SECURITY_ALERT',
        ip: req.ip || req.socket?.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        reqId: req.reqId,
        pattern: pattern.source
      };

      fs.appendFile(
        path.join(logsDir, 'security.log'),
        JSON.stringify(logEntry) + '\n',
        () => {}
      );
    }
  }

  next();
};

module.exports = {
  addRequestId,
  requestLogger,
  errorLogger,
  securityLogger
};
