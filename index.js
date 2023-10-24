var fs = require('fs');
const { parsePayload, getResult } = require('./utils/parser');
const { prepareRecords, insertToDb } = require('./utils/insert-to-db');


var remaining = '';
var input = fs.createReadStream('dump.txt');
input.on('data', function (data) {
  remaining += data;
  var index = remaining.indexOf('\n');
  while (index > -1) {
    var line = remaining.substring(0, index);
    remaining = remaining.substring(index + 1);
    parsePayload(line);
    index = remaining.indexOf('\n');
  }
});

input.on('end', function () {
  if (remaining.length > 0) {
    parsePayload(remaining);
  }
  const parsedData = getResult();
  console.log(parsedData);
  const records = prepareRecords(parsedData);
  insertToDb(records);
});

