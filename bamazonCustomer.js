var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123abc123",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    purchase();
});

function purchase() {
    connection.query("SELECT * FROM products", function(err, rows) {
        if (err) throw err;
        console.log("=====================================================================================");
        console.log(columnify(rows, { columnSplitter: ' || ' }));
        console.log("=====================================================================================");
        var productArray = ['EXIT'];
        for (var i = 0, n = rows.length; i < n; i++) {
            productArray.unshift(rows[i].product_name);
        }
        inquirer.prompt([{
            type: 'list',
            message: "Please select the name of item you wish purchase",
            choices: productArray,
            name: 'id'
        }, {
            message: "How many units of product would you like to buy?",
            name: 'buy',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(user) {
            if (user.id == "EXIT") {
                exit();
            } else {
                connection.query("SELECT * FROM products WHERE ?", { product_name: user.id }, function(err, rows) {
                    if (err) throw err;
                    if (rows[0].stock_quantity >= user.buy) {
                        console.log(typeof user.buy);
                        //remaining stock
                        var remain_stock = rows[0].stock_quantity - user.buy;
                        connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: remain_stock }, { product_name: user.id }])
                            //the total cost of their purchase.
                        var product_sales = (rows[0].price * user.buy).toFixed(2);
                        connection.query("UPDATE products SET product_sales= product_sales + " + product_sales + " WHERE ?", { product_name: user.id })
                        console.log("$" + rows[0].price * user.buy);
                        console.log(rows[0].department_name);
                        //product_sales will combine with the same department and update to the departments table
                        connection.query("SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name", function(err, rows) {
                            console.log(rows);
                            for (var i = 0, n = rows.length; i < n; i++) {
                                //update the retrieved total_sales by the department to the department table
                                connection.query("UPDATE departments SET ? WHERE ?", [{ total_sales: rows[i].total_sales }, { department_name: rows[i].department_name }])
                            }
                        })
                        purchase();
                    } else {
                        console.log("Insufficient quantity!!!")
                        purchase();
                    }
                });
            }
        });
    });
};

function exit() {
    connection.end();
    process.exit();
}
