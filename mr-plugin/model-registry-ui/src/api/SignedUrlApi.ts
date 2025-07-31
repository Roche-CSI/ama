import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";


export class SignedUrlApi extends ApiFetcher {
	protected static endpoint = END_POINTS.SIGNED_URL;
	
	public static async fetchFromURL(url: string): Promise<any> {
		const response = await fetch(url,
			{
				method: 'GET',
			});
		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${url}, response status: ${response.status}`);
		}
		return response;
	}
	
}
