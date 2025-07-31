import URLs from "./Urls";

interface UrlParams {
	endPoint: string;
	id?: string;
	queryParams?: Record<string, never>;
}

export abstract class ApiFetcher {
	protected static endpoint: string;
	
	// protected static url(endPoint: string, id: string = ''): string {
	// 	return new URLs({ endPoint: endPoint }).route(id);
	// }
	
	protected static url({endPoint, id, queryParams}: UrlParams): string {
		const baseUrl = new URLs({endPoint: endPoint}).route(id);
		
		if (!queryParams) {
			return baseUrl;
		}
		
		const searchParams = new URLSearchParams();
		Object.entries(queryParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, value.toString());
			}
		});
		
		const queryString = searchParams.toString();
		return queryString ? `${baseUrl}?${queryString}` : baseUrl;
	}
	
	public static async fetchFromURL(url: string): Promise<never> {
		const response = await fetch(url,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${url}, response status: ${response.status}`);
		}
		return response.json() as Promise<never>;
	}
	
	public static async fetchAll(options?: { params?: Record<string, never> }): Promise<never> {
		return this.fetchFromURL(this.url({
			endPoint: this.endpoint,
			queryParams: options?.params
		}));
	}
	
	public static async fetchById(id: string): Promise<any> {
		const res: Promise<any> = this.fetchFromURL(this.url({endPoint: this.endpoint, id: id}));
		// check if type is array or object
		if (Array.isArray(res)) {
			throw new Error(`Failed to fetch data by id: ${id}, response is an array`);
		}
		return res as Promise<any>;
	}
	
	public static async fetchByGroup(entity_group_name: string, group_name: string): Promise<never> {
		const res: Promise<never> = this.fetchFromURL(this.url(this.endpoint, `${entity_group_name}/${group_name}`))
		if (Array.isArray(res)) {
			return res;  // Return an array of groups if multiple groups are returned
		}
		return res;
	}
	
	public static async post(data: object): Promise<never> {
		
		const url = this.url({endPoint: this.endpoint});
		
		const response = await fetch(url,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${url}, response status: ${response.status}`);
		}
		
		return response.json() as Promise<never[]>;
	}
	
	public static async put(id: string, data: never, options?: { params?: Record<string, never> }): Promise<never> {
		const url = this.url({
			endPoint: this.endpoint,
			id: id,
			queryParams: options?.params
		});
		const response = await fetch(url,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${url}, response status: ${response.status}`);
		}
		return response.json() as Promise<never>;
	}
	
}
