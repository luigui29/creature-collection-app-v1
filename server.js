/* Step by Step */
/* TODO: Document in README.md */

/* [--------------------DATABASE CONNECTION-------------------------] */
/*Get SQLITE3 module and connect to the database inside project*/
const { DatabaseSync } = require('node:sqlite');
let db;

try {
    db = new DatabaseSync('db/creatures_test_2.sqlite');
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
    + __dirname is a global variable in Node that gives the directory of server.js
      We'll "join" the fetched urls from client-side into our directory's structure
    + First URL will return index.html. Every other one returns respective path.
      Afterwards, join with directory's structure, then assign Content-Type based on
      MimeTypes module.
*/
const public = path.join(__dirname, 'public');

const server = http.createServer((request, response) => { // -- Initiate Server
    
    let requestedPath = request.url === '/' ? 'index.html' : request.url;
    //console.log(request.url);
    let filePath = path.join(public, requestedPath);
    
    const extname = path.extname(filePath).toLowerCase();
    const content_type = mt[extname]; //TODO: set default

    /* [--------------------API ENDPOINTS-------------------------] */
    if (request.url === '/api/creatures') { // -- Send all creature data
        try {
            const creatures = db.prepare('SELECT * FROM creatures ORDER BY id ASC').all();
            response.writeHead(200, { 'Content-Type' : 'application/json' });
            response.end(JSON.stringify(creatures));
        } catch (error) {
            console.error('Database query failed :C ', error);
            response.writeHead(500, { 'Content-Type' : 'text/plain' });
            response.end('Internal Server Error: Could not query the database.');
        } 
    } else
    if (request.url === '/api/creatures/info') { // -- Send creature type
        try {
            let query = `
                SELECT
                    creatures.id AS creature_id,
                    creatures.name AS creature_name,
                    creatures.desc AS creature_desc,
                    creatures.weight,
                    types.id AS type_id,
                    types.name AS type_name,
                    types.category AS type_category,
                    types.ico AS type_ico
                FROM
                    creatures
                JOIN
                    creature_types ON creatures.id = creature_types.creature_id
                JOIN
                    types ON creature_types.type_id = types.id
                ORDER BY
                    creatures.id
            `;
            const queried_results = db.prepare(query).all();
            
            // -- Transforming queried_results into valid output -- //
            const creatures_info_map = {}; 

            queried_results.forEach(row => {                      // The query returns an entry for the same creature
                if (!creatures_info_map[row.creature_id]) {       // up to three times depending on its different types
                    creatures_info_map[row.creature_id] = {       // so we have to make sure we get the basic info for
                        id: row.creature_id,                      // each creature once to avoid "repeated rows" in our
                        name: row.creature_name,                  // desired JSON.
                        description: row.creature_desc,
                        weight: row.weight,
                        types: []
                    };
                }

                creatures_info_map[row.creature_id].types.push({  // Each row of the query returns new type info so
                    id: row.type_id,                              // we'll always push this info to the array of types
                    name: row.type_name,                          // above. 
                    category: row.type_category,        
                    icon: row.type_ico
                });
            });

            const creatures_info = Object.values(creatures_info_map);
            // -- Finished reading array with desired structure -- //

            response.writeHead(200, { 'Content-Type' : 'application/json' });
            response.end(JSON.stringify(creatures_info));

        } catch (error) {
            console.error('Database query failed :C ', error);
            response.writeHead(500, { 'Content-Type' : 'text/plain' });
            response.end('Internal Server Error: Could not query the database.');
        } 
    } else {
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
                response.writeHead(200, {'Content-Type' : content_type});
                response.end(content, 'utf8'); 
            }
        })   
    } 
});

/*Build server and set to listen to port*/
server.listen(5000);