const morgan = require('morgan');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// Use /tmp on serverless environments (Vercel) where the project root is read-only
let logsDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'kronovolt-logs')
  : path.join(__dirname, '..', 'logs');

try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch {
  logsDir = os.tmpdir();
}

// Custom format for logging
morgan.token('reqId', (req) => req.reqId || 'unknown');
morgan.token('userId', (req) => req.user?.id || 'anonymous');

const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" reqId=:reqId userId=:userId';

let accessLogStream;
let errorLogStream;
try {
  accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
  errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });
} catch {
  accessLogStream = process.stdout;
  errorLogStream = process.stderr;
}

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
