import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import { whiteList } from "./addToWhiteList.mjs";

import child_process from "child_process";

import $childProcess from "./store.mjs";

import integrateToFns from "../integrateFunctionality/toFns.mjs";

function blockChildProcess(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockChildProcess");

	if($childProcess.status == true) return false;

	integrateToFns(
		whiteList,
		["ChildProcess", "exec", "execSync", "execFile", "execFileSync", "fork", "_forkChild", "spawn", "spawnSync"],
		child_process,
		$childProcess,
		["child_process.js", "internal/cluster/master.js"],
		fullBlock
	);

	return $childProcess.status = true;

}

export default blockChildProcess;