var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require("columnify");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123abc123",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("you are connected as: " + connection.threadId);
    command();
})

function command() {
    inquirer.prompt([{
        type: 'list',
        message: "Please choose from the following options",
        choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Remove Product", "EXIT"],
        name: "command"
    }]).then(function(user) {
        switch (user.command) {
            case "View Products For Sale":
                viewproducts();
                break;
            case "View Low Inventory":
                lowinventory();
                break;
            case "Add to Inventory":
                restock();
                break;
            case "Add New Product":
                newproduct();
                break;
            case "Remove Product":
                removeproduct();
                break;
            case "EXIT":
                exit();
                break;
        }
    });
};

function viewproducts() {
    connection.query("SELECT * FROM products", function(err, rows) {
        if (err) throw err;
        console.log("=================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=================================================================================");
        command();
    })
};

function lowinventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?", [0, 101], function(err, rows) {
        if (err) throw err;
        console.log("=================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=================================================================================");
        command();
    })
};

function restock() {
    connection.query("SELECT * FROM products", function(err, rows) {
        if (err) throw err;
        console.log("=================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=================================================================================");
        var productArray = [];
        for (var i = 0, n = rows.length; i < n; i++) {
            productArray.push(rows[i].product_name);
        }
        inquirer.prompt([{
            type: 'list',
            message: "Please select the item you wish to restock",
            choices: productArray,
            name: "product"
        }, {
            type: 'input',
            message: "How many units of item would you like to add?",
            name: 'add',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(user) {
            connection.query("SELECT * FROM products WHERE ?", { product_name: user.product }, function(err, rows) {
                var updatestock = rows[0].stock_quantity + parseInt(user.add);
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updatestock }, { product_name: user.product }])
                command();
            })
        });
    });
};

function newproduct() {
    connection.query("SELECT * FROM products", function(err, rows) {
        if (err) throw err;
        console.log("=================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=================================================================================");

        inquirer.prompt([{
            message: "Please enter the name of product?",
            name: "product_name"
        }, {
            message: "Please enter the department",
            name: "department_name"
        }, {
            message: "How much is the product?",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            message: "How many would you like to add?",
            name: "stock_quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function(user) {
            connection.query("INSERT INTO products SET ?", {
                product_name: user.product_name,
                department_name: user.department_name,
                price: user.price,
                stock_quantity: user.stock_quantity,
                product_sales: 0
            })
            command();
        })
    });
};

function removeproduct() {
    connection.query("SELECT * FROM products", function(err, rows) {
        if (err) throw err;
        var productArray = [];
        for (var i = 0, n = rows.length; i < n; i++) {
            productArray.push(rows[i].product_name);
        }
        console.log("=================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=================================================================================");
        inquirer.prompt([{
            type: 'list',
            message: 'Select the product you wish to remove',
            choices: productArray,
            name: 'remove'
        }]).then(function(user) {
            connection.query("DELETE FROM products WHERE ?", { product_name: user.remove });
            command();
        })
    })

}

function exit() {
    connection.end();
    process.exit();
}
