
export const urlForResource = (resource: string, modelId: string, projectId: string): string => {
	if (!projectId) {
		throw new Error("No active project found");
	}
	return `/${projectId}/${resource}/${modelId}`;
}
