CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products(
	id INTEGER AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
	price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("laptop", "electronics", 500, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("TV", "electronics", 300, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("radio", "electronics", 20, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("socks", "clothing", 2, 5000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("shirts", "clothing", 10, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("jeans", "clothing", 25, 600);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("banana", "food", 1, 10000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("ramen", "food", 3, 5000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("coke", "food", 1, 10000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE("ice cream", "food", 5, 5000);

SELECT * FROM products;
UPDATE products SET total_sales=10 WHERE id>0;
SELECT * FROM products WHERE stock_quantity<101;

ALTER TABLE products ADD total_sales INTEGER;
ALTER TABLE products CHANGE total_sales product_sales INT;