#!/usr/bin/env node

var fsSync = require('fs');
var path = require('path');

var args = process.argv.slice(2);
if (args[0] == undefined) console.error('usage: k6scriptfromhar <har_filename> <output_filename>');
if (args[0] == undefined) {
  console.error('must include har filename as argument');
  return 1;
}

if (args[1] == undefined) {
  console.error('must include output filename as 2nd argument');
  return 2;
}

var har = JSON.parse(fsSync.readFileSync(args[0]));

var allRequests = har.log.entries
.filter(e => e._resourceType === 'fetch')
.map(e => e.request);

const k6TestCodeLines = allRequests.map(r => `httpRequest('${r.method}', '${r.url}'${(!r.postData ? '' : `, ${JSON.stringify(r.postData.text)}, { headers: {'Content-Type': '${r.postData.mimeType}'} }`)});`);
const testBody = k6TestCodeLines.join('\n\t');

var testTemplate = fsSync.readFileSync("./testTemplate.js", {encoding: 'utf8'});
const testScript = testTemplate.replace('${testBody}', testBody);

fsSync.writeFileSync(args[1], testScript);