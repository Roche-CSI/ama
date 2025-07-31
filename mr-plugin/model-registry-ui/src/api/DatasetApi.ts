import { ApiFetcher } from "./ApiFetcher";
import { DatasetInterface, TaggableGroup } from "./data_types";
import { END_POINTS } from "./Urls";

export class DatasetApi extends ApiFetcher {
	protected static endpoint = END_POINTS.DATASET;

	public static async fetchById(id: string): Promise<DatasetInterface> {
		return super.fetchById(id);
	}

	public static filter(query: string, data: DatasetInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = query.toLowerCase();
		// Filter the models
		return data.filter(data => {
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
				data.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
			);
		});
	}

	public static filterTags(group: TaggableGroup, data: DatasetInterface[]): DatasetInterface[] {
		// flatten and collect all tags
		const searchTags: string[] = group.categories.flatMap(category => category.tags.map(tag => tag.name));
		// Convert the list of tags to lowercase for case-insensitive comparison
		if (searchTags.length === 0) {
			return data;
		}

		// Filter the models
		const result = data.filter((data: DatasetInterface) => {
			// Check if any of the model's tags match any of the provided tags
			const tags: string[] = (data[group.name] as string[] || []).map((tag: string) => tag.toLowerCase());
			for (const tag of tags) {
				if (searchTags.includes(tag)) {
					return true;
				}
			}
			return false;
		});
		return result;
	}
}
