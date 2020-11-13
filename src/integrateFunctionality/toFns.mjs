import getCallerPaths from "../getCallerPaths.mjs";

import returnProxy from "../returnProxy.mjs";

import debug from "./debugThisFn.mjs";

import { logsEmitter } from "../logs.mjs";

function integrateToFns(whiteList, fnArray, origin, backup, allowList, fullBlock) {

	allowList = allowList || [];

	fnArray.forEach(el => {

		backup[el] = origin[el];

		origin[el] = function (...args) {

			console.log(origin);

			if(fullBlock) return returnProxy;

			const callerPaths = getCallerPaths();

			if(!callerPaths) {

				logsEmitter("callFn", [undefined, undefined], {

					grantRights: false,

					fn: el,
					args,

					calledAsClass: !!(new.target),

				});

				debug && console.log("toFns->false", callerPaths, el);

				return returnProxy;

			}

			const [nativePath, wrapPath] = callerPaths;

			debug && console.log("toFns->true", el, nativePath, wrapPath);

			if(~allowList.indexOf(nativePath)) {

				//dont emit

				return new.target ? new backup[el](...args) : backup[el].apply(this, args);

			}

			for(let i = 0; i < whiteList.length; ++i) {

				if(
					nativePath.startsWith(whiteList[i][0])
					&&
					wrapPath.startsWith(whiteList[i][1])
				) {

					logsEmitter("callFn", [nativePath, wrapPath], {

						grantRights: true,

						fn: el,
						args,

						calledAsClass: !!(new.target),

					});

					return new.target ? new backup[el](...args): backup[el].apply(this, args);

				}

			}

			logsEmitter("callFn", [nativePath, wrapPath], {

				grantRights: false,

				fn: el,
				args,

				calledAsClass: !!(new.target),

			});

			debug && console.log("toFns->", false);

			return returnProxy;

		};

	});

}

export default integrateToFns;