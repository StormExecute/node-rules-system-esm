import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import child_process from "child_process";

import $childProcess from "./store.mjs";

import restore from "../restore.mjs";

function allowChildProcess(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowChildProcess");

	if($childProcess.status == false) return false;

	restore(
		["ChildProcess", "exec", "execSync", "execFile", "execFileSync", "fork", "_forkChild", "spawn", "spawnSync"],
		child_process,
		$childProcess
	);

	$childProcess.status = false;

	return true;

}

export default allowChildProcess;