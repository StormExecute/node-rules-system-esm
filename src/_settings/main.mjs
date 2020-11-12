import { password, needToSetPassword, wrongPass } from "../password.mjs";

import { wrongPassEmitter } from "../logs.mjs";

import storeSettings from "./store.mjs";

export default {

	throwIfWrongPassword(tryPass) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "throwIfWrongPassword");

		storeSettings.throwIfWrongPassword = true;

		return true;

	},

	dontThrowIfWrongPassword(tryPass) {

		if (password.value === null) throw new Error(needToSetPassword);
		if (tryPass != password.value) return wrongPassEmitter(wrongPass, "dontThrowIfWrongPassword");

		storeSettings.throwIfWrongPassword = false;

		return true;

	},

};