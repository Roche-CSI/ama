// Types for nested objects in Attributes
export interface AssetClassInterface {
	id: string;
	name: string;
	title: string;
	description: string;
	class_type: string;
	tags: string[];
	owner: string;
	created_at: string;
	create_by: string;
	modified_at: string;
	metadata: Record<string, any>;
	attributes: Record<string, any>;
	status: number;
	counter: number;
	[key: string]: unknown; // Index signature to handle dynamic properties
}

// AssetClass implementation
export class AssetClass implements AssetClassInterface {
	id: string;
	name: string;
	title: string;
	description: string;
	class_type: string;
	tags: string[];
	owner: string;
	created_at: string;
	create_by: string;
	modified_at: string;
	metadata: Record<string, any>;
	attributes: any;
	status: number;
	counter: number;
	[key: string]: unknown;
	
	constructor(data: Partial<AssetClassInterface>) {
		this.id = data.id || '';
		this.name = data.name || '';
		this.title = data.title || '';
		this.description = data.description || '';
		this.class_type = data.class_type || '';
		this.tags = data.tags || [];
		this.owner = data.owner || '';
		this.created_at = data.created_at || '';
		this.create_by = data.create_by || '';
		this.modified_at = data.modified_at || '';
		this.metadata = data.metadata || {};
		this.attributes = data.attributes || {};
		this.status = data.status || 1;
		this.counter = data.counter || 0;
	}
}
