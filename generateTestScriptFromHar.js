var fsSync = require('fs');

var args = process.argv.slice(2);
if (args[0] == undefined) {
  console.error('must include har filename as argument');
  return 1;
}

var har = JSON.parse(fsSync.readFileSync(args[0]));

var allRequests = har.log.entries
.filter(e => e._resourceType === 'fetch')
.map(e => e.request);

const k6TestCodeLines = allRequests.map(r => `httpRequest('${r.method}','${r.url}'${r.postData ? ', ' + JSON.stringify(JSON.parse(r.postData.text)) : ''});`);

console.log(k6TestCodeLines.join('\n'));