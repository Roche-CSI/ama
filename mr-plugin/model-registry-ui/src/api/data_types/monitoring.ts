
export interface MonitoringProviderInterface {
	id: string;           // The unique identifier for the action provider (e.g., 'github', 'jira')
	name: string;         // The unique identifier for the action provider (e.g., 'github', 'jira')
	title: string;        // The human-readable name of the action provider (e.g., 'GitHub', 'Jira')
	description: string | null; // A description of the action provider (nullable)
	url: string | null;   // The URL for the action provider, could be null if not provided
	is_active: boolean;   // Whether the action provider is active
	configs: object;     // The configuration settings related to the action provider
	created_at: string;   // The timestamp when the action provider was created
	created_by: string;   // The user who created the action provider
}
