import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import dgram from "dgram";

import $drgam from "./store.mjs";

import restore from "../restore.mjs";

function allowDgram(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowDgram");

	if($drgam.status == false) return false;

	restore(
		["_createSocketHandle", "createSocket", "Socket"],
		dgram,
		$drgam
	);

	$drgam.status = false;

	return true;

}

export default allowDgram;