import http from 'k6/http';
import { check } from 'k6';

let access_token;
export function httpRequest(method, url, body, params = {}) {
    if (access_token) params.headers = Object.assign({ "Authorization": 'Bearer ' + access_token }, params.headers ? params.headers : {});
    if (method === 'POST')
        params.headers = Object.assign({ "Content-Type": "application/json-patch+json", "Accept": "*/*" }, params.headers ? params.headers : {});
        params.timeout = (params.timeout !== undefined ? params.timeout : 600000); //default to 10m timeout instead of 60s implicit default

    const res = http.request(method, url, JSON.stringify(body), params);

    if (!(res.status >= 200 && res.status < 400)) {
        const fileAndLineNumber = new Error().stack.split('\n')[2];
        console.log('\n\n' + fileAndLineNumber + ' ' + res.url);
        console.log({ res });
    }
    const checks = {};
    checks[url + ' status 200-399'] = r => r.status >= 200 && r.status < 400;
    checks[url + ' timing < 10s'] = r => r.timings.duration < 10000;
    check(res, checks);
}

export function ensureLoggedIn(username, password, url) {
    if (access_token) return;

    const res = http.post(url.replace('${username}', username).replace('${password}', password));
    if (!(res.status >= 200 && res.status < 400)){
        console.error(res.status_text);
        throw 'could not log in';
    }

    access_token = (res.json()).access_token;
    console.log('----------- LOG IN SUCESSFUL -----------');
}

export function commonSetup() {
    if (!__ENV.AT_USERNAME) console.warn('environment variable `AT_USERNAME` not specified');
	if (!__ENV.AT_PASSWORD) console.warn('environment variable `AT_PASSWORD` not specified');
	if (!__ENV.AT_AUTH_URL) console.warn('environment variable `AT_AUTH_URL` not specified');
    if (!__ENV.AT_USERNAME || !__ENV.AT_PASSWORD || !__ENV.AT_AUTH_URL) return;
	ensureLoggedIn(__ENV.AT_USERNAME, __ENV.AT_PASSWORD, __ENV.AT_AUTH_URL);
}