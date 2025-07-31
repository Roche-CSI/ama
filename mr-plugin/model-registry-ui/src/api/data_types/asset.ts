/* eslint-disable no-mixed-spaces-and-tabs */
import {StatusEnums} from "../Status";
import {AssetVersion} from "./assetVersion";
import {AssetInterface} from "./assetInterface.ts";

export enum AssetPhase {
	NOT_APPLICABLE = 0,
	DRAFT = 1,
	EXPERIMENTAL = 2,
	BETA = 3,
	RELEASED = 4,
	STABLE = 5
}

export class Asset implements AssetInterface {
	id: string;
	alias: string;
	asset_class: string;
	title: string;
	description: string;
	owner: string;
	refs: any = {};
	seq_id: number;
	top_hash: string;
	versions: AssetVersion[] = [];
	leaf_version: any | null;
	created_by: string;
	created_at: string;
	modified_at: string;
	modified_by: string;
	all_objects: any = {};
	// active_version_id: number;
	root_version_id: number;
	leaf_version_id: number;
	status: number;
	metadata: object;
	tags: string[];
	phase: number;
	attributes: any;
	details: any;
	
	constructor(data: any) {
		const parsed = data as AssetInterface;
		this.id = parsed.id;
		this.seq_id = parsed.seq_id;
		this.owner = parsed.owner;
		this.title = parsed.title;
		this.description = parsed.description;
		this.created_by = parsed.created_by;
		this.created_at = parsed.created_at;
		this.modified_at = parsed.modified_at;
		this.modified_by = parsed.modified_by;
		this.top_hash = parsed.top_hash;
		this.refs = parsed.refs || {};
		this.alias = parsed.alias;
		this.asset_class = parsed.asset_class;
		this.all_objects = parsed.all_objects;
		this.leaf_version = parsed.leaf_version;
		this.versions = parsed.versions?.sort(version => (version as any).id).map((version: any) => new AssetVersion(version));
		// this.active_version_id = this.versions[this.versions.length - 1].id;
		this.root_version_id = parsed.root_version_id;
		this.leaf_version_id = parsed.leaf_version_id;
		this.status = parsed.status;
		this.metadata = parsed.metadata;
		this.attributes = parsed.attributes;
		this.tags = parsed.tags || [];
		this.phase = parsed.phase;
		this.details = {}; // will get assigned by subsequent api calls
 	}
	
	public static getName(className: string, seqId: number) {
		return `${className}/${seqId.toString()}`;
	}
	
	public name(className: string): string {
		return Asset.getName(className, this.seq_id);
	}
	
	public versionName(className: string, version: string): string {
		return `${this.name(className)}/${version}`;
	}
	
	public getNumObjects(leaf = false): number {
		if (leaf) {
			return this.leaf_version?.num_objects || 0;
		}
		return this.all_objects ? Object.keys(this.all_objects).length : this.leaf_version?.num_objects!;
	}
	
	public getSize(leaf = false): number {
		if (leaf) {
			return this.leaf_version?.size || 0;
		}
		if (this.all_objects && this.all_objects.length > 0) {
			return this.all_objects.reduce((total: number, object: any) => {
				return total + (object.content?.size || 0);
			}, 0);
		} else {
			return this.leaf_version?.num_objects || 0;
		}
	}
	
	/**
	 * Checks if the asset matches the given search term
	 * Search is case-insensitive and matches partial strings
	 * @param searchTerm - The term to search for
	 * @returns boolean - True if the asset matches the search term
	 */
	public matchesSearch(searchTerm: string): boolean {
		// Convert search term to lowercase for case-insensitive comparison
		const term = searchTerm.toLowerCase().trim();
		
		// Return false if search term is empty
		if (!term) return false;
		
		// Fields to check for matches
		const searchableFields = [
			this.title,
			this.description,
			this.seq_id?.toString(),
			this.alias,
			this.created_by,
			this.modified_by,
			...this.tags
		];
		
		// Check if any field matches the search term
		return searchableFields.some(field => {
			if (field) {
				return field.toString().toLowerCase().includes(term);
			}
			return false;
		});
	}
	
	/**
	 * Static method to filter an array of assets based on a search term
	 * @param assets - Array of assets to filter
	 * @param searchTerm - The term to search for
	 * @returns Asset[] - Array of assets that match the search term
	 */
	public static filterAssets(assets: Asset[], searchTerm: string): Asset[] {
		return assets.filter(asset => asset.matchesSearch(searchTerm));
	}
	
	public getHandle(className: string) {
		return `${className}/${this.alias || this.seq_id}`;
	}
	
	public isObsolete(): boolean {
		return this.status === StatusEnums.OBSOLETE;
	}
	
	public isDeprecated(): boolean {
		return this.status === StatusEnums.DEPRECATED;
	}
	
	public isReleased(): boolean {
		return this.phase === AssetPhase.RELEASED;
	}
	
	public isExperimental(): boolean {
		return this.phase === AssetPhase.EXPERIMENTAL;
	}
	
	public isArchived(): boolean {
		return this.status === StatusEnums.ARCHIVED || this.status === StatusEnums.ARCHIVE_FLAGGED;
	}
}
