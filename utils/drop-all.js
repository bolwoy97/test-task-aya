const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./db/employees.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.exec(
  `DROP TABLE employees; DROP TABLE departments; DROP TABLE salaries; DROP TABLE donations;`
);


db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
