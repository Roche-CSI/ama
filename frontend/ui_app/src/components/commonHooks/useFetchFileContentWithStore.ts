import { useStore, StoreNames } from "../../stores";
import { useFetchSignedUrlWithStore } from "./useFetchSignedUrlWithStore";
import FileHandler from "../../servers/asset_server/fileHandler";
import { fetchWithCache } from "../../stores/fetchWithCache";

/**
 * Custom hook to fetch file content and update in both store and state
 * @param {string} classId Class id of the object
 * @param {string} objectId Object id - if parsed from url, use decoded object id using decodeURIComponent
 */
export const useFetchFileContentWithStore = () => {
  const fileContentStore = useStore(StoreNames.fileContentStore, true);
  const { fetchSignedURL } = useFetchSignedUrlWithStore();

  const fetchFileContent = async (classId: string, objectId: string): Promise<any> => {
    // 1. Get signed URL and objectData (to get contentId) using the signed URL hook
    const parsed = await fetchSignedURL(classId, objectId);
    const contentId = parsed?.objectData?.content?.id;
    if (!contentId) throw new Error("No contentId found for file");
    // 2. Use fetchWithCache for cache-backed logic
    return fetchWithCache({
      store: fileContentStore,
      storeName: StoreNames.fileContentStore,
      key: contentId,
      fetchFn: async () => {
        if (!parsed.signedURL || !parsed.contentType) throw new Error("Missing signedURL or contentType for file download");
        const fileContent = await new FileHandler().download(parsed.signedURL, parsed.contentType);
        return {
          content: fileContent,
          timestamp: new Date().getTime(),
        };
      },
    });
  };

  return { fetchFileContent };
};
