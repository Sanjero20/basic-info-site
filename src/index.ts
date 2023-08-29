import fs from 'fs';
import path from 'path';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong!');
      return;
    }

    let url = req.url === '/' ? 'index' : req.url;
    let filePath = '';
    let contentType = '';

    if (url.endsWith('.css')) {
      filePath = path.join(__dirname, url);
      contentType = 'text/css';
    } else {
      filePath = path.join(__dirname, 'pages', url + '.html');
      contentType = 'text/html';
    }

    fs.readFile(filePath, 'utf-8', (error, content) => {
      // Display 404 page if the html file is not found
      if (error) {
        const path404 = path.join(__dirname, 'pages', '404.html');
        fs.readFile(path404, 'utf-8', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content);
        });
        return;
      }

      // Display the html contents
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  }
);

// Event Listener
server.listen(port, hostname, () => {
  console.clear();
  console.log(`Server running at http://${hostname}:${port}`);
});
