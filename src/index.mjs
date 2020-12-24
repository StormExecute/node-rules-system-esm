import NRS from "node-rules-system";

import $process from "process";

import http from "http";
const { MathRandom, Proxy, ReflectApply } = http["NRS_PRIMORDIALS"];

const repeat = (sym, count) => {

	let result = "";

	for (let i = 0; i < count; ++i) result += sym;

	return result;

};

const tempBlockedError = repeat("-", $process.stdout.columns / 100 * 90) + "\n\n"
	+ "\x1b[34m[node-rules-system-esm] NRS fixed enabled ESM support and initialized full protection with a temporary password.\n\n"
	+ "To use the standard NRS, call the NRS.tempReInit(NRS.tempPassword, [yourNewPassword]: string) method after NRS importing.\n\n"
	+ "You can also pass the third argument as a boolean variable that answers the question whether to leave full protection.\x1b[0m\n";

const NRSBlockFn = fn => {

	return new Proxy(fn, {

		apply() {

			if( inTempArea ) {

				throw new Error( tempBlockedError );

			} else {

				return ReflectApply(...arguments);

			}

		},

		set() {

			return false;

		}

	});

};

const NRSBlockObject = obj => {

	return new Proxy(obj, {

		get(target, prop) {

			if( inTempArea ) {

				throw new Error( tempBlockedError );

			} else {

				return target[prop];

			}

		},

		set() {

			return false;

		}

	})

};

export const getAllLogs = NRSBlockFn(NRS.getAllLogs)
export const getLogsEmitter = NRSBlockFn(NRS.getLogsEmitter);

export const startRecordLogs = NRSBlockFn(NRS.startRecordLogs);
export const stopRecordLogs = NRSBlockFn(NRS.stopRecordLogs);

export const settings = NRSBlockObject(NRS.settings);

export const init = NRSBlockFn(NRS.init);
export const reInit = NRSBlockFn(NRS.reInit);

export const session = NRSBlockFn(NRS.session);
export const secureSession = NRSBlockFn(NRS.secureSession);

export const fullSecure = NRSBlockFn(NRS.fullSecure);
export const enableFullSecure = NRSBlockFn(NRS.enableFullSecure);
export const disableFullSecure = NRSBlockFn(NRS.disableFullSecure);

export const setSecure = NRSBlockFn(NRS.setSecure);
export const setSecureEnable = NRSBlockFn(NRS.setSecureEnable);
export const setSecureDisable = NRSBlockFn(NRS.setSecureDisable);

export const connections = NRSBlockObject(NRS.connections);
export const fs = NRSBlockObject(NRS.fs);

export const process = NRSBlockObject(NRS.process);

export const child_process = NRSBlockObject(NRS.child_process);
export const dgram = NRSBlockObject(NRS.dgram);
export const worker_threads = NRSBlockObject(NRS.worker_threads);
export const cluster = NRSBlockObject(NRS.cluster);

export const timers = NRSBlockObject(NRS.timers);
export const module = NRSBlockObject(NRS.module);

export const isReturnProxy = NRS.isReturnProxy;

const tempPassword = "NRS-ESM-TEMP-PASSWORD-" + MathRandom();

NRS.init(tempPassword);
NRS.enableFullSecure(tempPassword);

let inTempArea = true;
let alreadyGetTempPassword = false;

export default new Proxy(NRS, {

	get(target, prop) {

		if( prop == "tempPassword" && !alreadyGetTempPassword ) {

			alreadyGetTempPassword = true;

			return tempPassword;

		}

		if( prop == "tempReInit" && inTempArea ) {

			return new Proxy(function () {}, {

				apply(target, thisArg, [ tempReInitPass, newPassword, leaveFullSecure ]) {

					if(tempReInitPass != tempPassword) {

						throw new Error("[node-rules-system-esm] Wrong tempPassword!");

					}

					NRS.reInit(tempReInitPass, newPassword);

					if(!leaveFullSecure) NRS.disableFullSecure(newPassword);

					inTempArea = false;

					return true;

				}

			});

		}

		if( inTempArea ) {

			throw new Error( tempBlockedError );

		} else {

			return target[prop];

		}

	},

	set() {

		return false;

	}

});