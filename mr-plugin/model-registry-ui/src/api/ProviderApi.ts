import {ApiFetcher} from "./ApiFetcher.ts";
import {ComputeProvider} from "./data_types/computeProvider.ts";

export class ProviderApi extends ApiFetcher {
	protected static endpoint = '/api/providers';
	
	public static async fetchAll(): Promise<ComputeProvider[]> {
		return super.fetchAll();
	}
	
	public static async fetchById(id: string): Promise<ComputeProvider> {
		return super.fetchById(id);
	}
	
	public static async fetchByName(name: string): Promise<ComputeProvider> {
		return super.fetchById(name);
	}
	
}
