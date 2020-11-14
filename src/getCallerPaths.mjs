const debug = !!process.argv.filter(el => el == "--debugP").length || process.env.debugP;
const debugFileNames = !!process.argv.filter(el => el == "--debugF").length || process.env.debugF;

import isWindows from "../dependencies/isWindows.mjs";

/*

	Linux:

		/home/user/project/some.mjs +
		||
		file:///home/user/project/some.mjs +

	Windows:

		C:\projects\some.mjs +
		||
		file:///C:/projects/some.mjs +
		||
		C:/projects/some.mjs +?
		||
		/C:projects/some.mjs +?
		||
		file:///C:\projects/some.mjs ?

*/

const isCallerPath = !isWindows
	? path => path && (path[0] == "/" || path.startsWith("file://"))
	: path => path && (path.match(/^[a-zA-Z]:\\/) || path.match(/^\/?[a-zA-Z]:\//) || path.startsWith("file://"));

function endsWithTranslationSlashes(str, arg) {

	if(arg.length > str.length) return false;

	let strSymPointer = str.length - 1;

	for (let i = arg.length - 1; i >= 0; --i) {

		const symArg = arg[i];
		const symStr = str[strSymPointer--];

		//to support windows slashes
		if(symStr == "\\" && symArg == "/") continue;

		if(symStr != symArg) return false;

	}

	return true;

}

function main(callerPaths, errStack) {

	let inProcessScreening = true;

	let first = null;
	let second = null;

	debugFileNames && console.log("debugFileNames", errStack.map(el => el.getFileName()));

	for(let i = 0; i < errStack.length; ++i) {

		const path = errStack[i].getFileName();

		//to skip nulls in state "inProcessScreening"
		if(!path) continue;

		if(
			inProcessScreening
			&&
			(

				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/getCallerPaths.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/secureSession.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/session.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/logs.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/password.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/_settings/main.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/getFunctionality.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/whiteListFunctionality.mjs")

				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/cluster/addToWhiteList.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/worker_threads/addToWhiteList.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/dgram/addToWhiteList.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/child_process/addToWhiteList.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/connections/addToWhiteList.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/fs/addToWhiteList.mjs")

				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/cluster/allow.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/worker_threads/allow.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/dgram/allow.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/child_process/allow.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/process/allowBindings.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/connections/allow.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/fs/allow.mjs")

				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/cluster/block.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/worker_threads/block.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/dgram/block.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/child_process/block.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/process/blockBindings.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/connections/block.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/fs/block.mjs")

				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/integrateFunctionality/toFns.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/integrateFunctionality/toObject.mjs")
				||
				endsWithTranslationSlashes(path, "/node-rules-system-esm/src/integrateFunctionality/toProtoFn.mjs")

			)
		) {

			continue;

		}

		if(inProcessScreening) {

			inProcessScreening = false;

			first = path;

			continue;

		}

		if(
			isCallerPath(path)
			&&
			(
				(i + 1) < errStack.length
				&&
				!isCallerPath(errStack[i + 1].getFileName())
			)
		) {

			second = path;

			break;

		}

	}

	if(!first) return callerPaths;

	if(first && !second) second = first;

	return [first, second];

}

function getCallerPaths() {

	const originalFunc = Error.prepareStackTrace;

	let callerPaths = null;

	try {

		const err = new Error();

		Error.prepareStackTrace = function (err, stack) { return stack; };

		callerPaths = main(callerPaths, err.stack);

		if(callerPaths) {

			if(isCallerPath(callerPaths[0]) && !callerPaths[0].startsWith("file://")) callerPaths[0] = "file://" + callerPaths[0];
			if(isCallerPath(callerPaths[1]) && !callerPaths[1].startsWith("file://")) callerPaths[1] = "file://" + callerPaths[1];

		}

	} catch (e) {}

	Error.prepareStackTrace = originalFunc;

	debug && console.log("getCallerPaths", callerPaths);

	return callerPaths;

}

export default getCallerPaths;