var mysql = require("mysql");
var inquirer = require("inquirer");
var manager = require("./bamazonManager.js");
var supervior = require("./bamazonSupervisor.js");
var Customer = require("./bamazonCustomer.js");
var Table = require("cli-table");
var line = ("\n==========================\n");
require('console.table')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});



connection.connect(function (err) {
    if (err) throw err;
    role();
});

function initialize() {
    // create new table
    var productTable = new Table({
        head: ["Product Id", "Product Name", "Price"],
        colWidths: [10, 40, 10]
    });
    // selects all data from products table
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // logs info (ID, product, price) about all items for sale
        console.log("ITEMS FOR SALE");
        for (var i = 0; i < res.length; i++) {
            // variables to store column data
            var prodId = res[i].item_id;
            var prodName = res[i].product_name;
            var price = res[i].price;
            // push column data into table for each product
            productTable.push(
                [prodId, prodName, price]
            );
        }
        // print table to console
        console.log(productTable.toString());
        // runs function to purchase items
        buyProduct();
    });
}


function role() {
    var inquirer = require('inquirer');
    inquirer.prompt([{
        type: "list",
        name: "name",
        message: "Please choose one .",
        choices: ["Buyer", "Manager", "Supervisor"]
    }]).then(function (answers) {
        switch (answers.name) {
            case "Buyer":
                // showItems();
                Customer.test();
                console.log(line);
                connection.end();

                break;
            case "Manager":
                manager.test();
                console.log(line);
                connection.end();
                break;
            case "Supervisor":
                supervior.test();
                console.log(line);
                connection.end();
                break;
        }

    });
};






function showItems() {
    connection.query('SELECT * FROM products', function (err, res) {
        //HARD WAY for ...""ITEM:" + res.name + ..
        console.table(res);

    })
}