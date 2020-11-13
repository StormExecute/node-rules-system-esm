import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import { whiteList } from "./addToWhiteList.mjs";

import dgram from "dgram";

import $drgam from "./store.mjs";

import integrateToFns from "../integrateFunctionality/toFns.mjs";

function blockDgram(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockDgram");

	if($drgam.status == true) return false;

	integrateToFns(
		whiteList,
		["_createSocketHandle", "createSocket", "Socket"],
		dgram,
		$drgam,
		["internal/child_process.js"],
		fullBlock
	);

	return $drgam.status = true;

}

export default blockDgram;