/**
 * MAQDOOM BROS DESIGNERS PVT LTD (Est. 1895)
 * Vercel Serverless Entrypoint & Protected Static Dispatcher
 */

const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

module.exports = (req, res) => {
  // 1. Security Protection: Path sanitization and traversal prevention
  let rawUrl = (req.url || '/').split('?')[0];
  let reqPath;
  try {
    reqPath = decodeURI(rawUrl);
  } catch (e) {
    reqPath = rawUrl;
  }
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const rootDir = path.resolve(__dirname);
  const publicDir = path.resolve(__dirname, 'public');

  let targetPath = path.resolve(publicDir, '.' + safePath);
  if (!targetPath.startsWith(publicDir)) {
    targetPath = path.resolve(rootDir, '.' + safePath);
  }

  // Security barrier: Ensure file path cannot escape project root
  if (!targetPath.startsWith(rootDir)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden');
    return;
  }

  // 2. Security Headers on All Responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 3. Serve static file if exists
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    const ext = path.extname(targetPath).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    return fs.createReadStream(targetPath).pipe(res);
  }

  // 4. Fallback to index.html
  const fallbackIndex = path.join(publicDir, 'index.html');
  if (fs.existsSync(fallbackIndex)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return fs.createReadStream(fallbackIndex).pipe(res);
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('404 Not Found');
};
