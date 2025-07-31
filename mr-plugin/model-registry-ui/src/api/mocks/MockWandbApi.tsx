import {WanDBData} from './data/wandb'
import {DatasetInterface} from "../data_types";
import {WandbApi} from "../WandbApi.ts";


export class MockWandbApi extends WandbApi {
	protected static mockData: any[] = []
	
	public static async fetchAll(): Promise<any[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : WanDBData as unknown
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<unknown> {
		this.mockData = this.mockData.length > 0 ? this.mockData : WanDBData as unknown;
		const item: DatasetInterface | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
}
