import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";
import {isArray} from "lodash";
import {ActionRunInterface} from "./data_types/action";


export class ActionRunApi extends ApiFetcher {
	protected static endpoint = END_POINTS.ACTION_RUN;
	
	public static async fetchAll(options?: { params?: Record<string, unknown> }): Promise<ActionRunInterface> {
		return super.fetchAll(options) as Promise<ActionRunInterface[]>;
	}
	
	public static async fetchById(id: string): Promise<ActionRunInterface> {
		return super.fetchById(id) as Promise<ActionRunInterface>;
	}
	
	// Function to filter models based on user input
	public static filter(query: string, data: ActionRunInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = isArray(query) ? query.join(",").toLowerCase() : query.toLowerCase();
		// Filter the models
		return data.filter(run => {
			// Check if the query matches any field of the model
			return (
				run.description?.toLowerCase().includes(lowerQuery)
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
