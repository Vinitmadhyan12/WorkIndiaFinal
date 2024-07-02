const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_NAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

module.exports = db;
