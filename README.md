# k6-script-from-har

Dead simple k6 test generator.  
Given a har file, this script scrapes and generates idiomatic k6 test code.  

Create a .har file by opening a browser's network tab, navigate, click `export HAR` button. Or can be combined with tools like `Playwright` to have automated tests generate the .har file.  

Includes `testTemplate.js` and `testCommon.js` as a starting factoring of shared structure. May be modified after install to your liking. Includes example for getting Auth bearer tokens and attaching them to requests.

## Installation
Ensure k6 is [installed](https://grafana.com/docs/k6/latest/set-up/install-k6/)

``` sh
npm install --save-dev k6-script-from-har
```
> note: files `testTemplate.js` and `testCommon.js` will be copied into repository root post install
these should be committed with the repo

## Usage
Given a .har file, run k6-script-from-har with the input har filename and output test filename.  
> note: we recommend filtering out *.har files in `.gitignore`
> har files can include secrets, and are very large

Example:  
generate the test file from har
``` sh
npx k6-script-from-har createTimeEntryWorkflow.har tests/createTimeEntryWorkflow.js
```

run the test
``` sh
k6 run tests/createTimeEntryWorkflow.js
```

## Har file creation
Manually
- Use a browser, open up dev tools, network tab
- Navigate and perform actions for workflow test
- Export har [documentation: chrome export har](https://developer.chrome.com/docs/devtools/network/reference/#export)

Playwright
- Given a playwright workflow test
- Toggle on `recordHAR` on browser object at start of test [documentation: playwright record har](https://playwright.dev/docs/mock#recording-a-har-file)
- This file can be piped into this script and keep your performance tests up-to-date with the workflow covered by the automated test.


## Advanced usage
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

## Additional notes
The included testCommon.js and testTemplate.js files include helpers and reasonable defaults for problems we initially ran into when we started using k6 to performance test our single page app.

`testTemplate.js`
* includes an `options` block with a default of a fixed number of concurrent users (VUs) and a fixed number of iterations (per VU).
    * This was a good fit for us since our workflows were long running (10+ seconds), and we try testing our infrastructure with different fixed numbers of users, and ensure the infrastructure didn't fail or slow down terribly in any spots.
    * We used a fixed number of iterations (per VU) since the average times were skewed lower when iterations were forcably exited because they took beyond the grace period.
    * Review the contents of testTemplate.js for more details


`testCommon.js`
* includes `commonSetup` helper that delegates to `_ensureLoggedIn(url)`
    * `_ensureLoggedIn` makes a single call and expects the response to be an oauth token response, it saves the access_token to `state`. `state` is used by `httpRequest` to add an Authorization Bearer token when present.
    * `httpRequest` adds checks to each call that it return successfully (status >= 200 && status < 400) and timing < 10s
        * without these checks the performance tests could appear to succeed even though individual calls were beginning to fail, or take a long time.
    * Review the contents of testCommon.js for more details

