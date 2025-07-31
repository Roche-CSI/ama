import {ApiFetcher} from "./ApiFetcher";
import {END_POINTS} from "./Urls";

export class AssetDetailApi extends ApiFetcher {
	protected static endpoint = END_POINTS.ASSET_DETAIL;
}
