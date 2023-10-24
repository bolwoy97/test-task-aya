const sqlite3 = require('sqlite3').verbose();
const { dbName } = require('../utils/constants');

let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.exec(
  `CREATE TABLE employees
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      surname VARCHAR(50) NOT NULL,
      department_id INTEGER NOT NULL
    );
    
    CREATE TABLE departments
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL
    );

    CREATE TABLE salaries
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount FLOAT NOT NULL,
      date VARCHAR(50) NOT NULL,
      employee_id INTEGER NOT NULL
    );

    CREATE TABLE donations
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount FLOAT NOT NULL,
      date VARCHAR(50) NOT NULL,
      employee_id INTEGER NOT NULL
    );
    `
);


db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
