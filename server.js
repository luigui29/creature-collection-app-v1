/* Step by Step */
/* TODO: Document in README.md */

/*Get SQLITE3 module and connect to the database inside project*/
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('db/creatures_test_2.sq3');

/*Get HTTP module for server connections*/
const http = require('http');

/*Get FS module for helping script find html + other files*/
const fs = require('fs');

/*Get PATH module to combine request url to directory paths*/
const path = require('path');

/*Create a map of Multipurpose Internet Mail Extensions (MIME) types*/
/*to later reference in responses (Content-Type) from the server*/
/*con: types must be added manually according to webpage needs _(:S ")*/
const mimeTypes = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript',
    '.json' : 'application/json',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.jpeg' : 'image/jpeg',
    '.gif' : 'image/gif'
};

/*Establish the server*/
const server = http.createServer((request, response) => {
    /*[HANDLING ALL URLs]*/
    /*First URL will return index.html. Every other one returns respective path*/
    /*___dirname is a global variable in Node that gives the path of server.js*/
    let requestedPath = request.url === '/' ? '/index.html' : request.url;
    
    const filePath = path.join(__dirname, 'public', requestedPath);
    /*Let's look up the file's extension name*/
    /*Afterwards assign respective Content-Type according to MIME type*/
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname]; //TODO: set default

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

/*Build server and set to listen to port*/
server.listen(3000);