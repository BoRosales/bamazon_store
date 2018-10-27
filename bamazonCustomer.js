let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");
// Where we connect to mysql database
// ==============================================================================
let connection = mysql.createConnection({
  host: "localhost",
  post: 3306,
  user: "root",

  // My credentials and information
  password: "Kimbo!2012",
  database: "bamazon"
});

// Show that connection is successful / opens connection to SQL
// ===============================================================================
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

// Post successful conncection console log items from table in MYSQL
// =================================================================================
function afterConnection() {
  connection.query("SELECT * FROM products", function(err, rows) {
    if (err) throw err;
    // CLI table starts here
    let table = new Table({
      head: ["Item ID", "Product", "Department", "Price", "Stock"],
      colWidths: [10, 45, 20, 10, 10]
    });
    // Loops through rows that are being passed thru from querying SQL
    for (let i = 0; i < rows.length; i++) {
      table.push([
        rows[i].item_id,
        rows[i].product_name,
        rows[i].department_name,
        rows[i].price,
        rows[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    start();
  });
}

// ==============================================================================
function start() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // This is where inquirer gets started
    inquirer
      .prompt([
        {
          name: "whichItem",
          type: "input",
          message: "What item would you like to purchase? Please enter their ID #.",
          validate: function(val) {
            if (isNaN(val) === false) {
              return true;
            } else {
              console.log("Make sure that you're entering a valid number(s).");
              return false;
            }
          }
        },
        {
          name: "quanitity",
          type: "input",
          message: "How many would you like to purchase?",
          validate: function(val) {
            if (isNaN(val) === false) {
              return true;
            } else {
              console.log("Make sure that you're entering a valid number(s)");
              return false;
            }
          }
        }
      ])
      .then(function(choices) {
        let itemId = choices.whichItem;
        let quantity = choices.quantity;
        connection.query("SELECT * FROM products WHERE ?", { item_id: itemId }, function(err, results) {
            if (err) throw err;
            console.log(choices);
            console.log(results);
            if (results[0].stock_quantity >= quantity) {
              connection.query("UPDATE products SET ? WHERE ?",
                [
                  {stock_quantity: results[0].stock_quantity - quantity
                  },
                  {
                    item_id: itemId
                  }
                ],
                function(err) {
                  if (err) throw err;
                  console.log(`Your order was successful. Thank you for purchasing ${choiceArray}`);
                }
              );
            } else {
              console.log("Insufficient Quantity!");
            }
            connection.end();
          }
        );
      });
  });
}
