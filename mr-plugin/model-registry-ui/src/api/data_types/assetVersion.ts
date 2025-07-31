import {AssetInterface, AssetVersionInterface, Patch} from "./assetInterface.ts";

export interface diffItem {
	path: string;
	category: "added" | "altered" | "removed";
	id: string | null;
	prevId: string | null;
	children?: any[];
}

export interface diffObject {
	[key: string]: diffItem;
}

export class AssetVersion implements AssetVersionInterface {
	id: number;
	commit_hash: string;
	commit_message: string;
	number: string;
	parent?: AssetVersion; // parent version
	patch: Patch;
	created_by: string;
	created_at: string;
	tags: string[];
	asset: any // AssetPage, not imported to avoid circular reference
	size?: number;
	num_objects?: number;
	objects?: object[];
	
	constructor(data: object, asset?: any) {
		const parsed = data as AssetVersionInterface;
		this.id = parsed.id;
		this.commit_hash = parsed.commit_hash;
		this.commit_message = parsed.commit_message;
		this.number = parsed.number;
		this.patch = parsed.patch;
		this.created_by = parsed.created_by;
		this.created_at = parsed.created_at
		this.tags = parsed.tags ? parsed.tags : [];
		this.size = parsed.size;
		this.num_objects = parsed.num_objects;
		this.asset = asset;
		if (parsed.parent) {
			this.parent = new AssetVersion(parsed.parent);
		}
	}
	
	public static resolveVersions({versions, target} : {
		versions: AssetVersionInterface[],
		target: AssetVersionInterface
	}): Set<string> {
		const result = new Set<string>();
		// applyPatch from the earliest version
		versions.sort((a: AssetVersionInterface, b: AssetVersionInterface) => a.id - b.id)
		versions.forEach(version => {
			if (version.id <= target.id) {
				AssetVersion.applyPatch(result, version.patch);
			}
		})
		return result
	}
	
	public static applyPatch(base: Set<any>, patch: object) {
		let added: string[] = (patch as any)["added"];
		let removed: string[] = (patch as any)["removed"];
		added.forEach(object_id => base.add(object_id));
		removed.forEach(object_id => base.delete(object_id));
	}
	
	/**
	 * Compute object difference between base version and compare version
	 * @param base {AssetVersion}
	 * @param compare {AssetVersion}
	 * @returns an object {diffObject: {path: diffItem}, diffArray: diffItem[]}
	 */
	public static computeDiff(base: AssetVersion | null, compare: AssetVersion | null): any {
		let baseObjects: object[] = (!base || !base.objects) ? [] : base.objects;
		let compareObjects: object[] = (!compare || !compare.objects)? [] :compare.objects;
		let diffObject: diffObject = {}
		baseObjects.forEach((obj: any) => {
			const path: string = AssetObject.parseId(obj.id)[1]
			diffObject[path] = {path: path, category: "removed", prevId: obj.id, id: null}
		})
		compareObjects.forEach((obj: any) => {
			const path: string = AssetObject.parseId(obj.id)[1]
			const baseItem: diffItem | undefined = diffObject[path]
			if (baseItem && obj.id === baseItem.prevId) {
				delete diffObject[path]
			} else if (baseItem && obj.id !== baseItem.prevId) {
				let alteredItem: diffItem =
					{path: path, category: "altered", prevId: baseItem.prevId, id: obj.id}
				diffObject[path] = alteredItem
			} else {
				diffObject[path] = {path: path, category: "added", prevId: null, id: obj.id}
			}
		})
		return {
			diffObject: diffObject,
			diffArray: Object.values(diffObject)
		}
	}
	
	
	public static updateVersionObjects({asset, version}: {
		asset: AssetInterface,
		version: AssetVersion | null
	}) {
		if (version && (!version.objects || version.objects.length === 0)) {
			const objectIds: Set<string> = AssetVersion.resolveVersions({
				versions: asset.versions,
				target: version
			});
			const objects = new Set<any>();
			asset.all_objects.forEach((obj: any) => {
				if (objectIds.has(obj.id)) {
					objects.add(obj);
				}
			})
			version.objects = Array.from(objects);
		}
	}
}
