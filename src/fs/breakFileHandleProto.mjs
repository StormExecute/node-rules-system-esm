import returnProxy from "../returnProxy.mjs";

export default function (filehandle) {

	[

		"appendFile",

		"chmod", "chown",

		"datasync", "sync",

		"truncate",

		"utimes",

		"write", "writeFile", "writev",

	].forEach(el => {

		filehandle[el] = returnProxy;
		filehandle.__proto__ = returnProxy;

	});

};