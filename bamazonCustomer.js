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
            var productTable = new Table({
                head: ["Product Id", "Product Name", "Price"],
                colWidths: [10, 40, 10]
            });
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.log("ITEMS FOR SALE");
                for (var i = 0; i < res.length; i++) {
                    var prodId = res[i].item_id;
                    var prodName = res[i].product_name;
                    var price = res[i].price;
                    productTable.push(
                        [prodId, prodName, price]
                    );
                }
                console.log(productTable.toString());
                buyProduct();
            });
        }

        function buyProduct() {
            inquirer.prompt([{
                name: "product_id",
                message: "Enter the ID of the product you'd like to buy."
            }, {
                name: "quantity",
                message: "How many of the product you selected would you like to buy?"
            }]).then(function (answers) {
                connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [answers.product_id], function (err, res) {
                    if (answers.quantity > res[0].stock_quantity) {
                        console.log("Insufficient quantity!");
                        buyProduct();
                    } else {
                        var newQty = res[0].stock_quantity - answers.quantity;
                        connection.query("SELECT * FROM products WHERE item_id = ?", [answers.product_id], function (err, res) {
                            var prodSelected = res[0].product_name;
                            var price = res[0].price;
                            var prodSales = parseFloat(res[0].product_sales);
                            var department = res[0].department_name;
                            var total = parseFloat(price * answers.quantity);
                            var newProdSales = prodSales + total;
                            connection.query("SELECT total_sales FROM departments WHERE department_name = ?", [department], function (err, res) {
                                var dptSales = parseFloat(res[0].total_sales);
                                var newDptSales = dptSales + total;
                                connection.query("UPDATE departments SET ? WHERE ?", [{
                                    total_sales: newDptSales
                                }, {
                                    department_name: department
                                }], function (err, res) {
                                    if (err) throw err;
                                });
                            });
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: newQty,
                                product_sales: newProdSales
                            }, {
                                item_id: answers.product_id
                            }], function (err, res) {
                                if (err) throw err;
                                console.log("\nSuccess, you've purchased " + answers.quantity + " of " + prodSelected + " for the price of $" + total + ".\n");
                                initialize();
                            });
                        });
                    }
                });
            });
        }
    }
}