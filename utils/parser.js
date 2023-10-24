class Parser {
  constructor() {
    this.current = {
      employee: null,
      department: null,
      salaries: null,
      statement: null,
      donation: null,
      rate: null
    }
    this.propName = '';
    this.result = { employees: [], rates: [] };
  }


  parsePayload (payload) {
    const lines = payload.split('\n');
    for (const line of lines) {
      if (line.trim() === '') {
        continue;
      }
  
      const [property, value] = line.trim().split(':').map((s) => s.trim());
  
      switch (property) {
        case 'Employee':
          this.propName = 'employee';
          this.current.employee = {};
          this.result.employees.push(this.current.employee);
          break;
        case 'Department':
          this.propName = 'department';
          this.current.department = {};
          this.current.employee.department = this.current.department;
          break;
        case 'Salary':
          this.current.salaries = [];
          if (!this.current.employee.salaries) {
            this.current.employee.salaries = [];
          }
          this.current.employee.salaries = this.current.salaries;
          break;
        case 'Statement':
          this.propName = 'statement';
          this.current.statement = {};
          this.current.salaries.push(this.current.statement);
          break;
        case 'Donation':
          this.propName = 'donation';
          if (!this.current.employee.donations) {
            this.current.employee.donations = [];
          }
          this.current.donation = {};
          this.current.employee.donations.push(this.current.donation);
          break;
        case 'Rate':
          this.propName = 'rate';
          if (!this.result.rates) {
            this.result.rates = [];
          }
          this.current.rate = {};
          this.result.rates.push(this.current.rate);
          break;
        case 'id':
          this.current[this.propName].id = value;
          break;
        case 'name':
          this.current[this.propName].name = value;
          break;
        case 'surname':
          this.current[this.propName].surname = value;
          break;
        case 'amount':
          if(this.propName == 'donation'){
            const [ ammount, currency ] = value.split(' ');
            this.current[this.propName].amount = parseFloat(ammount);
            this.current[this.propName].currency = currency;
          } else {
            this.current[this.propName].amount = parseFloat(value);
          }
          break;
        case 'date':
          this.current[this.propName].date = value;
          break;
        case 'sign':
          this.current[this.propName].sign = value;
          break;
        case 'value':
          this.current[this.propName].value = parseFloat(value);
          break;
        default:
          break;
      }
    }
  }
}

module.exports = {
  Parser
}
