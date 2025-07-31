
export interface ComputeProvider {
	id: string;                  // Unique identifier for the provider
	name: string;                // Name of the provider (e.g., AWS, Google Cloud, Azure)
	description?: string;        // Optional description
	createdAt: Date;             // Creation date
	updatedAt: Date;             // Last update date
	environments: Environment[]; // List of environments provided by the provider
}

interface Environment {
	id: string;                // Unique identifier for the environment
	name: string;              // Name of the environment (e.g., AWS Lambda, Kubernetes)
	provider: ComputeProvider;        // Provider of the environment
	type: 'compute' | 'kubernetes' | 'lambda' | 'storage' | 'database' | 'other'; // Type of deployment environment
	description?: string;      // Optional description
	status: 'active' | 'inactive' | 'pending'; // Status of the environment
	createdAt: Date;           // Creation date
	updatedAt: Date;           // Last update date
}

export interface ProjectProviderAssociation {
	projectId: string;         // Unique identifier for the project
	providerId: string;        // Unique identifier for the provider
	associationDate: Date;     // Date when the association was made
	status?: 'active' | 'inactive' | 'archived'; // Status of the association
}
