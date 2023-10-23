var fs = require('fs');
const { parsePayload, getResult } = require('./parser');

var input = fs.createReadStream('dump.txt');
input.on('data', function(data) {
  parsePayload(data.toString());
});

input.on('end', function() {
  console.log(getResult());
});

