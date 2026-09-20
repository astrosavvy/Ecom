const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = fs.existsSync(path.join(__dirname, 'younoya-web', 'dist'))
  ? path.join(__dirname, 'younoya-web', 'dist')
  : path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath === '/' || safePath === '\\' ? 'index.html' : safePath);

  fs.stat(filePath, (err, stats) => {
    // SPA fallback: If file doesn't exist or is a directory, fallback to index.html
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // HTTP range request support for video playback (.mp4)
    if (ext === '.mp4') {
      try {
        const videoStat = fs.statSync(filePath);
        const fileSize = videoStat.size;
        const range = req.headers.range;

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(filePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
            'Access-Control-Allow-Origin': '*'
          };
          res.writeHead(206, head);
          file.pipe(res);
          return;
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
          };
          res.writeHead(200, head);
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      } catch (streamErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Video Stream Error');
        return;
      }
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`YOUNOYA frontend running at http://localhost:${PORT}/ (serving from ${DIST_DIR})`);
});
