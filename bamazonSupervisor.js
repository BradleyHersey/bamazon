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
                choices: ["View Product Sales by Department", "Create New Department"]
            }]).then(function (answers) {
                if (answers.action === "View Product Sales by Department") {
                    viewDptSales();
                } else {
                    createDpt();
                }
            });
        }

        function viewDptSales() {
            var salesTable = new Table({
                head: ["Id", "Department Name", "Overhead", "Total Sales", "Total Profit"],
                colWidths: [5, 20, 15, 15, 15]
            });
            connection.query("SELECT * FROM departments", function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    var deptId = res[i].department_id;
                    var deptName = res[i].department_name;
                    var overhead = res[i].over_head_costs;
                    var totalSales = res[i].total_sales;
                    var totalProfit = (Math.round((totalSales - overhead) * 100)) / 100;
                    salesTable.push(
                        [deptId, deptName, overhead, totalSales, totalProfit]
                    );
                }
                console.log(salesTable.toString());
                initialize();
            });
        }

        function createDpt() {
            inquirer.prompt([{
                name: "departmentName",
                message: "Enter name of department."
            }, {
                name: "overheadCosts",
                message: "Enter overhead costs of department."
            }]).then(function (answers) {
                var dptName = answers.departmentName;
                var overheadC = answers.overheadCosts;
                inquirer.prompt([{
                    name: "validation",
                    message: "Are you sure you want to add " + dptName + " to the store?",
                    type: "list",
                    choices: ["Yes", "No"]
                }]).then(function (answers) {
                    if (answers.validation === "Yes") {
                        connection.query("INSERT INTO departments SET ?", {
                            department_name: dptName,
                            over_head_costs: overheadC,
                            total_sales: 0.00
                        }, function (err, res) {
                            if (err) throw err;
                            console.log("\nThe department " + dptName + " has been added.\n");
                            initialize();
                        });
                    } else {
                        console.log("\nThe department " + dptName + " has not been added.\n");
                        initialize();
                    }
                });
            });
        }
    }
}