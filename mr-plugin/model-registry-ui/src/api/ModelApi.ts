import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";
import {ModelInterface, TaggableGroup} from "./data_types";
import {isArray} from "lodash";

export class ModelApi extends ApiFetcher {
	protected static endpoint = END_POINTS.ML_MODEL;
	
	public static async fetchById(id: string): Promise<ModelInterface> {
		return super.fetchById(id);
	}
	
	// Function to filter models based on user input
	public static filter(query: string, data: ModelInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = isArray(query) ? query.join(",").toLowerCase() : query.toLowerCase();
		// Filter the models
		return data.filter(model => {
			// Check if the query matches any field of the model
			return (
				// model.model_name.toLowerCase().includes(lowerQuery) ||
				// model.description.toLowerCase().includes(lowerQuery)
				// model.model_id.toLowerCase().includes(lowerQuery) ||
				// model.model_name.toLowerCase().includes(lowerQuery) ||
				// model.description.toLowerCase().includes(lowerQuery)
				// model.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
				// model.license.toLowerCase().includes(lowerQuery) ||
				// model.author.toLowerCase().includes(lowerQuery) ||
				// model.language.toLowerCase().includes(lowerQuery) ||
				// model.tasks.some(task => task.toLowerCase().includes(lowerQuery)) ||
				// model.architecture.toLowerCase().includes(lowerQuery)
				model.tasks.some(task => task.toLowerCase().includes(lowerQuery))
			);
		});
	}
	
	public static filterTags(group: TaggableGroup, data: ModelInterface[]): ModelInterface[] {
		// flatten and collect all tags
		const searchTags: string[] = group.categories.flatMap(category => category.tags.map(tag => tag.name));
		// Convert the list of tags to lowercase for case-insensitive comparison
		if (searchTags.length === 0) {
			return data;
		}
		
		// Filter the models
		const result: ModelInterface[] = data.filter((model: ModelInterface) => {
			// Check if any of the model's tags match any of the provided tags
			console.log("Model tags: ", model.tags);
			const tags: string[] = (model[group.name] as string[] || []).map((tag: string) => tag.toLowerCase());
			for (const tag of tags) {
				if (searchTags.includes(tag)) {
					return true;
				}
			}
			return false;
		});
		console.log("Filtered models: ", searchTags, result);
		return result;
	}
}
