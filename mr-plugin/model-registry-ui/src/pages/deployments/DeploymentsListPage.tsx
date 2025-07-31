/* eslint-disable no-mixed-spaces-and-tabs */
import { USE_MOCK_API } from "../../config.ts";
import { DeploymentApi, useData, UseDataReturnType } from "../../api";
import { DeploymentInterface, TaggableGroup } from "../../api/data_types";
import { useFilteredData, useTaggedData } from "../../hooks";
import { MockDeploymentAPI } from "../../api/mocks/MockDeploymentAPI.ts";
import { useProject } from "../../contexts/projectContext/useProject";
import { GenericDataList, GenericTagList } from "../../components/datalist";
import { DeploymentCard } from "./DeploymentCard.tsx";
import { SearchResults } from "../../hooks/useSearch.tsx";
import { ModelIcon } from "../../components/icons";
import { urlForResource } from "../../utils";
import { useMemo, useState } from "react";
import { MockTaggableApi } from "../../api/mocks/MockTaggableApi.ts";
import { TaggableApi } from "../../api/TaggableApi.ts";

// Choose the appropriate data fetcher based on configuration
const api = USE_MOCK_API ? MockDeploymentAPI : DeploymentApi;
const tagApi = USE_MOCK_API ? MockTaggableApi : TaggableApi;
const GROUPS = ['models', 'tasks', 'environments'];

interface Deployment extends DeploymentInterface {
	projectId: string;
}

export const DeploymentsListPage = () => {
	// We keep memoization out of the hook so that each component can have flexibility to memoize as needed
	// LEFT SECTION
	const fetchPromise: Promise<DeploymentInterface[]> = useMemo(() => api.fetchAll(), []); // Ensure fetchAll is only called once
	const fetchedData: UseDataReturnType<DeploymentInterface[]> = useData<DeploymentInterface[]>(fetchPromise);
	const { activeProjectId } = useProject();

	// search by tags first
	const taggedData: SearchResults<DeploymentInterface, TaggableGroup> = useTaggedData(fetchedData.data, api.filterTags.bind(api));
	const filteredData: SearchResults<DeploymentInterface, string> = useFilteredData<DeploymentInterface>(taggedData.items, api.filter.bind(api));

	// RIGHT SECTION DATA
	const [activeGroupName, setActiveGroupName] = useState<string>(GROUPS[0]);
	const tagPromise = useMemo(() => tagApi.fetchByGroup("Deployments", activeGroupName), [activeGroupName]);
	const fetchedTagData = useData<TaggableGroup>(tagPromise);

	const renderData: Deployment[] = filteredData.items.map((data: DeploymentInterface) => ({
		...data,
		projectId: activeProjectId,
	}));

	const routeGenerator = (resource: string, id: string): string => {
		return urlForResource(resource, id, activeProjectId);
	}

	const handleTagSelectionChange = (group: TaggableGroup) => {
		// filter models based on selected tags
		taggedData.handleSearch(group);
	}

	const handleGroupSelectionChange = (name: string) => {
		// fetch tags for the selected group
		setActiveGroupName(name);
	}

	if (!activeProjectId) {
		return <p>No active project found</p>;
	}

	const dataView = () => {
		if (fetchedData.loading) return <p>Loading...</p>;
		if (fetchedData.error) return <p>Error: {fetchedData.error}</p>;
		return (
			<GenericDataList data={renderData}
				dataCardComponent={DeploymentCard}
				filterBarIcon={ModelIcon}
				filterBarLabel={"Models"}
				onRightButtonClick={() => { }}
				onFilter={filteredData.handleSearch}
				routeGenerator={routeGenerator} />
		)
	}

	const tagView = () => {
		if (fetchedTagData.loading) return <p>Loading...</p>;
		if (fetchedTagData.error) return <p>Error: {fetchedTagData.error}</p>;
		return (
			<GenericTagList groupNames={GROUPS}
				activeGroupName={activeGroupName}
				groupData={fetchedTagData.data}
				onSelectedTagsChange={handleTagSelectionChange}
				onSelectedGroupChange={handleGroupSelectionChange} />
		)
	}

	return (
		<div className="container justify-center px-6 py-8">
			<div className="flex flex-row gap-4">
				<div className="left basis-3/4 gap-2 self-start">
					{dataView()}
				</div>
				{/* RIGHT SECTION */}
				<div className="right basis-1/4">
					{tagView()}
				</div>
			</div>
		</div>
	);
};
