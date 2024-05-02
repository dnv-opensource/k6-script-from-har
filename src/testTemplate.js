import { httpRequest, commonSetup, state, jUnitIterationDuration } from '/testCommon.js'; //hack to reference the executing folder without needing relative path
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const given_vus = __ENV.AT_VU_COUNT === undefined ? 15 : __ENV.AT_VU_COUNT;
const given_iterations = __ENV.AT_ITERATIONS === undefined ? given_vus * 3 : __ENV.AT_ITERATIONS;

export const options = {
	vus: given_vus,
	iterations: given_iterations,
};

export default function (setup_state) {
	Object.assign(state, setup_state);
	${testBody}
}

export function setup() {
	commonSetup();
	return state;
}

export function handleSummary(data) {
	return {
		['./${filename}.junit.xml']: jUnitIterationDuration(data, '${filename}'),
		['stdout']: textSummary(data),
	};
}


