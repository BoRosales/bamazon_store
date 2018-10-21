var mysql = require("mysql");
var inquirer = require("inquirer");

// Where we connect to mysql database
var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',

    // My credentials and information
    password: 'Kimbo!2012',
    database: 'bamazon'
});

// Show that connection is successful
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

// Post successful conncection console log items from table in MYSQL
function afterConnection() {
    connection.query("SELECT * FROM products", function (err, rows) {
        if (err) throw err;
        console.log(rows);
        connection.end();
    });
}