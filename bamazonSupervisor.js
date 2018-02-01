var mysql = require('mysql');
var inquirer = require('inquirer');
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
    console.log("You are connected as " + connection.thredId);
    main();
});

function main() {
    inquirer.prompt([{
        type: 'list',
        message: 'Please choose from the following options',
        choices: ["View Product Sales by Department", "Create New Department", "EXIT"],
        name: 'command'
    }]).then(function(user) {
        if (user.command == "View Product Sales by Department") {
            connection.query("SELECT *, total_sales - over_head_cost AS total_profit FROM departments", function(err, rows) {
                if (err) throw err;
                console.log("==================================================================");
                console.log(columnify(rows, { columnSplitter: ' || ' }));
                console.log("==================================================================");
                main();
            });
        } else if (user.command == "Create New Department") {
            inquirer.prompt([{
                type: 'input',
                message: 'Please type the name of new department',
                name: 'name'
            }, {
                message: 'What is the over_head_cost of the new department',
                name: 'over_head_cost'
            }]).then(function(user) {
                connection.query("INSERT INTO departments SET ?", { department_name: user.name, over_head_cost: user.over_head_cost });
                main();
            })
        } else if (user.command =="EXIT"){
        	connection.end();
        	process.exit();
        }
    })
}
