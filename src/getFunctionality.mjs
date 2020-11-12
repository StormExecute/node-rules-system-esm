import { password, needToSetPassword, wrongPass } from "./password.mjs";

import { logsEmitter, wrongPassEmitter } from "./logs.mjs";

//NRS.connections.$http.get(pass, propName)
//NRS.fs.$fs.get(pass, propName)

function make(object) {

	return function (tryPass, propName) {

		if(password.value === null) throw new Error(needToSetPassword);
		if(tryPass != password.value) return wrongPassEmitter(wrongPass, "get", { propName });

		logsEmitter("get", null, {

			grantRights: true,

			propName,

		});

		return object[propName];

	}

}

export default make;