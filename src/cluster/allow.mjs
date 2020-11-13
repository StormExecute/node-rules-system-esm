import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import cluster from "cluster"

import $cluster from "./store.mjs";

import restore from "../restore.mjs";

function allowFork(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowCluster");

	if($cluster.status == false) return false;

	restore(
		["fork"],
		cluster,
		$cluster
	);

	$cluster.status = false;

	return true;

}

export default allowFork;