import { useStore, StoreNames } from "../../stores";
import AssetObject from "../../servers/asset_server/assetObject";
import AssetURLs from "../../servers/asset_server/assetURLs";
import { ParsedObject } from "../objectBrowser/ObjectBrowser";
import { fetchWithCache } from "../../stores/cacheFirstFetch";

/**
 * Custom hook to fetch signedGCSURL and update in both store and state
 * @param {string} classId Class id of the object
 * @param {string} objectId Object id - if parsed from url, use decoded object id using decodeURIComponent
 */
export const useFetchSignedUrlWithStore = () => {
  const signedURLStore = useStore(StoreNames.signedURLStore, true);

  const getSignedGCSURL = async (classId: string, objectId: string): Promise<any> => {
    const url = new AssetURLs().gcs_signing_route();
    return AssetObject.get(url, { class_id: classId, object_id: objectId });
  }

  const fetchSignedURL = async (classId: string, objectId: string): Promise<ParsedObject> => {
    const key: string = `${classId}/${objectId}`;
    return fetchWithCache({
      store: signedURLStore,
      storeName: StoreNames.signedURLStore,
      key,
      fetchFn: async () => {
        const data = await getSignedGCSURL(classId, objectId);
        if (data.error) {
          console.log(data.error);
          throw new Error("Error fetching signed URL");
        }
        const parsed: ParsedObject = {
          signedURL: data.signed_url,
          contentType: AssetObject.getContentType(objectId, data.object.content.mime_type),
          fileName: AssetObject.parseId(objectId)[1],
          objectData: data.object,
          timestamp: new Date().getTime(),
        };
        return parsed;
      },
    });
  }

  return { fetchSignedURL };
};