import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";
import {isArray} from "lodash";
import {AssetActionInterface} from "./data_types/action";


export class AssetActionApi extends ApiFetcher {
	protected static endpoint = END_POINTS.ASSET_ACTION;
	
	public static async fetchAll(options?: { params?: Record<string, unknown> }): Promise<AssetActionInterface[]> {
		return super.fetchAll(options) as Promise<AssetActionInterface[]>;
	}
	
	public static async fetchById(id: string): Promise<AssetActionInterface> {
		return super.fetchById(id) as Promise<AssetActionInterface>;
	}
	
	// Function to filter models based on user input
	public static filter(query: string, data: AssetActionInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = isArray(query) ? query.join(",").toLowerCase() : query.toLowerCase();
		// Filter the models
		return data.filter(assetAction => {
			// Check if the query matches any field of the model
			return (
				assetAction.action.name.toLowerCase().includes(lowerQuery) ||
				assetAction.action.description.toLowerCase().includes(lowerQuery) ||
				assetAction.trigger_type?.toLowerCase().includes(lowerQuery)
				// model.model_name.toLowerCase().includes(lowerQuery) ||
				// model.description.toLowerCase().includes(lowerQuery)
				// model.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
				// model.license.toLowerCase().includes(lowerQuery) ||
				// model.author.toLowerCase().includes(lowerQuery) ||
				// model.language.toLowerCase().includes(lowerQuery) ||
				// model.tasks.some(task => task.toLowerCase().includes(lowerQuery)) ||
				// model.architecture.toLowerCase().includes(lowerQuery)
			);
		});
	}
}
