import fs from "fs";

import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} from "./store.mjs";

import restore from "../restore.mjs";

import needProcessVersion from "../../dependencies/needProcessVersion.mjs";
const fsPromisesSupport = ~needProcessVersion("10.0.0");

function fsAllowWriteAndChange(tryPass) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "allowFs");

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == true) {

		restore($fsList, fs, $fs);

		fsStatus = true;
		$fs.status = false;

	}

	if(fsPromisesSupport && $fsPromises.status == true) {

		restore($fsPromisesList.concat( [ "open" ] ), fs.promises, $fsPromises);

		fsPromisesStatus = true;
		$fsPromises.status = false;

	} else if(!fsPromisesSupport) {

		fsPromisesStatus = null;

	}

	return [fsStatus, fsPromisesStatus];

}

export default fsAllowWriteAndChange;