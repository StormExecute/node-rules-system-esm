import NRS_ESM from "../src/index.mjs";

import nodePath from "path";

import fetch from "node-fetch";
import request from "request";

//DONT EXPORT NRS_PASSWORD! USE MATH.RANDOM() AS THE SALT ALWAYS!
const NRS_PASSWORD = "somePassword" + Math.random();

// NRS_ESM initializes protection with a temporary password instantly,
// so you need to use the following construction:
// NRS_ESM.tempReInit(tempPassword: string, newPassword: string, leaveFullSecure?: boolean):
NRS_ESM.tempReInit(NRS_ESM.tempPassword, NRS_PASSWORD, true);

//IF YOU STILL NEED TO EXPORT THE SESSION, USE THIS CONSTRUCTION:
const SECURE_NRS_SESSION = NRS_ESM.secureSession(NRS_PASSWORD, "examples/index.mjs");

SECURE_NRS_SESSION.startRecordLogs();
//SECURE_NRS_SESSION.getLogsEmitter().on("*", log => console.log(log));

//node-fetch
SECURE_NRS_SESSION.connections.addDependencyAndPathsToWhiteList(["node-fetch", "examples/index.mjs"]);

//request
SECURE_NRS_SESSION.connections.addDependencyAndPathsToWhiteList(["request", "examples/index.mjs"]);

const URL = "http://www.example.com";

const cwd = (() => {

	const _ = process.cwd();

	if(_.endsWith("/examples")) return _;

	return nodePath.join(_, "./examples");

})();

fetch(URL)
	.then(res => res.text())
	.then(body => {

		console.log("\x1b[34m%s\x1b[0m", "FETCH: DONE!", SECURE_NRS_SESSION.getUniqLogs());

		request(URL, () => {

			//on versions 11.0.0, 11.1.0, 11.2.0 and 11.3.0, the console returns an error in this situation
			//fix(11.4.0): https://github.com/nodejs/node/commit/50005e7ddf9bd52433b20e612c2ca970bf772d3b#diff-bcbab7b1bfa5d1db1110121f54840169601f12177c390dd9157a9422de102e2b

			console.log("\x1b[34m%s\x1b[0m", "REQUEST: DONE!", SECURE_NRS_SESSION.getUniqLogs());

		});

		setImmediate(() => {

			const thisLogs = SECURE_NRS_SESSION.getAllLogs();
			const lastLog = thisLogs[thisLogs.length - 2];

			if (
				lastLog.type == "callFn"
				&&
				lastLog.callerPaths[0] == nodePath.join(
					cwd,
					"../node_modules/request/request.js"
				)
				&&
				lastLog.callerPaths[ lastLog.callerPaths.length - 1 ] == nodePath.join(
					cwd,
					"./index.mjs"
				)
			) {

				if(lastLog.grantRights == false) {

					throw "must be allowed!";

				}

			} else {

				throw "something went wrong!";

			}

		});

	})
	.catch(e => console.log("ERR", e));

console.log(NRS_ESM.getAllLogs(NRS_PASSWORD));

const thisLogs = SECURE_NRS_SESSION.getAllLogs();

// -2 because the real last log is callFromSecureSession
const lastLog = thisLogs[thisLogs.length - 2];

const majorNodeV = process.version.split(".")[0].replace(/\D/g, "");

if (
	lastLog.type == "callFn"
	&&
	//starting from node.js v12.0.0 .getFileName returns the ending .js for this situation
	lastLog.callerPaths[0] == nodePath.join(
		cwd,
		"../node_modules/node-fetch/lib/index." + (majorNodeV >= 12 ? "js" : "mjs")
	)
	&&
	lastLog.callerPaths[ lastLog.callerPaths.length - 1 ] == nodePath.join(
		cwd,
		"./index.mjs"
	)
) {

	if(lastLog.grantRights == false) {

		throw "must be allowed!";

	}

} else {

	throw "something went wrong!";

}