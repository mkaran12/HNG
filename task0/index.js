const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    // Get the current time once
    const CurrentTime = new Date().toISOString(); // Generate current time in ISO format

    // Map over the dataObj and add currentTime to each product
    const cardsHtml = dataObj
      .map((el) => {
        // Create a new object that includes the current time
        return {
          ...el, // Spread the existing properties
          currentTime: CurrentTime, // Add currentTime property
        };
      })
      .map((el) => replaceTemplate(tempCard, el)) // Pass the updated object to replaceTemplate
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow specific methods
      'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
    });
    res.end(data);

    // Handle preflight requests
  } else if (req.method === 'OPTIONS' && pathname === '/api') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*', // Allow all origins
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // Change app.listen to server.listen
  console.log(`Server is running on port ${PORT}`);
});
