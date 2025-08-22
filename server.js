/* Step by Step */
/* TODO: Document in README.md */

/*Get SQLITE3 module and connect to the database inside project*/
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('db/creatures_test_2.sq3');

/*Get HTTP module for server connections*/
const http = require('http');

/*Get FS module for helping script find html + other files*/
const fs = require('fs');


/*Establish the server*/
const server = http.createServer((request, response) => {

    if (request.url === '/') { // -- Main URL
        fs.readFile('./public/index.html', 'utf8', (error, fileContent) => {
            if (error) { // -- Index is not in public folder for some reason
                console.log('Error with index file: ');
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Server Error (check console)');
                return; // -- Halt execution when error found
            }

            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(fileContent);
        })
    } else { // -- Requests for other paths
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('404 Not Found! Woopsie Daisies');
    }
});

/*Build server and set to listen to port*/
server.listen(3000);