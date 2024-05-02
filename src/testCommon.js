import http from 'k6/http';
import { check } from 'k6';

export const state = {};
export function httpRequest(method, url, body, params = {}) {
    //attach Authorization header if access_token is set
    if (state.access_token) params.headers = Object.assign({ "Authorization": 'Bearer ' + state.access_token }, params.headers ? params.headers : {});
    
    //default to JSON content type for POST requests
    if (method === 'POST')
        params.timeout = (params.timeout !== undefined ? params.timeout : 600000); //default to 10m timeout instead of 60s implicit default

    const res = http.request(method, url, JSON.stringify(body), params);

    const isSuccessCode = (res.status >= 200 && res.status < 400);
    if (!isSuccessCode) {
        //log to enable troubleshooting after the test run
        const fileAndLineNumber = new Error().stack.split('\n')[2];
        console.log('\n\n' + fileAndLineNumber + ' ' + res.url);
        console.log({ res });
    }
    
    //some reasonable default checks, feel free to modify
    const checks = {};
    checks[url + ' status ' + res.status] = r => isSuccessCode;
    checks[url + ' timing < 10s'] = r => r.timings.duration < 10000;
    check(res, checks);
}

export function _ensureLoggedIn(url) {
    if (state.access_token) return;

    const res = http.post(url);
    if (!(res.status >= 200 && res.status < 400)){
        console.error(res.status_text);
        throw 'could not log in';
    }

    state.access_token = (res.json()).access_token;
    console.log('----------- LOG IN SUCESSFUL -----------');
}

export function commonSetup() {
	if (!__ENV.AT_AUTH_URL) { console.warn('environment variable `AT_AUTH_URL` not specified'); return; }
	_ensureLoggedIn(__ENV.AT_AUTH_URL);
}