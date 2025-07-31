import {ProviderApi} from "../ProviderApi.ts";

export class MockProviderApi extends ProviderApi {
	protected static endpoint = '/api/providers';
	
	public static async fetchAll(): Promise<ProjectInterface[]> {
		return super.fetchAll();
	}
	
	public static async fetchById(id: string): Promise<ProjectInterface> {
		return super.fetchById(id);
	}
	
	public static async fetchByName(name: string): Promise<ProjectInterface> {
		return super.fetchById(name);
	}
	
}
