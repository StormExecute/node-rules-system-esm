import fs from "fs";

import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import getCallerPaths from "../getCallerPaths.mjs";

import returnProxy from "../returnProxy.mjs";

import { whiteList } from "./addToWhiteList.mjs";

import {

	$fs,
	$fsPromises,

	$fsList,
	$fsPromisesList,

} from "./store.mjs";

import integrateToFns from "../integrateFunctionality/toFns.mjs";

import breakFileHandleProto from "./breakFileHandleProto.mjs";

import needProcessVersion from "../../dependencies/needProcessVersion.mjs";
const fsPromisesSupport = ~needProcessVersion("10.0.0");

function fsBlockWriteAndChange(tryPass, fullBlock) {

	if(password.value === null) throw new Error(needToSetPassword);
	if(tryPass != password.value) return wrongPassEmitter(wrongPass, "blockFs");

	let fsStatus = false;
	let fsPromisesStatus = false;

	if($fs.status == false) {

		integrateToFns(whiteList, $fsList, fs, $fs, ["fs.js", "internal/fs/streams.js"], fullBlock);

		fsStatus = true;
		$fs.status = true;

	}

	if(fsPromisesSupport && $fsPromises.status == false) {

		integrateToFns(whiteList, $fsPromisesList, fs.promises, $fsPromises, [], fullBlock);

		$fsPromises.open = fs.promises.open;

		fs.promises.open = async function (path, flags, mode) {

			const filehandle = await $fsPromises.open(path, flags, mode);

			if(fullBlock) {

				breakFileHandleProto(filehandle);

				return filehandle;

			}

			const callerPaths = getCallerPaths();

			if (!callerPaths) {

				breakFileHandleProto(filehandle);

				return filehandle;

			}

			const [callerFile, dependencyPath] = callerPaths;

			for (let i = 0; i < whiteList.length; ++i) {

				if (
					callerFile.startsWith(whiteList[i][0])
					&&
					dependencyPath.startsWith(whiteList[i][1])
				) {

					return filehandle;

				}

			}

			breakFileHandleProto(filehandle);

			return filehandle;

		};

		fsPromisesStatus = true;
		$fsPromises.status = true;

	} else if(!fsPromisesSupport) {

		fsPromisesStatus = null;

	}

	return [fsStatus, fsPromisesStatus];

}

export default fsBlockWriteAndChange;