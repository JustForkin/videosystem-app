var initOptions = {
  // db initialization options
};
var pgp = require('pg-promise')(initOptions);
var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'videosystemdb',
    user: 'postgres',
    password: '123'
};
var db = pgp(cn); // database instance;

console.log('database connection: OK');

// Exporting the database object for shared use:
module.exports = db;
