interface MachineConfiguration {
	cpu: string;           // CPU specification (e.g., "4 vCPUs")
	memory: string;        // Memory specification (e.g., "16 GB")
	gpu?: string;          // Optional GPU specification (e.g., "1 GPU")
	disk: string;          // Disk storage specification (e.g., "100 GB SSD")
}

interface Metrics {
	cpu_usage?: number;       // Optional CPU usage percentage
	memory_usage?: number;    // Optional Memory usage percentage
	disk_usage?: number;      // Optional Disk usage percentage
}

export interface DeploymentInterface {
	id: string;                   // Unique identifier for the deployment
	name: string;                 // Name of the deployment
	description?: string;         // Optional description of the deployment
	created_at: string;           // Timestamp when the deployment was created (ISO date string)
	updated_at?: string;          // Optional timestamp of the last update (ISO date string)
	url: string;                  // URL to access the deployed application or model
	model_id: string;             // Unique identifier of the model being deployed
	user_username: string;        // Username of the user who created the deployment
	machine_config: MachineConfiguration; // Machine configuration for the deployment
	status: 'pending' | 'active' | 'failed' | 'completed'; // Current status of the deployment
	logs_url?: string;            // Optional URL to access deployment logs
	metrics?: Metrics;            // Optional metrics such as CPU, memory, and disk usage
	deployment_environment: 'Kubernetes' | 'VM' | 'SHPC'; // Where the deployment is hosted
	tags?: string[];              // Optional array of tags or keywords associated with the deployment
	[key: string]: unknown; // Index signature to handle dynamic properties
}
