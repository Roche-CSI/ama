/**
 * Note: WandDB JS API is server side only, returns 401 when trying to access from client side
 * Also: API is not documented and WandB mentioned that its early stage and not ready for production
 * We need to create a proxy server to access the API
 */
import {ApiFetcher} from "./ApiFetcher.ts";


export class WandbApi extends ApiFetcher{
	protected static endpoint = '/api/wandb';
	
	public static fetchAll(): Promise<unknown> {
		return super.fetchAll();
	}
	
	public static async fetchRun(runId: string): Promise<unknown> {
		return super.fetchById(runId)
	}
}
