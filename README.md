# k6-script-from-har

Dead simple k6 test generator.  
Given a har file, this script scrapes and generates idiomatic k6 test code.  

Create a .har file by opening a browser's network tab, navigate, click `export HAR` button. Or can be combined with tools like `Playwright` to have automated tests generate the .har file.  

Includes `testTemplate.js` and `testCommon.js` as a starting factoring of shared structure. May be modified after install to your liking. Includes example for getting Auth bearer tokens and attaching them to requests.

# Installation
Ensure k6 is [installed](https://grafana.com/docs/k6/latest/set-up/install-k6/)

``` sh
npm install --save-dev k6-script-from-har
```
> note: files `testTemplate.js` and `testCommon.js` will be copied into repository root post install
these should be committed with the repo

# Usage
Given a .har file, run k6-script-from-har with the input har filename and output test filename.  

Example:  
generate the test file from har
``` sh
npx k6-script-from-har createTimeEntryWorkflow.har tests/createTimeEntryWorkflow.js
```

run the test
``` sh
k6 run tests/createTimeEntryWorkflow.js
```

# Har file creation
Manually
- Use a browser, open up dev tools, network tab
- Navigate and perform actions for workflow test
- Export har [documentation: chrome export har](https://developer.chrome.com/docs/devtools/network/reference/#export)

Playwright
- Given a playwright workflow test
- Toggle on `recordHAR` on browser object at start of test [documentation: playwright record har](https://playwright.dev/docs/mock#recording-a-har-file)
- This file can be piped into this script and keep your performance tests up-to-date with the workflow covered by the automated test.


# Advanced usage
`testCommon.js` will fetch an Authorization Bearer token, and attach the header automatically on all `httpRequest` if the environment variable `AT_AUTH_URL`  is set.  
note: to set an environment variable in a command prompt wrap the command with double quotes if the value includes & characters.  
e.g. `set "AT_AUTH_URL=https://your.auth.url/oauth2/v2.0/token?username=myUserName&password=myPassword&etc_etc_etc"`

the following variables are also available
* `AT_VU_COUNT` - defaults to 15
* `AT_ITERATIONS` - defaults to AT_VU_COUNT * 3
*  k6 reference details [here](https://grafana.com/docs/k6/latest/using-k6/k6-options/how-to/#where-to-set-options)
by default the testTemplate defines options to run a constant number of VUs a given number of iterations. More executor details (here)[https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/]

`testTemplate.js` and `testCommon.js` are used by the script.  
These files can be modified for your specific purposes e.g. hardcoded auth information, set the default iterations, etc.
