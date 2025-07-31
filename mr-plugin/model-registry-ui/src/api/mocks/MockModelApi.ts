// MockModelApi.ts
import MockData from './data/models_mock_data.json';
import {ModelDetails} from "./data/model_details";
import {ModelInterface} from "../data_types";
import {ModelApi} from "../ModelApi.ts";

export class MockModelApi extends ModelApi {
	protected static mockData: ModelInterface[] = [];
	
	public static async fetchAll(): Promise<ModelInterface[]> {
		this.mockData = this.mockData && this.mockData.length > 0 ? this.mockData : MockData as unknown as ModelInterface[];
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<ModelInterface> {
		this.mockData = this.mockData && this.mockData.length > 0 ? this.mockData : MockData as unknown as ModelInterface[];
		const item: ModelInterface | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		console.log("item", ModelDetails);
		return ModelDetails as unknown as ModelInterface;
	}
}
