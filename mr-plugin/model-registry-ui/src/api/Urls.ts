
const BASE_URL: Record<string, string> = {
	TEST: 'http://127.0.0.1:5000/',
	DEV: 'http://127.0.0.1:5001/',
	SANDBOX: 'sandbox-url',
	PRODUCTION: 'http://127.0.0.1:5000/'
};

export const ACTIVE_MODE = 'DEV'; //DEV

const API_PREFIX = 'api/v1/';

export const END_POINTS = {
	ML_MODEL: 'mlmodel',
	DATASET: 'dataset',
	DEPLOYMENT: 'deployment',
	TAGGABLE_GROUP: 'taggablegroup',
	PROJECT: 'project',
	AUTH_LOGIN: 'ui-auth/login',
	AUTH_SIGNUP: 'ui-auth/signup',
	ASSET_CLASS: 'assetclass',
	SEARCH: "search",
	ASSET_DETAIL: "assetdetail",
	ACTION_PROVIDER: "actionprovider",
	EXPERIMENT_PROVIDER: "experimentprovider",
	MODEL_EXPERIMENT: "modelexperiment",
	ASSET_ACTION: "assetaction",
	ACTION_RUN: "actionrun",
	MONITORING_PROVIDER: "monitoringprovider",
	// Proxy endpoints
	ASSET: "asset-server/asset",
	SIGNED_URL: "asset-server/file_url",
	LOGIN: "asset-server/login",
};

interface URLsParams {
	mode?: string;
	endPoint?: string;
}


export default class URLs {
	mode?: string;
	base_url?: string;
	end_point?: string;

	constructor({ mode, endPoint = '' }: URLsParams = {}) {
		this.mode = mode || ACTIVE_MODE;
		this.base_url = BASE_URL[this.mode] as string;
		this.end_point = endPoint;
	}

	url_prefix() {
		return this.base_url + API_PREFIX;
	}

	route(id?: string) {
		return this.construct_url(this.url_prefix() + this.end_point, id)
	}

	construct_url(base_url: string, id?: string | number) {
		let url = base_url;

		// Add trailing slash if not present
		if (!url.endsWith('/')) {
			url += '/';
		}

		if (id) {
			// Remove trailing slash before adding id to avoid double slash
			url = url.slice(0, -1) + '/' + id;
		}

		return url;
	}

}
