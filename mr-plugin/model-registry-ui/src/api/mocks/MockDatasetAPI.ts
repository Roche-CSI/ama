import MockData from './data/datasets_mock_data.json'
import {DatasetInterface} from "../data_types";
import {DatasetApi} from "../DatasetApi.ts";

export class MockDatasetAPI extends DatasetApi {
	protected static mockData: DatasetInterface[] = []
	
	public static async fetchAll(): Promise<DatasetInterface[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : MockData as unknown as DatasetInterface[]
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<DatasetInterface> {
		this.mockData = this.mockData.length > 0 ? this.mockData : MockData as unknown as DatasetInterface[];
		const item: DatasetInterface | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
}
