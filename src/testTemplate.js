import { httpRequest, commonSetup, state } from './testCommon.js';

const given_vus = __ENV.AT_VU_COUNT === undefined ? 15 : __ENV.AT_VU_COUNT;
const given_iterations = __ENV.AT_ITERATIONS === undefined ? given_vus * 3 : __ENV.AT_ITERATIONS;

export const options = {
	vus: given_vus,
	iterations: given_iterations,
};

export function setup() {
	commonSetup();
	return state;
}

export default function (setup_state) {
	Object.assign(state, setup_state);
	${testBody}
}

