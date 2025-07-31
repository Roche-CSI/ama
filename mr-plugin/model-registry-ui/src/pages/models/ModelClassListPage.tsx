/* eslint-disable no-mixed-spaces-and-tabs */
import {urlForResource} from "../../utils";
import React, {useMemo, useState} from "react";
import {USE_MOCK_API} from "../../config";
import {MockModelApi} from "../../api/mocks";
import {useData, UseDataReturnType} from "../../api";
import {AssetClassApi} from "../../api";
import {ModelInterface, TaggableGroup} from "../../api/data_types";
import {AddNewIcon, ModelIcon} from "../../components/icons";
import {useSearch, useTaggedData} from "../../hooks";
import {useProject} from "../../contexts/projectContext/useProject";
import {SearchResults} from "../../hooks/useSearch";
import {GenericDataList} from "../../components/datalist";
import {useLocation, useNavigate} from "react-router-dom";
import {SortAndFilterBar} from "../../components/sortandfilterbar";
import {AssetClassCard} from "./AssetClassCard";
import {TabBar} from "../../components/tabbar";
import useFavorites from "../../hooks/useFavorites";
import {
	AlertTriangle,
	Menu,
	Star,
	XCircle,
	Lock,
	Archive,
	ClipboardList,
	Database, Shield, Languages
} from "lucide-react";
import {StatusEnums} from "../../api/Status.ts";
import {AssetClassInterface} from "../../api/data_types/assetClass";
import {ModelClass} from "../../api/data_types/modelClass";
import Taggable, {TagGroup} from "../search/taggable";
import {GenericTagList} from "../search/GenericTagList";

// Choose the appropriate data fetcher based on configuration
const api = USE_MOCK_API ? MockModelApi : AssetClassApi;

const GROUPS = [
	{name: 'tasks', label: 'Tasks', icon: ClipboardList},  // Better represents a task list
	{name: 'datasets', label: 'Datasets', icon: Database}, // More appropriate for data collections
	{name: 'licenses', label: 'Licenses', icon: Shield},   // Common icon for licensing/protection
	{name: 'languages', label: 'Languages', icon: Languages}, // Specific icon for languages
];

const dateFromTimeStamp = (timestamp: string): Date => {
	return new Date(timestamp.replace("-", ":").replace("-", ":"));
}

export const ModelClassListPage = () => {
	
	// check if user passed in a search query
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const refresh = searchParams.get('refresh') || false;
	const tabName = searchParams.get('tab') || 'all';
	const {activeProjectId} = useProject()
	
	// we keep memoization out of the hook so that each component can have flexibility to memoize as needed
	//LEFT SECTION DATA
	const fetchPromise: Promise<AssetClassInterface[]> = useMemo(() => api.fetchAll({
		params: {
			class_type: "model",
			project: activeProjectId
		}
	}), [refresh]); // Ensure fetchAll is only called once
	const fetchData: UseDataReturnType<AssetClassInterface[]> = useData<AssetClassInterface[]>(fetchPromise);
	fetchData.data = (fetchData.data || []).map((model: AssetClassInterface) => new ModelClass(model));
	
	//RIGHT SECTION DATA
	const [activeGroupName, setActiveGroupName] = useState<string>("tasks");
	const [selectedGroup, setSelectedGroup] = useState(null);
	
	const navigate = useNavigate()
	
	const tasks = ModelClass.getTaskList(fetchData.data);
	const datasets = ModelClass.getDatasetList(fetchData.data);
	const languages = ModelClass.getLanguageList(fetchData.data);
	const licenses = ModelClass.getLicenseList(fetchData.data);
	
	const tagGroups = useMemo(() => ({
		"tasks": Taggable.defaultTagGroup({
			name: 'tasks',
			label: 'Tasks',
			category: Taggable.defaultTagCategory({
				name: 'tasks',
				tags: tasks
			})
		}),
		"datasets": Taggable.defaultTagGroup({
			name: 'datasets',
			label: 'Datasets',
			category: Taggable.defaultTagCategory({
				name: 'datasets',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: datasets,
			}),
		}),
		"languages": Taggable.defaultTagGroup({
			name: 'languages',
			label: 'Languages',
			category: Taggable.defaultTagCategory({
				name: 'languages',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: languages,
			}),
		}),
		"licenses": Taggable.defaultTagGroup({
			name: 'licenses',
			label: 'Licenses',
			category: Taggable.defaultTagCategory({
				name: 'licenses',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: licenses,
			}),
		}),
	}), [fetchData]);
	
	console.log("tagGroups: ", tagGroups);
	
	// favorite data
	const {favorites, toggleFavorite, isFavorite} = useFavorites<AssetClassInterface>();
	// search by tags first
	const taggedData: SearchResults<AssetClassInterface, TaggableGroup> = useTaggedData(fetchData.data || [], api.filterTags.bind(api));
	// filter by names next
	const filteredData: SearchResults<AssetClassInterface, string> = useSearch<AssetClassInterface, string>({
		data: taggedData.items || [],
		filterFunction: (searchTerm: string, items: AssetClassInterface[]) => {
			return items.filter(item =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(item.create_by || "").toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
	});
	
	// const handleTagSelectionChange = (group: TaggableGroup) => {
	// 	// filter models based on selected tags
	// 	taggedData.handleSearch(group);
	// }
	//
	// const handleGroupSelectionChange = (name: string) => {
	// 	// fetch tags for the selected group
	// 	setActiveGroupName(name);
	// }
	
	const handleTagSelectionChange = (group: TagGroup) => {
		setSelectedGroup(group);
	}
	const handleGroupSelectionChange = (name: string) => {
		setActiveGroupName(name);
		setSelectedGroup(tagGroups[name] || null);
	}
	
	const routeGenerator = (resource: string, id: string): string => {
		return urlForResource(resource, id, activeProjectId);
	}
	
	const createNewModel = () => {
		navigate('./new');
	}
	
	if (!activeProjectId) {
		return <p>No active project found</p>;
	}
	
	// count the number of favorites
	const favoriteCount = Object.values(favorites).filter(fav => fav.class_type === "model").length;
	const privateCount = filteredData.items.filter(model => model.status === StatusEnums.PRIVATE).length;
	const deprecatedCount = filteredData.items.filter(model => model.status === StatusEnums.DEPRECATED).length;
	const obsoleteCount = filteredData.items.filter(model => model.status === StatusEnums.OBSOLETE).length;
	const archivedCount = filteredData.items.filter(model => model.status === StatusEnums.ARCHIVED).length;
	
	const TABS = [
		{
			name: 'all',
			icon: <Menu className="size-3.5 mr-2"/>,
			label: "All",
			link: location.pathname,
			filter: (item: AssetClassInterface) => item,
			bubble: filteredData.items.length > 0 ? {
				text: filteredData.items.length.toString(),
				color: "bg-gray-300 text-primary-900"
			} : undefined
		},
		{
			name: 'favorites',
			icon: <Star className="size-3.5 mr-2"/>,
			label: "Favorites",
			link: `${location.pathname}?tab=favorites`,
			filter: (item: AssetClassInterface) => isFavorite(item.id),
			bubble: favoriteCount > 0 ? {
				text: favoriteCount.toString(),
				color: "bg-indigo-300 text-indigo-900"
			} : undefined
		},
		{
			name: 'private',
			icon: <Lock className="size-3.5 mr-2"/>,
			label: "Private",
			link: `${location.pathname}?tab=private`,
			floatRight: true,
			filter: (item: AssetClassInterface) => item.status === StatusEnums.PRIVATE,
			bubble: privateCount > 0 ? {
				text: privateCount.toString(),
				color: "bg-blue-300 text-primary-900"
			} : undefined
		},
		
		{
			name: 'deprecated',
			icon: <AlertTriangle className="size-3.5 mr-2"/>,
			label: "Deprecated",
			floatRight: true,
			link: `${location.pathname}?tab=deprecated`,
			filter: (item: AssetClassInterface) => item.status === StatusEnums.DEPRECATED,
			bubble: deprecatedCount > 0 ? {
				text: deprecatedCount.toString(),
				color: "bg-yellow-300 text-neutral-900"
			} : undefined
		},
		{
			name: 'archived',
			icon: <Archive className="size-3.5 mr-2"/>,
			label: "Archived",
			floatRight: true,
			link: `${location.pathname}?tab=archived`,
			filter: (item: AssetClassInterface) => item.status === StatusEnums.ARCHIVED,
			bubble: archivedCount > 0 ? {
				text: archivedCount.toString(),
				color: "bg-orange-400 text-white"
			} : undefined
		},
		{
			name: 'obsolete',
			icon: <XCircle className="size-3.5 mr-2"/>,
			label: "Obsolete",
			floatRight: true,
			link: `${location.pathname}?tab=obsolete`,
			filter: (item: AssetClassInterface) => item.status === StatusEnums.OBSOLETE,
			bubble: obsoleteCount > 0 ? {
				text: obsoleteCount.toString(),
				color: "bg-red-400 text-white"
			} : undefined
		},
	];
	const activeTab = TABS.filter(tab => tab.name === tabName)[0] || TABS[0];
	
	const onFavorite = (item: AssetClassInterface) => {
		toggleFavorite(item);
	}
	
	const renderModelList: AssetClassInterface[] = filteredData.items.filter(item => activeTab.filter(item)).map((model: AssetClassInterface) => ({
		...model,
		projectId: activeProjectId
	}));
	
	// sort by created date, latest first
	renderModelList.sort((a, b) => dateFromTimeStamp(b.created_at).getTime() - dateFromTimeStamp(a.created_at).getTime());
	
	const filterByTag = (groupName: string, tags: string[]) => {
		switch (activeGroupName) {
			case "tasks":
				// filter by tasks
				return ModelClass.filterByTask(renderModelList, tags);
			case "datasets":
				// filter by datasets
				return ModelClass.filterByDataset(renderModelList, tags);
			case "languages":
				// filter by languages
				return ModelClass.filterByLanguage(renderModelList, tags);
			default:
				return ModelClass.filterByLicense(renderModelList, tags);
		}
	}
	
	const dataView = () => {
		if (fetchData.loading) return <p>Loading...</p>;
		if (fetchData.error) return <p>Error: {fetchData.error}</p>;
		const selectedTags = selectedGroup ? selectedGroup.categories.flatMap(category => Object.keys(category.selected || {})) : [];
		console.log("selectedTags: ", selectedTags);
		const renderData = selectedTags.length > 0 ? filterByTag(activeGroupName, selectedTags) : renderModelList;
		return (
			<GenericDataList data={renderData}
			                 dataCardComponent={({item, routeGenerator}) => <AssetClassCard item={item}
			                                                                                routeGenerator={routeGenerator}
			                                                                                isFavorite={isFavorite(item.id)}
			                                                                                onFavoriteClicked={onFavorite}
			                 />}
			                 filterBarIcon={<ModelIcon className="size-4 mt-1 mr-1"/>}
			                 filterBarLabel={"Models"}
			                 onRightButtonClick={createNewModel}
			                 onFilter={filteredData.handleSearch}
			                 routeGenerator={(item) => `/${activeProjectId}/models/${item.id}`}
			                 rightButtonIcon={<AddNewIcon className="size-5"/>}
			                 rightButtonLabel={"New Model"}/>
		)
	}
	
	const tagView = () => {
		
		// doing a hack here to make sure tagGroups are updated with selection data, for some reason the tagGroups are not updated
		// works fine in the SearchResultsPage.tsx
		// todo: fix this
		if (selectedGroup) {
			tagGroups[selectedGroup.name] = selectedGroup;
		}
		const groupData = tagGroups[activeGroupName];
		// console.log("groupData: ", groupData);
		return (
			<GenericTagList groups={GROUPS}
			                activeGroupName={activeGroupName}
			                groupData={groupData}
			                onSelectedTagsChange={handleTagSelectionChange}
			                onSelectedGroupChange={handleGroupSelectionChange}/>
		)
	}
	
	return (
		// PAGE OUTER CONTAINER
		<React.Fragment>
			<div className='flex items-center justify-center'>
				<div className="w-full flex items-center justify-center bg-dark-color-100 shadow-sm">
					<div className="container mx-auto pt-2">
						{/*// SUB NAVIGATION*/}
						<div className="pt-8">
							<SortAndFilterBar
								itemIcon={<ModelIcon className="size-4 mt-1 mr-1"/>}
								itemLabel={"Model Collections"}
								itemCount={renderModelList ? renderModelList.length : 0}
								onSearch={filteredData.handleSearch}
								onRightButtonClick={createNewModel}
								placeholder={`Filter by name`}
								rightButtonLabel={"New Collection"}
								rightButtonIcon={<AddNewIcon className="size-5"/>}
							/>
							<div className="mt-6">
								<TabBar tabs={TABS} activeTab={activeTab.name}/>
							</div>
							{/*<article className="prose mb-4">*/}
							{/*	<p className="font-light text-sm">*/}
							{/*		Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi*/}
							{/*		exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.*/}
							{/*	</p>*/}
							{/*</article>*/}
						</div>
					</div>
				</div>
			</div>
			<div className='flex items-center justify-center mt-6'>
				<div className="container mx-auto pt-2">
					{/*PAGE INNER CONTAINER*/}
					<div className="flex flex-row gap-4 pt-2">
						{/*LEFT SECTION*/}
						<div className="left basis-3/4 gap-2 self-start">
							{/*TOP BAR WITH SEARCH AND SORT*/}
							{dataView()}
						</div>
						{/*LEFT SECTION END*/}
						{/*RIGHT SECTION*/}
						<div className="right basis-1/4 pl-6">
							{tagView()}
						</div>
						{/*RIGHT SECTION END*/}
					</div>
					{/*PAGE INNER CONTAINER END*/}
				</div>
			</div>
		</React.Fragment>
	);
}


