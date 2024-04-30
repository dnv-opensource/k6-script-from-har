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

const k6TestCodeLines = allRequests.map(r => `httpRequest('${r.method}','${r.url}'${r.postData ? ', ' + JSON.stringify(JSON.parse(r.postData.text)) : ''});`);
const testBody = k6TestCodeLines.join('\n\t');

var testBase = fsSync.readFileSync("./node_modules/k6scriptfromhar/src/testBase.js", {encoding: 'utf8'});
const testScript = testBase.replace('${testBody}', testBody);

fsSync.writeFileSync(args[1], testScript);
const destPath = path.dirname(args[1]);
if (!fsSync.existsSync(path.join(destPath, 'common.js'))) fsSync.copyFileSync('./node_modules/k6scriptfromhar/src/common.js', path.join(destPath, 'common.js'));