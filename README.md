# k6-script-from-har

Dead simple k6 test generator.  
Given a har file, this script scrapes and generates idiomatic k6 test code.  

Create a .har file by opening a browser's network tab, navigate, click `export HAR` button. Or can be combined with tools like `Playwright` to have automated tests generate the .har file.  

Includes `testTemplate.js` and `testCommon.js` as a starting factoring of shared structure. May be modified after install to your liking. Includes example for getting Auth bearer tokens and attaching them to requests.

# Installation
``` sh
npm install --save-dev k6-script-from-har
```

# Usage
TODO: Brief explanation how to use it.

# Initialization
TODO: Describe the configuration and steps to use it.

# Log output
TODO: Add example of the results.

# Advanced usage
TODO: Describe and show how to build your code and run the tests.
