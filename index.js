var fs = require('fs');
const { Parser } = require('./utils/parser');
const { prepareRecords, insertToDb } = require('./utils/insert-to-db');


var remaining = '';
var input = fs.createReadStream('dump.txt');

const parser = new Parser();

input.on('data', function (data) {
  remaining += data;
  var index = remaining.indexOf('\n');
  while (index > -1) {
    var line = remaining.substring(0, index);
    remaining = remaining.substring(index + 1);
    parser.parsePayload(line);
    index = remaining.indexOf('\n');
  }
});

input.on('end', function () {
  if (remaining.length > 0) {
    parser.parsePayload(remaining);
  }
  const parsedData = parser.result;
  console.log(parsedData);
  const records = prepareRecords(parsedData);
  insertToDb(records);
});

