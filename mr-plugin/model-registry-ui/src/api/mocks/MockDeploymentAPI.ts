// MockModelApi.ts
import MockData from './data/deployments_mock_data.json'
import {DeploymentInterface} from "../data_types";
import {DeploymentApi} from "../DeploymentApi.ts";

export class MockDeploymentAPI extends DeploymentApi {
	protected static mockData: DeploymentInterface[] = []
	
	public static async fetchAll(): Promise<DeploymentInterface[]> {
		this.mockData = this.mockData.length > 0 ? this.mockData : MockData as unknown as DeploymentInterface[]
		return this.mockData;
	}
	
	public static async fetchById(id: string): Promise<DeploymentInterface> {
		this.mockData = this.mockData && this.mockData.length > 0 ? this.mockData : MockData as unknown as DeploymentInterface[];
		const item: DeploymentInterface | undefined = this.mockData.find(item => item.id === id);
		if (!item) {
			throw new Error(`Item with id ${id} not found in mock data`);
		}
		return item;
	}
}
