// MockModelApi.ts
import { MockFetcher } from './MockFetcher';
import MockData from './data/projects_mock_data.json'
import {ProjectInterface} from "../data_types";

export class MockProjectApi extends MockFetcher {
	protected static mockData: ProjectInterface[] = [];
	
	public static async fetchAll(): Promise<ProjectInterface[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : MockData as unknown as ProjectInterface[];
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<ProjectInterface> {
		this.mockData = this.mockData.length > 0 ? this.mockData : MockData as unknown as ProjectInterface[];
		const item: ProjectInterface | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
}
