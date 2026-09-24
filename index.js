/**
 * MAQDOOM BROS DESIGNERS PVT LTD (Est. 1895)
 * Vercel Serverless Entrypoint & Static Dispatcher
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
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Check public folder first, then root
  let targetPath = path.join(__dirname, 'public', reqPath);
  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(__dirname, reqPath);
  }

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    const ext = path.extname(targetPath).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    return fs.createReadStream(targetPath).pipe(res);
  }

  // Fallback to index.html
  const fallbackIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(fallbackIndex)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return fs.createReadStream(fallbackIndex).pipe(res);
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('404 Not Found');
};
