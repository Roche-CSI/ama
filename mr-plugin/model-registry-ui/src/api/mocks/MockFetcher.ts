// MockFetcher.ts
import {ApiFetcher} from "../ApiFetcher.ts";

export abstract class MockFetcher extends ApiFetcher{
	protected static mockData: any = [];
	
	public static async fetchAll(): Promise<any[]> {
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<any> {
		const item = this.mockData.find((item: any): boolean => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
}
