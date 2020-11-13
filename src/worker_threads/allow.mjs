import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import worker_threads from "worker_threads";

import $worker_threads from "./store.mjs";

import restore from "../restore.mjs";

function allowWorker(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowWorkerThreads");

	if($worker_threads.status == false) return false;

	restore(
		["Worker"],
		worker_threads,
		$worker_threads
	);

	$worker_threads.status = false;

	return true;

}

export default allowWorker;