/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
	Link,
	FileText,
	Clock,
	Images,
	Menu,
	Layers, Waypoints, Container, Bolt, Files, FlaskConical, Tag, SquareCheckBig
} from 'lucide-react';

import {SearchResultCard} from "./SearchResultCard";
import {DataGrid} from "../../components/datagrid";
import {GenericTagList} from "./GenericTagList";
import {TagFilterBar} from "./TagGrid";
import {SearchBar} from "./SearchBar";
import {ElasticSearch} from "./ElasticSearch";
import AssetSearchResult, {AssetEntry} from "./AssetEntry";
import {Spinner} from "../../components/spinner";
import Taggable, {TagGroup} from "./taggable";
import URLs, {END_POINTS} from "../../api/Urls";
import {useNavigate, useLocation} from 'react-router-dom';
import {useUser} from "../../contexts/userContext/useUser";


const GROUPS = [
	{name: 'highlights', label: 'Matches', icon: SquareCheckBig},
	{name: 'tags', label: 'Relevant Tags', icon: Tag},
];

const TABS = [
	{name: 'all', icon: <Menu className="size-4 mr-2 text-neutral-400"/>, label: "All", link: "/assets/all"},
	{name: 'data', icon: <Layers className="size-3.5 mr-2 text-neutral-400"/>, label: "Datasets", link: "/assets/data"},
	{
		name: 'models',
		icon: <Waypoints className="size-4 mr-2 text-neutral-400"/>,
		label: "Models",
		link: "/assets/models"
	},
	{
		name: 'containers',
		icon: <Container className="size-4 mr-2 text-neutral-400"/>,
		label: "Containers",
		link: "/assets/containers"
	},
	{
		name: 'configuration',
		icon: <Bolt className="size-4 mr-2 text-neutral-400"/>,
		label: "Configurations",
		link: "/assets/configuration"
	},
	{name: 'images', icon: <Images className="size-4 mr-2 text-neutral-400"/>, label: "Images", link: "/assets/images"},
	{
		name: 'reports',
		icon: <Files className="size-4 mr-2 text-neutral-400"/>,
		label: "Reports",
		link: "/assets/reports"
	},
	{
		name: 'experimental',
		icon: <FlaskConical className="size-4 mr-2 text-neutral-400"/>,
		label: "Experimental",
		link: "/assets/experimental"
	},
];

// const SEARCH_ENDPOINT = new URLs({endPoint: END_POINTS.SEARCH});
const SEARCH_ENDPOINT = "http://localhost:5001/api/v1/asset-server/search";
const elasticSearch = new ElasticSearch<AssetEntry>(SEARCH_ENDPOINT)
const emptyResponse = ElasticSearch.emptyResponse;

const SearchResultsPage = () => {
	
	const navigate = useNavigate();
	const location = useLocation();
	const urlParams = new URLSearchParams(location.search);
	const query = decodeURIComponent(urlParams.get('q'));
	// const projects = urlParams.get('projects').split(',');
	const projects = ["03c02c9d-3f7b-44b0-871d-0e7cd0d8d5ce"];
	const tabs = urlParams.get('tab').split(',');
	
	// console.log("Query: ", query ," Projects: ", projects, " Tabs: ", tabs);
	
	const {userData} = useUser()
	console.log("User Data: ", userData);
	
	// const [searchQuery, setSearchQuery] = useState(query || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [searchResults, setSearchResults] = useState(emptyResponse);
	
	const [activeGroupName, setActiveGroupName] = useState('highlights');
	const [selectedGroup, setSelectedGroup] = useState(null);
	
	const searchBarRef = useRef(null);
	
	const initialParams = useMemo(() => ({
		query: query,
		filters: {
			project_id: projects,
			class_type: tabs[0] !== 'all' ? tabs : []
		},
		username: userData.username,
		// Add other necessary parameters here
	}), [query]);
	
	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const results = await elasticSearch.search(initialParams);
			setSearchResults(results);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('An error occurred'));
		} finally {
			setLoading(false);
		}
	}, [elasticSearch, query]);
	
	
	useEffect(() => {
		fetchData();
	}, [fetchData]);
	
	
	const handleSearch = (search) => {
		// If the search query is the same as current, do nothing
		if (search === query) {
			return;
		}
		
		// Create new URLSearchParams based on current params
		const newParams = new URLSearchParams(location.search);
		newParams.set('q', encodeURIComponent(search));
		
		// Keep other existing parameters
		if (projects.length > 0) {
			newParams.set('projects', projects.join(','));
		}
		if (tabs.length > 0) {
			newParams.set('tab', tabs);
		}
		// Update the URL without reloading the page
		navigate({
			pathname: location.pathname,
			search: newParams.toString()
		}, {replace: true});
		
		searchBarRef.current?.focus();
	};
	
	// collect all tags from search results
	const assetSearch = useMemo(() => new AssetSearchResult({
		total: searchResults.total,
		page: searchResults.page,
		page_size: searchResults.page_size,
		results: searchResults.results
	}), [searchResults]);
	
	const tagGroups = useMemo(() => ({
		"tags": Taggable.defaultTagGroup({
			name: 'tags',
			label: 'Tags',
			category: Taggable.defaultTagCategory({
				name: 'tags',
				tags: assetSearch.extractUniqueTags()
			})
		}),
		"highlights": Taggable.defaultTagGroup({
			name: 'highlights',
			label: 'Highlights',
			category: Taggable.defaultTagCategory({
				name: 'highlights',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: assetSearch.extractUniqueHighlightKeys(['class_type', 'project_id']),
				tagFormatter: (tag: string) => {
					const comps = tag.split('.');
					if (comps.length === 1) return comps[0];
					// search highlights can have .ngram or .text suffix
					if (comps[comps.length - 1] === 'ngram' || comps[comps.length - 1] === 'text') {
						return comps.splice(0, comps.length - 1).join('.');
					}
					return tag;
				}
			}),
		}),
		"metadata": []
	}), [searchResults]);
	
	console.log("Tag Groups: ", tagGroups);
	// console.log("Selected Group: ", selectedGroup);
	
	const handleTagSelectionChange = (group: TagGroup) => {
		console.log("Selected Group: ", group);
		setSelectedGroup(group);
	}
	const handleGroupSelectionChange = (name: string) => {
		setActiveGroupName(name);
		setSelectedGroup(tagGroups[name] || null);
	}
	
	// console.log("highlights: ", tagGroups["highlights"]);
	
	const groupData = tagGroups[activeGroupName];
	const TagView = () => {
		return (
			<GenericTagList groups={GROUPS}
			                activeGroupName={activeGroupName}
			                groupData={groupData}
			                onSelectedTagsChange={handleTagSelectionChange}
			                onSelectedGroupChange={handleGroupSelectionChange}/>
		)
	}
	
	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<Spinner message={"Loading"}/>
			</div>
		)
	}
	
	if (error) {
		return <div className="text-red-600">{error.message}</div>
	}
	const filtered = selectedGroup ? assetSearch.filterResults([selectedGroup]).results : searchResults.results ? searchResults.results : [];
	
	const routeGen = (resource: any, id: string) => {
		return `/asset_class?project_id=${projectId}&name=${resource.name}&tab=assets`
	}
	
	const highlightKeys = selectedGroup && selectedGroup!.name === "highlights" ? Taggable.highlightKeysForGroup(selectedGroup) : [];
	// console.log("selectedGroup, Highlight key: ", selectedGroup, highlightKeys);
	
	const DataView = () => {
		const selectedTags = selectedGroup ? selectedGroup.categories.flatMap(category => Object.keys(category.selected || {})) : [];
		// console.log("Selected Tags: ", selectedTags);
		const Card = ({item}) => {
			return (
				<SearchResultCard item={item} highlightKeys={highlightKeys} selectedTags={selectedTags}/>
			)
		}
		
		return (
			<React.Fragment>
				<DataGrid items={filtered}
				          itemCard={Card}
				          routeGenerator={routeGen}
				          cols={1}/>
			</React.Fragment>
		)
	}
	
	return (
		<div className="min-h-screen bg-white">
			<header className="border-b border-gray-200 bg-base-200">
				<div className="container mx-auto py-12 flex items-center justify-center">
					<SearchBar searchString={query}
					           onSearch={handleSearch}
					           inputRef={searchBarRef}/>
				</div>
				{/*<div className="container mx-auto pt-6 flex items-center">*/}
				{/*	<TabBar tabs={TABS} activeTab={"all"}/>*/}
				{/*</div>*/}
			</header>
			
			<main className="container mx-auto mt-6">
				<div className="mb-2 flex items-center">
					<div>
						<h1 className="text-xl font-bold">Search Results</h1>
					</div>
					<div className="ml-6">
						<TagFilterBar handleSearch={() => {
						}} placeholder={"Filter Assets"}/>
					</div>
				</div>
				<div>
					{searchResults && searchResults.total > 0 && (
						<div className="text-sm text-gray-600">
							Found {searchResults.total} Assets
							({(searchResults.responseTimeMs / 1000).toFixed(2)} seconds)
						</div>
					)}
				</div>
				<div className="flex flex-row gap-4 pt-2">
					{/*LEFT SECTION*/}
					<div className="left basis-3/4 gap-2 self-start">
						<DataView/>
					</div>
					<div className="right basis-1/4 pl-6">
						<TagView/>
					</div>
				</div>
			</main>
			
			<footer className="bg-[#F2F2F2] py-4">
				<div className="container mx-auto px-4 flex justify-between items-center">
					<div className="flex space-x-4">
						<a href="#" className="text-sm text-gray-600 hover:underline flex items-center">
							<FileText size={16} className="mr-1"/> Policies
						</a>
						<a href="#" className="text-sm text-gray-600 hover:underline flex items-center">
							<Link size={16} className="mr-1"/> Related Links
						</a>
					</div>
					<a href="#" className="text-sm text-gray-600 hover:underline flex items-center">
						<Clock size={16} className="mr-1"/> Search History
					</a>
				</div>
			</footer>
		</div>
	);
};

export default SearchResultsPage;
