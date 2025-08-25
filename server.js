/* Step by Step */
/* TODO: Document in README.md */

/* [--------------------DATABASE CONNECTION-------------------------] */
/*Get SQLITE3 module and connect to the database inside project*/
const { DatabaseSync } = require('node:sqlite');
let db;

try {
    db = new DatabaseSync('db/creatures_test_2.sq3');
    console.log("Connected to creatures database");
} catch (error) {
    console.error("Failed to connect to database :C ", error);
}
/* [----------------------------------------------------------------] */

/*
Following built-in node.js modules are fetched:
    + HTTP module for server connections
    + FS module for helping script find html + other files inside directory
    + PATH module to combine request url to directory paths
    + Self-made MimeTypes module (info on mimetypes.js)
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const mt = require('./mimeTypes.js');

/* [--------------------SERVER CONNECTIONS-------------------------] */

/*
    lines 39 & 43 - 47 
    + ___dirname is a global variable in Node that gives the directory of server.js
      We'll "join" the fetched urls from client-side into our directory's structure
    + First URL will return index.html. Every other one returns respective path.
      Afterwards, join with directory's structure, then assign Content-Type based on
      MimeTypes module.
*/
const public = path.join(__dirname, 'public');

const server = http.createServer((request, response) => { // -- Initiate Server
    
    let requestedPath = request.url === '/' ? 'index.html' : request.url;
    let filePath = path.join(public, requestedPath);
    
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mt[extname]; //TODO: set default

    /* [--------------------API ENDPOINTS-------------------------] */
    if (request.url === '/api/creatures') { // -- Send all creature data
        try {
            const creatures = db.prepare('SELECT * FROM creatures').all();
            response.writeHead(200, { 'Content-Type' : 'application/json' });
            response.end(JSON.stringify(creatures));
        } catch (db_error) {
            console.error('Database query failed :C ', db_error);
            response.writeHead(500, { 'Content-Type' : 'application/json' });
            response.end(JSON.stringify({ error: 'Failed to retrieve data' }));
        }

        return;
    }
    /* [----------------------------------------------------------] */

    fs.readFile(filePath, (error, content) => {
            if (error) { 
                if (error.code === 'ENOENT') { // -- Error code for File Not Found
                    response.writeHead(404, {'Content-Type' : 'text/plain'});
                    response.end('404: FILE NOT FOUND DINGUS');
                }
                else { // -- Any other server Error
                    response.writeHead(500, {'Content-Type' : 'text/plain'});
                    response.end('500: SERVER ERROR DINGUS');
                }
            }
            else {
                response.writeHead(200, {'Content-Type' : contentType});
                response.end(content, 'utf8'); 
            }
    })
});
/* [--------------------------------------------------------------------] */

/*Build server and set to listen to port*/
server.listen(5000);