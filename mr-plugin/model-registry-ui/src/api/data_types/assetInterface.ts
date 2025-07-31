export interface AssetObjectInterface {
	id: string;
	url_id: number;
	content_id: string;
	content: object;
	created_by: string;
	created_at: string;
}

export interface Patch {
	added: string[],
	removed: string[]
}

export interface AssetVersionInterface {
	id: number;
	commit_hash: string;
	commit_message: string;
	number: string;
	parent?: object; // parent version
	patch: Patch;
	created_by: string;
	created_at: string;
	tags: string[];
	size?: number;
	num_objects?: number;
}

export interface AssetInterface {
	id: string;
	asset_class: string;
	seq_id: number;
	title: string;
	description: string;
	owner: string;
	version?: object;
	top_hash: string;
	refs: object | null;
	alias: string;
	all_objects: object[];
	versions: AssetVersionInterface[];
	leaf_version: object | null;
	created_by: string;
	created_at: string;
	modified_at: string;
	modified_by: string;
	root_version_id: number;
	leaf_version_id: number;
	status: number;
	metadata: object;
	tags: string[];
	phase: number;
	details?: any;
	attributes?: any;
}
