/* const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "punch",
  // connectionLimit: 10, // Adjust the limit based on your requirements
});
module.exports = pool; */


const mysql = require("mysql2/promise"); // Use the promise-based version

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "punch",
  // connectionLimit: 10, // Adjust the limit based on your requirements
});

module.exports = pool;
