CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
    item_id INTEGER (10)
    AUTO_INCREMENT NOT NULL,
	product_name VARCHAR
    (250) NOT NULL,
	department_name VARCHAR
    (250),
	price DECIMAL
    (10,2) NOT NULL,
	stock_quantity INTEGER
    (10) NOT NULL,
	product_sales DECIMAL
    (10,2) DEFAULT 0.00,
	PRIMARY KEY
    (item_id)
);

    INSERT INTO products
    INSERT INTO products
        (product_name, department_name, price, stock_quantity, product_sales)
    VALUES
        ("Big Pens (pkg. of 100)", "Office Supplies", "9.00", "50", "0.00"),
        ("Table", "Household Items", "100.00", "100", "0.00"),
        ("Power Rangers", "Toys and Games", "12.00", "25", "0.00"),
        ("Frozen meals (pkg. of 50 assorted meals)", "Groceries", "200.00", "1000", "0.00"),
        ("70inch SumSung TV", "Household Items", "3000.00", "14", "0.00"),
        ("Pitch Perfect", "Media", "19.99", "87", "0.00"),
        (" K-Cups (pkg. of 20)", "Groceries", "7.50", "111", "0.00"),
        ("Black Sharpie", "Office Supplies", "2.50", "200", "0.00"),
        ("JOJO's", "Toys and Games", "13.50", "26", "0.00"),
        ("End Table", "Household Items", "139.99", "19", "0.00");
    CREATE TABLE departments
    (
        department_id INTEGER (10)
        AUTO_INCREMENT NOT NULL,
	department_name VARCHAR
        (250) NOT NULL,
	over_head_costs DECIMAL
        (10,2) NOT NULL,
	total_sales DECIMAL
        (10,2),
	PRIMARY KEY
        (department_id)
);

        INSERT INTO departments
            (department_name, over_head_costs, total_sales)
        VALUES
            ("Office Supplies", "100.50", "0.00"),
            ("Household Items", "60.00", "0.00"),
            ("Toys and Games", "50.00", "0.00"),
            ("Groceries", "80.00", "0.00"),
            ("Media", "66.00", "0.00");