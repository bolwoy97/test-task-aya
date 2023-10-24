const sqlite3 = require('sqlite3').verbose();


function prepareRecords({employees, rates}) {
  const records = {
    employees: [],
    departments: new Set(),
    salaries: [],
    donations: [],
  }; 

  employees.forEach(employee => {
    const department = employee.department;
    records.employees.push(`(${employee.id}, "${employee.name}", "${employee.surname}", ${department.id})`);
    records.departments.add(`(${department.id}, "${department.name}")`);
    employee.salaries.forEach(salary => {
      records.salaries.push(`(${salary.id}, ${salary.amount.toFixed(2)}, "${salary.date}", ${employee.id})`);
    });
    employee.donations?.forEach(donation => {
      let amount = donation.amount;
      if (donation.currency !== 'USD'){
        const currentRate = rates.find((rate) => rate.date === donation.date && rate.sign === donation.currency);
        amount *= currentRate.value;
      }
      records.donations.push(`(${donation.id}, ${amount.toFixed(2)}, "${donation.date}", ${employee.id})`);
    });
  });

  return {...records, departments: Array.from(records.departments)};
}

function insertToDb(records) {
  let db = new sqlite3.Database('./db/employees.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  const sql = {
    employees: `INSERT INTO employees(id, name, surname, department_id) VALUES ${records.employees.join(', ')}`,
    departments: `INSERT INTO departments(id, name) VALUES ${records.departments.join(', ')}`,
    salaries: `INSERT INTO salaries(id, amount, date, employee_id) VALUES ${records.salaries.join(', ')}`,
    donations: `INSERT INTO donations(id, amount, date, employee_id) VALUES ${records.donations.join(', ')}`,
  }; 

  console.log(sql);
  // employees
  db.run(sql.employees, function (err) {
    if (err) {
      return console.log('employees error: ', err.message);
    }
    console.log(`employees populated, last id: ${this.lastID}`);
  });

  // departments
  db.run(sql.departments, function (err) {
    if (err) {
      return console.log('departments error: ', err.message);
    }
    console.log(`departments populated, last id: ${this.lastID}`);
  });

  // salaries
  db.run(sql.salaries, function (err) {
    if (err) {
      return console.log('salaries error: ', err.message);
    }
    console.log(`salaries populated, last id: ${this.lastID}`);
  });

  // donations
  db.run(sql.donations, function (err) {
    if (err) {
      return console.log('donations error: ', err.message);
    }
    console.log(`donations populated, last id: ${this.lastID}`);
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

module.exports = {
  prepareRecords,
  insertToDb
}
