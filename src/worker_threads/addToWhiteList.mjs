import main from "../whiteListFunctionality.mjs";

const workerThreadsWhiteList = [];
workerThreadsWhiteList.name = "worker_threads";

const wrapper = exportFn => {

	return function (tryPass, ...args) {

		return main[exportFn](connectionsWhiteList, tryPass, args);

	};

};

const addFullPathToWhiteList = wrapper("addFullPathToWhiteList");
const addProjectPathToWhiteList = wrapper("addProjectPathToWhiteList");
const addDependencyToWhiteList = wrapper("addDependencyToWhiteList");
const addDependencyPathToWhiteList = wrapper("addDependencyPathToWhiteList");

const whiteList = workerThreadsWhiteList;

export {

	whiteList,

};

export default {

	addFullPathToWhiteList,
	addProjectPathToWhiteList,
	addDependencyToWhiteList,
	addDependencyPathToWhiteList,

}