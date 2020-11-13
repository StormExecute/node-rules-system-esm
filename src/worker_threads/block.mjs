import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import { whiteList } from "./addToWhiteList.mjs";

import worker_threads from "worker_threads";

import $worker_threads from "./store.mjs";

import integrateToFns from "../integrateFunctionality/toFns.mjs";

function blockWorker(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockWorkerThreads");

	if($worker_threads.status == true) return false;

	integrateToFns(
		whiteList,
		["Worker"],
		worker_threads,
		$worker_threads,
		[],
		fullBlock
	);

	return $worker_threads.status = true;

}

export default blockWorker;