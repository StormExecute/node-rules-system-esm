// @ts-ignore
import NRS_NAMESPACE from "node-rules-system";

declare namespace NRS_ESM_NAMESPACE {

	function tempReInit(
		tempReInitPass: string,
		newPassword: string,
		leaveFullSecure?: boolean
	): boolean;

	const tempPassword: string;

}

declare const NRS_ESM: (typeof NRS_ESM_NAMESPACE & typeof NRS_NAMESPACE);

export = NRS_ESM;