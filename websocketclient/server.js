/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000; // You can use any port you prefer

const server = http.createServer((req, res) => {
  
  // Handle the root route, serve the index.html file
  if (req.url === '/' 
  || (req.url === '/index.html' )
  ) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }
  
  else if (req.url === '/stompsockjsimpl.js' 
  ||  req.url === '/stompsimpleimpl.js' 
  ||  req.url === '/sockjsimpl.js' 
  ||  req.url === '/plainwebsocketimpl.js' 
  ) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(content);
      }
    });
  } 
  
  else {
    // Handle other routes (if needed)
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
