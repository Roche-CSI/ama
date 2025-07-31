import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";
import {isArray} from "lodash";
import {ExperimentInterface} from "./data_types/experiment";


export class ModelExperimentApi extends ApiFetcher {
	protected static endpoint = END_POINTS.MODEL_EXPERIMENT;
	
	public static async fetchAll(options?: { params?: Record<string, never> }): Promise<ExperimentInterface[]> {
		return super.fetchAll(options) as Promise<ExperimentInterface[]>;
	}
	
	public static async fetchById(id: string): Promise<ExperimentInterface> {
		return super.fetchById(id) as Promise<ExperimentInterface>;
	}
	
	// Function to filter models based on user input
	public static filter(query: string, data: ExperimentInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = isArray(query) ? query.join(",").toLowerCase() : query.toLowerCase();
		// Filter the models
		return data.filter(exp => {
			// Check if the query matches any field of the model
			return (
				exp.experiment_id.toLowerCase().includes(lowerQuery)
				// provider.name.toLowerCase().includes(lowerQuery) ||
				// provider.description?.toLowerCase().includes(lowerQuery)
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
