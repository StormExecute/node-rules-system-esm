import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import { whiteList } from "./addToWhiteList.mjs";

import cluster from "cluster";

import $cluster from "./store.mjs";

import integrateToFns from "../integrateFunctionality/toFns.mjs";

function blockFork(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockCluster");

	if($cluster.status == true) return false;

	integrateToFns(
		whiteList,
		["fork"],
		cluster,
		$cluster,
		[],
		fullBlock
	);

	return $cluster.status = true;

}

export default blockFork;