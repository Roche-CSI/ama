
export interface ActionProviderInterface {
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


export interface ActionInterface {
    id: string,
    provider: ActionProviderInterface;
    name: string;
    title: string
    description: string;
    api_config: object
    input_schema: object;
    request_template: object
}

export interface AssetActionInterface {
    id: string;                         // The unique identifier for the action instance
    asset_id: string;            // Reference to the asset (e.g., model registry or some unique asset ID)
    action: ActionInterface;              // The action associated with this asset (foreign key to `Action`)
    config: Record<string, never>; // The specific configuration for this action instance (can be any valid JSON structure)
    trigger_type: string;       // Type of trigger for the action (e.g., 'manual', 'automatic', 'scheduled')
    trigger_condition: Record<string, never> | null; // Conditions for automatic triggers (nullable, can be any valid JSON structure)
    created_at: string;         // The timestamp when the action was created
}


export interface ActionRunInterface {
    asset_action: AssetActionInterface;           // The asset action this run is associated with
    description: string | null;          // Description of the action run (nullable)
    state: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'retry_pending'; // Current state of the action run
    attempt_number: number;             // The current attempt number (default: 1)
    max_retries: number;                // Maximum number of retry attempts (default: 3)
    started_at: string | null;          // Start time of the action run (nullable, ISO string format)
    completed_at: string | null;        // Completion time of the action run (nullable, ISO string format)
    input_data: Record<string, any>;    // Actual input data used in the action run (JSON object)
    output_data: Record<string, any> | null; // Results/response from the action run (nullable)
    error_message: string | null;       // Error message (nullable)
    error_type: string | null;          // Type of error (nullable)
    provider_response: Record<string, any> | null; // Raw response from the provider (nullable)
    retry_strategy: Record<string, any> | null;   // Retry strategy (e.g., {'backoff': 'exponential', 'initial_delay': 5}) (nullable)
    next_retry_at: string | null;       // Scheduled time for next retry attempt (nullable, ISO string format)
    cancelled_by: string | null;        // User who cancelled the action (nullable)
    cancel_reason: string | null;       // Reason for cancellation (nullable)
    essential_logs: LogEntry[];         // Execution logs (array of essential log entries)
    detailed_logs: Record<string, any>; // Detailed logs (JSON object, e.g., bucket URL)
}

export interface LogEntry {
    timestamp: string;      // Timestamp of the log entry (ISO string format)
    level: 'info' | 'warn' | 'error'; // Log level (e.g., info, warn, error)
    message: string;        // Log message
    metadata: Record<string, any>; // Metadata associated with the log (JSON object)
}

