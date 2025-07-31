import { ApiFetcher } from "./ApiFetcher.ts";
import { DeploymentInterface, TaggableGroup } from "./data_types";
import { END_POINTS } from "./Urls";

export class DeploymentApi extends ApiFetcher {
	protected static endpoint = END_POINTS.DEPLOYMENT;

	public static async fetchById(id: string): Promise<DeploymentInterface> {
		return super.fetchById(id);
	}

	// Function to filter models based on user input
	public static filter(query: string, data: DeploymentInterface[]) {
		//todo: implement filtering on the server
		const lowerQuery = query.toLowerCase();
		// Filter the models
		return data.filter(deploy => {
			// Check if the query matches any field of the model
			return (
				deploy.name.toLowerCase().includes(lowerQuery)
			);
		});
	}


	public static filterTags(group: TaggableGroup, data: DeploymentInterface[]): DeploymentInterface[] {
		// flatten and collect all tags
		const searchTags: string[] = group.categories.flatMap(category => category.tags.map(tag => tag.name));
		// Convert the list of tags to lowercase for case-insensitive comparison
		if (searchTags.length === 0) {
			return data;
		}

		// Filter the models
		return data.filter((data: DeploymentInterface) => {
			// Check if any of the model's tags match any of the provided tags
			const tags: string[] = (data[group.name] as string[] || []).map((tag: string) => tag.toLowerCase());
			for (const tag of tags) {
				if (searchTags.includes(tag)) {
					return true;
				}
			}
			return false;
		});
	}
}
