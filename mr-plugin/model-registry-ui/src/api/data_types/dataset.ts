export interface DatasetInterface {
	id: string;                   // Unique identifier for the dataset
	name: string;                 // Name of the dataset
	description?: string;         // Optional description of the dataset
	created_at: string;           // Timestamp when the dataset was created (ISO date string)
	modified_at?: string;          // Optional timestamp of the last update (ISO date string)
	url: string;                  // URL where the dataset can be accessed or downloaded
	owner_username: string;       // Username of the dataset owner or creator
	size: string;                 // Size of the dataset (e.g., "1 GB", "500 MB")
	likes: number;                // Number of likes or upvotes for the dataset
	downloads: number;            // Number of downloads for the dataset
	format: string;               // Format of the dataset (e.g., "CSV", "JSON", "Parquet")
	num_records?: number;          // Number of records in the dataset
	tags?: string[];              // Optional array of tags or keywords associated with the dataset
	license: string;              // License under which the dataset is provided
	version: string;             // Version of the dataset
	metadata?: {
		[key: string]: unknown;       // Optional additional metadata as key-value pairs
	};
	[key: string]: unknown; // Index signature to handle dynamic properties
}
