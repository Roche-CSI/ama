// Interface for the `tags` table
export interface Tag {
	id: string; // UUID
	name: string;
	category_id: string; // UUID is represented as a string
}

// Interface for the `taggables` table
export interface TaggableCategory {
	id: string; // UUID
	name: string; // name i.e. 'Genomics', 'Computer Vision', 'NLP', 'Proteomics'
	group_id: string; // group i.e. 'deployment', 'project', 'task', 'model', UNIQUE=False
	group_name: string; // group i.e. 'deployment', 'project', 'task', 'model', UNIQUE=False
	description?: string; // TEXT can be optional or nullable
	created_by: string;
	created_at: string; // TIMESTAMP
	modified_at: string;
	tags: Tag[]; // One-to-many relationship with the `tags` table
	readme_md?: string; // Markdown content for the README.md file
}

export interface TaggableGroup {
	id: string; // UUID
	name: string; // name i.e. 'task', 'libraries', 'languages', 'licenses', UNIQUE_TOGETHER(group, asset_group)
	entity_group_id: string; // UUID
	entity_group_name: string; // name i.e. 'models', 'datasets', 'deployments'
	description?: string; // TEXT can be optional or nullable
	created_by: string;
	created_at: string; // TIMESTAMP
	modified_at: string;
	categories: TaggableCategory[]; // One-to-many relationship with the `taggables` table
}

// EntityGroup is a wrapper around AssetClass in Asset-Manager
export interface EntityGroup {
	id: string; // UUID
	name: string; // name i.e. 'models', 'datasets', 'deployments', UNIQUE=True
	description?: string; // TEXT can be optional or nullable
	created_by: string;
	created_at: string; // TIMESTAMP
	modified_at: string;
	groups: TaggableGroup[]; // One-to-many relationship with the `taggable-groups` table
}
