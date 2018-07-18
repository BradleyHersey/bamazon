module.exports = {
    test: function test() {
        var mysql = require("mysql");
        var inquirer = require("inquirer");
        var Table = require("cli-table");

        var connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "root",
            database: "bamazon_db"
        });

        connection.connect(function (err) {
            if (err) throw err;
        });

        initialize();

        function initialize() {
            inquirer.prompt([{
                name: "action",
                message: "Select an action.",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }]).then(function (answers) {
                if (answers.action === "View Products for Sale") {
                    viewProd();
                } else if (answers.action === "View Low Inventory") {
                    viewLow();
                } else if (answers.action === "Add to Inventory") {
                    var products = [];
                    connection.query("SELECT product_name FROM products", function (err, res) {
                        for (h = 0; h < res.length; h++) {
                            products.push(res[h].product_name);
                        }
                        addInv(products);
                    });
                } else if (answers.action === "Add New Product") {
                    addProd();
                }
            });
        }

        function viewProd() {
            var productTable = new Table({
                head: ["Id", "Product Name", "Price", "Qty.", "Dept."],
                colWidths: [5, 35, 10, 10, 20]
            });
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.log("ALL PRODUCTS");
                for (var i = 0; i < res.length; i++) {
                    var prodId = res[i].item_id;
                    var prodName = res[i].product_name;
                    var price = res[i].price;
                    var stock = res[i].stock_quantity;
                    var sales = res[i].department_name;
                    productTable.push(
                        [prodId, prodName, price, stock, sales]
                    );
                }
                console.log(productTable.toString());
                initialize();
            });
        }

        function viewLow() {
            var lowInvTable = new Table({
                head: ["Id", "Product Name", "Qty."],
                colWidths: [5, 35, 10]
            });
            connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5], function (err, res) {
                if (err) throw err;
                if (res.length > 0) {
                    console.log("\nLOW INVENTORY");
                    for (var j = 0; j < res.length; j++) {
                        var prodId = res[j].item_id;
                        var prodName = res[j].product_name;
                        var qty = res[j].stock_quantity; // push column data into table for each product
                        lowInvTable.push(
                            [prodId, prodName, qty]
                        );
                    }
                    console.log(lowInvTable.toString());
                } else {
                    console.log("\nThere are no low inventory items!\n");
                }
                initialize();
            });
        }

        function addInv(array) {
            // ask user info to add inventory
            inquirer.prompt([{
                name: "item",
                message: "Which item would you like to add inventory to?",
                type: "list",
                choices: array
            }, {
                name: "amount",
                message: "How many more units would you like to add?"
            }]).then(function (answers) {
                // select the stock qty from products for product user specified above
                connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", [answers.item], function (err, res) {
                    // add previous amount and amount being added
                    var stockQty = parseInt(answers.amount) + parseInt(res[0].stock_quantity);
                    // update table with new stock quantity
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: stockQty
                    }, {
                        product_name: answers.item
                    }], function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            // let user know the stock quantity has been updated
                            console.log("The inventory for " + answers.item + " is now " + stockQty + " units.\n");
                        }
                        //re-initialize app
                        initialize();
                    });
                });
            });
        }

        function addProd() {
            connection.query("SELECT department_name FROM departments", function (err, res) {
                var departments = [];
                for (var k = 0; k < res.length; k++) {
                    departments.push(res[k].department_name);
                }
                // ask user info about new product
                inquirer.prompt([{
                    name: "product",
                    message: "Enter name of product you would like to add."
                }, {
                    name: "price",
                    message: "Enter price of product to be added."
                }, {
                    name: "quantity",
                    message: "Enter quantity of product to be added."
                }, {
                    name: "department",
                    message: "Select the department of product to be added.",
                    type: "list",
                    choices: departments
                }]).then(function (answers) {
                    // product info variables
                    var product = answers.product;
                    var price = answers.price;
                    var quantity = answers.quantity;
                    var department = answers.department;
                    // make sure user wants to add their product
                    inquirer.prompt([{
                        name: "validation",
                        message: "Are you sure you want to add " + answers.product + " to the store?",
                        type: "list",
                        choices: ["Yes", "No"]
                    }]).then(function (answers) {
                        // if yes, insert product and info into products table
                        if (answers.validation === "Yes") {
                            connection.query("INSERT INTO products SET ?", {
                                product_name: product,
                                price: price,
                                department_name: department,
                                stock_quantity: quantity,
                                product_sales: 0.00
                            }, function (err, res) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log("\nYour item has been added.\n");
                                    //re-initialize app
                                    initialize();
                                }
                            });
                            // if no, let user know product has not been added
                        } else {
                            console.log("\nYour item has not been added.\n");
                            //re-initialize app
                            initialize();
                        }
                    });
                });
            });
        }
    }
}