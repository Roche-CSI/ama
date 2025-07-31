import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";
import {isArray} from "lodash";
import {MonitoringProviderInterface} from "./data_types/monitoring.ts";



export class MonitoringProviderApi extends ApiFetcher {
	protected static endpoint = END_POINTS.MONITORING_PROVIDER;
	
	public static async fetchAll(options?: { params?: Record<string, never> }): Promise<MonitoringProviderInterface[]> {
		return super.fetchAll(options) as Promise<MonitoringProviderInterface[]>;
	}
	
	public static async fetchById(id: string): Promise<MonitoringProviderInterface> {
		return super.fetchById(id) as Promise<MonitoringProviderInterface>;
	}
	
	// Function to filter models based on user input
	public static filter(query: string, data: MonitoringProviderInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = isArray(query) ? query.join(",").toLowerCase() : query.toLowerCase();
		// Filter the models
		return data.filter(provider => {
			// Check if the query matches any field of the model
			return (
				provider.title.toLowerCase().includes(lowerQuery) ||
				provider.name.toLowerCase().includes(lowerQuery) ||
				provider.description?.toLowerCase().includes(lowerQuery)
			);
		});
	}
}
