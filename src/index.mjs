import makeGet from "./getFunctionality.mjs";

const getWhiteListFunctionality = function (fns) {

	return {

		addFullPathToWhiteList: fns.addFullPathToWhiteList,
		addProjectPathToWhiteList: fns.addProjectPathToWhiteList,
		addDependencyToWhiteList: fns.addDependencyToWhiteList,
		addDependencyPathToWhiteList: fns.addDependencyPathToWhiteList,

	};

};

import {

	$tls,
	$net,
	$http,
	$https,
	$http2,

} from "./connections/store.mjs";

import {

	integrateToNet,
	integrateToHttp,
	integrateToHttps,
	integrateToHttp2,

	integrateToHttpAgent,
	integrateToHttpClient,
	integrateToTls,
	integrateToTlsWrap,

	blockConnections,

} from "./connections/block.mjs";

import {

	restoreNet,
	restoreHttp,
	restoreHttps,
	restoreHttp2,

	restoreHttpAgent,
	restoreHttpClient,
	restoreTls,
	restoreTlsWrap,

	allowConnections,

} from "./connections/allow.mjs";

import connectionsAddToWhiteList from "./connections/addToWhiteList.mjs";
const connections = getWhiteListFunctionality(connectionsAddToWhiteList);

connections.$tls = { get: makeGet($tls) };
connections.$net = { get: makeGet($net) };
connections.$http = { get: makeGet($http) };
connections.$https = { get: makeGet($https) };
connections.$http2 = { get: makeGet($http2) };

connections.block = blockConnections;
connections.allow = allowConnections;

connections.integrateToNet = integrateToNet;
connections.integrateToHttp = integrateToHttp;
connections.integrateToHttps = integrateToHttps;
connections.integrateToHttp2 = integrateToHttp2;

connections.integrateToHttpAgent = integrateToHttpAgent;
connections.integrateToHttpClient = integrateToHttpClient;
connections.integrateToTls = integrateToTls;
connections.integrateToTlsWrap = integrateToTlsWrap;

connections.restoreNet = restoreNet;
connections.restoreHttp = restoreHttp;
connections.restoreHttps = restoreHttps;
connections.restoreHttp2 = restoreHttp2;

connections.restoreHttpAgent = restoreHttpAgent;
connections.restoreHttpClient = restoreHttpClient;
connections.restoreTls = restoreTls;
connections.restoreTlsWrap = restoreTlsWrap;

import {

	$fs,
	$fsPromises,

} from "./fs/store.mjs";

import fsAddToWhiteList from "./fs/addToWhiteList.mjs";
const fs = getWhiteListFunctionality(fsAddToWhiteList);

import fsBlock from "./fs/block.mjs";
import fsAllow from "./fs/allow.mjs";
fs.block = fsBlock;
fs.allow = fsAllow;

fs.$fs = { get: makeGet($fs) };
fs.$fsPromises = { get: makeGet($fsPromises) };

import blockBindings from "./process/blockBindings.mjs";
import allowBindings from "./process/allowBindings.mjs";

const process = {

	blockBinding: blockBindings["binding"],
	blockLinkedBinding: blockBindings["_linkedBinding"],
	blockDlopen: blockBindings["dlopen"],

	blockBindingLinkedBindingAndDlopen: blockBindings.blockAll,

	block: blockBindings.blockAll,

	allowBinding: allowBindings.allowBinding,
	allowLinkedBinding: allowBindings.allowLinkedBinding,
	allowDlopen: allowBindings.allowDlopen,

	allowBindingLinkedBindingAndDlopen: allowBindings.allowAll,

	allow: blockBindings.blockAll,

};

import processStore from "./process/storeBindings.mjs";
process.$fns = { get: makeGet(processStore) };

import childProcessAddToWhiteList from "./child_process/addToWhiteList.mjs";
const child_process = getWhiteListFunctionality(childProcessAddToWhiteList);

import childProcessBlock from "./child_process/block.mjs";
import childProcessAllow from "./child_process/allow.mjs";
child_process.block = childProcessBlock;
child_process.allow = childProcessAllow;

import childProcessStore from "./child_process/store.mjs";
child_process.$fns = { get: makeGet(childProcessStore) };

import dgramAddToWhiteList from "./dgram/addToWhiteList.mjs";
const dgram = getWhiteListFunctionality(dgramAddToWhiteList);

import dgramBlock from "./dgram/block.mjs";
import dgramAllow from "./dgram/allow.mjs";
dgram.block = dgramBlock;
dgram.allow = dgramAllow;

import dgramStore from "./dgram/store.mjs";
dgram.$fns = { get: makeGet(dgramStore) };

import workerThreadsAddToWhiteList from "./worker_threads/addToWhiteList.mjs";
const worker_threads = getWhiteListFunctionality(workerThreadsAddToWhiteList);

import workerThreadsBlock from "./worker_threads/block.mjs";
import workerThreadsAllow from "./worker_threads/allow.mjs";
worker_threads.block = workerThreadsBlock;
worker_threads.allow = workerThreadsAllow;

import workerThreadsStore from "./worker_threads/store.mjs";
worker_threads.$fns = { get: makeGet(workerThreadsStore) };

import clusterAddToWhiteList from "./cluster/addToWhiteList.mjs";
const cluster = getWhiteListFunctionality(clusterAddToWhiteList);

import clusterBlock from "./cluster/block.mjs";
import clusterAllow from "./cluster/allow.mjs";
cluster.block = clusterBlock;
cluster.allow = clusterAllow;

import clusterStore from "./cluster/store.mjs";
cluster.$fns = { get: makeGet(clusterStore) };

import {

	setPassword,
	changePassword,

	password,
	needToSetPassword,
	wrongPass,

} from "./password.mjs";

import makeSession from "./session.mjs";
import makeSecureSession from "./secureSession.mjs";

import makeLogs from "./logs.mjs";

const {

	getAllLogs,
	getLogsEmitter,

	startRecordLogs,
	stopRecordLogs,

} = makeLogs(password, needToSetPassword, wrongPass);

import settings from "./_settings/main.mjs";

import makeFullSecure from "./fullSecure.mjs";
import makeSetSecure from "./setSecure.mjs";

const { fullSecure, enableFullSecure, disableFullSecure } = makeFullSecure(
	connections, fs,
	process, child_process, dgram, worker_threads, cluster
);
const { setSecure, setSecureEnable, setSecureDisable } = makeSetSecure(
	connections, fs,
	process, child_process, dgram, worker_threads, cluster
);

import isReturnProxy from "./isReturnProxy.mjs";

export default {

	getAllLogs,
	getLogsEmitter,

	startRecordLogs,
	stopRecordLogs,

	settings,

	init: setPassword,
	reInit: changePassword,

	session: makeSession(
		connections, fs,
		process, child_process, dgram, worker_threads, cluster,
		settings,
		{

			getAllLogs,
			getLogsEmitter,

			startRecordLogs,
			stopRecordLogs,

			fullSecure,
			enableFullSecure,
			disableFullSecure,

			setSecure,
			setSecureEnable,
			setSecureDisable,

			isReturnProxy,

		}
	),
	secureSession: makeSecureSession(
		connections, fs,
		process, child_process, dgram, worker_threads, cluster,
		settings,
		{

			getAllLogs,
			getLogsEmitter,

			startRecordLogs,
			stopRecordLogs,

			fullSecure,
			enableFullSecure,
			disableFullSecure,

			setSecure,
			setSecureEnable,
			setSecureDisable,

			isReturnProxy,

		}
	),

	fullSecure,
	enableFullSecure,
	disableFullSecure,

	setSecure,
	setSecureEnable,
	setSecureDisable,

	connections,
	fs,

	process,

	child_process,
	dgram,
	worker_threads,
	cluster,

	isReturnProxy,

};