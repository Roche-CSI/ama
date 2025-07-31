import { ApiFetcher } from "./ApiFetcher.ts";
import { TaggableCategory } from "./data_types";
import { TaggableGroup } from "./data_types/taggable";
import { END_POINTS } from "./Urls";

export class TaggableApi extends ApiFetcher {
	protected static endpoint = END_POINTS.TAGGABLE_GROUP;

	// public static async fetchAll(): Promise<TaggableCategory[]> {
	// 	return super.fetchAll();
	// }

	public static async fetchById(id: string): Promise<TaggableCategory> {
		return super.fetchById(id);
	}

	public static async fetchByCategory(group_id: string, category: string): Promise<TaggableCategory[]> {
		console.log('fetchByCategory not implemented', group_id, category);
		throw Error('Not implemented');
	}

	public static async fetchByGroup(entity_group_name: string, group_name: string): Promise<TaggableGroup> {
		// Build the URL dynamically using entity_group_name and group_name
		const url = this.url(`${this.endpoint}/${entity_group_name}/${group_name}`);

		try {
			// Fetch data from the URL
			const data = await this.fetchFromURL(url);

			// Check if the response data is an array or object as needed
			if (!data || Array.isArray(data)) {
				throw new Error(`Invalid response for group ${group_name} in entity ${entity_group_name}`);
			}

			// Return the fetched TaggableGroup data
			return data as TaggableGroup;
		} catch (error) {
			// Handle and log any errors
			console.error("Error fetching data by group:", error);
			throw new Error(`Failed to fetch group '${group_name}' from '${entity_group_name}': }`);
		}
	}
}
