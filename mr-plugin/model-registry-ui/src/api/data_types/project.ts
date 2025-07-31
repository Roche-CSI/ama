export interface ProjectInterface {
	id: string;         // UUID
	name: string;       // Name of the project
	title: string;      // Title of the project
	description: string;// Description of the project
	created_at: string; // ISO date string for creation date
	url: string;        // bucket URL
	created_by: string; // Username of the creator
	readme_md: string;     // readme markdown
	roles: object;      // User roles
	
}

export class Project implements ProjectInterface {
	
	id: string;
	name: string;
	title: string;
	description: string;
	created_at: string;
	url: string;
	created_by: string;
	readme_md: string;
	roles: object;
	
	constructor(data: Partial<ProjectInterface>) {
		this.id = data.id || '';
		this.name = data.name || '';
		this.title = data.title || '';
		this.description = data.description || '';
		this.created_at = data.created_at || '';
		this.url = data.url || '';
		this.roles = data.roles || {};
		this.created_by = data.created_by || '';
		this.readme_md = data.readme_md || '';
	}
}
