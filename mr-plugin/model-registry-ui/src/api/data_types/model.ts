// TODO: Important: We need to enforce this schema for assets metadata in Model Asset Class


import {AssetInterface} from "./assetInterface.ts";

/**
 * TODO: IMPORTANT:
 * Models are backed by assets but at the sametime models need to contain additional information.
 * The model-registry cli needs to add this information when a user checks in a model.
 * To discuss what more information we need to add to the model table in addition to the asset.
 **/

export interface ModelDetails {
	//
}


export interface ModelInterface extends AssetInterface {

}
