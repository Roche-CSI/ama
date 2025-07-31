import {AssetObjectInterface} from "./assetInterface";


export default class AssetObject implements AssetObjectInterface {
	private static ID_SEP: string = "::";
	id: string;
	url_id: number;
	content_id: string;
	content: object;
	created_by: string;
	created_at: string;
	
	constructor(data: object) {
		const parsed = data as AssetObjectInterface
		this.id = parsed.id;
		this.url_id = parsed.url_id;
		this.created_by = parsed.created_by;
		this.created_at = parsed.created_at;
		this.content_id = parsed.content.id
		this.content = parsed.content
	}
	
	/**
	 * returns the path to which the object points
	 */
	path(): string {
		return AssetObject.parseId(this.id)[1];
	}
	
	/**
	 * Returns content id and path of the object
	 */
	public static parseId(id: string) {
		return id.split(AssetObject.ID_SEP);
	}
	
	public static getContentId(id: string) {
		return AssetObject.parseId(id)[0]
	}
}
