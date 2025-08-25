/*
Create a map of Multipurpose Internet Mail Extensions (MIME) types
to later reference in responses (Content-Type) from the server
con: types must be added manually according to webpage needs _(:S ")
*/

const MIMETYPES = {
    '.html' : 'text/html',
    '.css'  : 'text/css',
    '.js'   : 'text/javascript',
    '.json' : 'application/json',
    '.png'  : 'image/png',
    '.jpg'  : 'image/jpeg',
    '.jpeg' : 'image/jpeg',
    '.gif'  : 'image/gif'
};

module.exports = MIMETYPES;