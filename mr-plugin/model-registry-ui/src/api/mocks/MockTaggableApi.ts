// MockModelApi.ts
import ModelTaskTags from './data/model_tags/tasks/categories';
import ModelTags from "./data/model_tags";
import DatasetTags from "./data/dataset_tags";
import DeploymentTags from "./data/deployment_tags";
import {TaggableCategory} from "../data_types";
import {TaggableApi} from "../TaggableApi.ts";
import {EntityGroup, TaggableGroup} from "../data_types/taggable.ts";

const DATA_GROUPS: { [key: string]: EntityGroup } = {
	"models": ModelTags,
	"datasets": DatasetTags,
	"deployments": DeploymentTags
};


export class MockTaggableApi extends TaggableApi {
	protected static mockData: TaggableCategory[] = [];
	
	public static async fetchAll(): Promise<TaggableCategory[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : ModelTaskTags as unknown as TaggableCategory[];
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<TaggableCategory> {
		this.mockData = this.mockData.length > 0 ? this.mockData : ModelTaskTags as unknown as TaggableCategory[];
		const item: TaggableCategory | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
	
	public static async fetchByCategory(category: string): Promise<TaggableCategory[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : ModelTaskTags as unknown as TaggableCategory[];
		const items: TaggableCategory[] = this.mockData.filter(item => item.name === category);
		if (items.length === 0) {
			throw new Error(`No items found for category ${category} in mock data`);
		}
		return items;
	}
	
	public static async fetchByGroup(entity_group_name: string, group_name: string): Promise<TaggableGroup> {
		return this.v2(entity_group_name, group_name);
	}
	
	private static async v2(entity_group_name: string, group_name: string): Promise<TaggableGroup> {
		console.log('fetchByGroup mock data', entity_group_name, group_name);
		const data: EntityGroup = DATA_GROUPS[entity_group_name] as EntityGroup;
		const group: TaggableGroup | undefined = data.groups.find(group => group.name === group_name);
		return group!;
	}
	
	// private static async v1(entity_group_name: string, group_name: string): Promise<TaggableCategory[]> {
	// 	console.log('fetchByGroup mock data', entity_group_name, group_name);
	// 	this.mockData = this.mockData.length > 0 ? this.mockData : ModelTaskTags as unknown as TaggableCategory[];
	// 	const items: TaggableCategory[] = this.mockData.filter(item => item.group_name === group_name);
	// 	if (items.length === 0) {
	// 		throw new Error(`No items found for category ${group_name} in mock data`);
	// 	}
	// 	return items;
	// }
}
