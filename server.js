const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('db/creatures_test_2.sq3');

try {
    let test = db.prepare('SELECT * FROM creatures').all();
    console.log(test);
} catch (error) {
    console.log('ERROR: Couldnt connect, I think.');
}