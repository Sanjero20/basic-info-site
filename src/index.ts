import fs from 'fs';
import path from 'path';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const hostname = '127.0.0.1';
const port = 3000;
const pagesDirectory = path.join(__dirname, 'pages');

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Something went wrong!');
      return;
    }

    let filePath = path.join(
      pagesDirectory,
      req.url === '/' ? 'index' : req.url
    );
    filePath = filePath.concat('.html');

    fs.readFile(filePath, 'utf-8', (error, content) => {
      // Display 404 page if the html file is not found
      if (error) {
        const path404 = path.join(pagesDirectory, '404.html');
        fs.readFile(path404, 'utf-8', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content);
        });
        return;
      }

      // Display the html contents
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  }
);

// Event Listener
server.listen(port, hostname, () => {
  console.clear();
  console.log(`Server running at http://${hostname}:${port}`);
});
