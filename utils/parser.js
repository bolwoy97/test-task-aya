const current = {
  employee: null,
  department: null,
  salaries: null,
  statement: null,
  donation: null,
  rate: null
}
let propName;

const result = { employees: [], rates: [] };

module.exports.getResult = function () {
  return result;
}

module.exports.parsePayload = function (payload) {
  
  const lines = payload.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      continue;
    }

    const [property, value] = line.trim().split(':').map((s) => s.trim());

    switch (property) {
      case 'Employee':
        propName = 'employee';
        current.employee = {};
        result.employees.push(current.employee);
        break;
      case 'Department':
        propName = 'department';
        current.department = {};
        current.employee.department = current.department;
        break;
      case 'Salary':
        current.salaries = [];
        if (!current.employee.salaries) {
          current.employee.salaries = [];
        }
        current.employee.salaries = current.salaries;
        break;
      case 'Statement':
        propName = 'statement';
        current.statement = {};
        current.salaries.push(current.statement);
        break;
      case 'Donation':
        propName = 'donation';
        if (!current.employee.donations) {
          current.employee.donations = [];
        }
        current.donation = {};
        current.employee.donations.push(current.donation);
        break;
      case 'Rate':
        propName = 'rate';
        if (!result.rates) {
          result.rates = [];
        }
        current.rate = {};
        result.rates.push(current.rate);
        break;
      case 'id':
        current[propName].id = value;
        break;
      case 'name':
        current[propName].name = value;
        break;
      case 'surname':
        current[propName].surname = value;
        break;
      case 'amount':
        if(propName == 'donation'){
          const [ ammount, currency ] = value.split(' ');
          current[propName].amount = parseFloat(ammount);
          current[propName].currency = currency;
        } else {
          current[propName].amount = parseFloat(value);
        }
        break;
      case 'date':
        current[propName].date = value;
        break;
      case 'sign':
        current[propName].sign = value;
        break;
      case 'value':
        current[propName].value = parseFloat(value);
        break;
      default:
        break;
    }
  }

  return result;
}


const textPayload = `
Employee
  id: 45287
  name: Kamron
  surname: Cummerata
  Department
    id: 53694
    name: Kids
  Salary
    Statement
      id: 26519
      amount: 5350.00
      date: Thu Jan 28 2021
    Statement
      id: 67616
      amount: 5564.00
      date: Sun Feb 28 2021
Employee
  id: 72202
  name: Ayla
  surname: Lakin
  Department
    id: 9612
    name: Games
  Salary
    Statement
      id: 95984
      amount: 8400.00
      date: Thu Jan 28 2021
    Statement
      id: 22541
      amount: 8400.00
      date: Sun Feb 28 2021
    Statement
      id: 8929
      amount: 8820.00
      date: Sun Mar 28 2021

  Donation
    id: 55743
    date: Tue Jan 26 2021
    amount: 257.04 GBP

  Donation
    id: 87303
    date: Sat Feb 27 2021
    amount: 402.36 USD
`;

// const parsedData = parsePayload(textPayload);
// console.log(parsedData);
