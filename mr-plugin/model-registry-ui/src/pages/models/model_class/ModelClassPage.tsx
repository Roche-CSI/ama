/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useState} from "react";
import {useUrlParser} from "../../../hooks/useUrlParser.tsx";
import {AssetClassApi} from "../../../api";
import {AssetClassInterface} from "../../../api/data_types/assetClass.ts";
import {AddNewIcon, ModelIcon} from "../../../components/icons";
import {DropDown} from "../../../components/dropdown/DropDown.tsx";
import {BreadCrumbNav} from "../../../components/breadcrumbnav";
import {TagLabel} from "../model_view/ModelViewPage.tsx";
import {BreadCrumbSection} from "../../../components/breadcrumbnav/BreadCrumbNav";
import {SortAndFilterBar} from "../../../components/sortandfilterbar";
import {
	Layers,
	RocketIcon, FlaskConical, Archive, Ban, Cross, XCircle, Archive as ArchiveIcon
} from "lucide-react";
import {TabBar} from "../../../components/tabbar";
import {Asset} from "../../../api/data_types/asset";
import {AssetApi} from "../../../api/AssetApi";
import {GenericDataList} from "../../../components/datalist";
import AssetCard from "./cards/AssetCard";
import {Alert} from "../../../components/alert";
import {AssetInterface} from "../../../api/data_types/assetInterface.ts";

export const ModelClassPage: React.FC = () => {
	const {
		projectId,
		resourceType,
		classId,
		extras,
		queryParams,
		isValid,
		isResourceType
	} = useUrlParser();
	
	const [assetClass, setAssetClass] = useState<AssetClassInterface | null>(null);
	const [assetList, setAssetList] = useState<Asset[] | null>(null);
	
	const activeTab = queryParams.tab || "all";
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	
	console.log("Asset List: ", assetList);
	const releaseCount = assetList?.filter((asset: Asset) => asset.isReleased()).length;
	const experimentalCount = assetList?.filter((asset: Asset) => asset.isExperimental()).length;
	const obsoleteCount = assetList?.filter((asset: Asset) => asset.isObsolete()).length;
	const deprecatedCount = assetList?.filter((asset: Asset) => asset.isDeprecated()).length;
	const archivedCount = assetList?.filter((asset: Asset) => asset.isArchived()).length;
	
	useEffect(() => {
		if (classId) {
			AssetClassApi.fetchById(classId).then((response) => {
				setAssetClass(response);
			}).catch((error) => {
				setError(error);
			});
		}
	}, [classId]);
	
	// fetch asset-list
	useEffect(() => {
		if (classId) {
			console.log("Fetching assets for class: ", classId);
			AssetApi.fetchAll({params: {class_id: classId}}).then((response) => {
				const assets = response.data ?  response.data.map((asset: AssetInterface) => new Asset(asset)) : [];
				setAssetList(assets);
			}).catch((error) => {
				console.error("Error fetching assets: ", error);
				setError(error);
			});
		}
	}, [classId]);
	
	const NAV_SECTIONS = [
		{label: "Models", link: `${projectId}/models`},
		{label: assetClass?.title, link: ""},
	];
	
	const urlForTab = (tab: string) => {
		const params = {...queryParams, "tab": tab};
		const searchParams = new URLSearchParams(params).toString();
		return `${location.pathname}?${searchParams}`;
	};
	
	const TABS = [
		{
			name: "all",
			label: "Models",
			icon: <Layers className="size-4 mr-2 text-gray-400"/>,
			link: urlForTab("all"),
			bubble: assetList && assetList!.length > 0 ? {
				text: assetList.length.toString(),
				color: "bg-gray-300 text-primary-900"
			} : undefined
		},
		{
			name: "releases",
			label: "Releases",
			icon: <RocketIcon className="size-4 mr-2 text-gray-400"/>,
			link: urlForTab("releases"),
			bubble: releaseCount && releaseCount > 0 ? {
				text: releaseCount.toString(),
				color: "bg-blue-300 text-primary-900"
			} : undefined
		},
		{
			name: "experimental",
			label: "Experimental",
			icon: <FlaskConical className="size-3.5 mr-2 text-gray-400"/>,
			link: urlForTab("experimental"),
			bubble: experimentalCount && experimentalCount > 0 ? {
				text: experimentalCount.toString(),
				color: "bg-purple-300 text-purple-900"
			} : undefined
		},
		{
			name: "deprecated",
			label: "Deprecated",
			floatRight: true,
			icon: <Archive className="size-3.5 mr-2"/>,
			link: urlForTab("deprecated"),
			bubble: deprecatedCount && deprecatedCount > 0 ? {
				text: deprecatedCount.toString(),
				color: "bg-yellow-300 text-neutral-900"
			} : undefined
		},
		{
			name: "archived",
			label: "Archived",
			floatRight: true,
			icon: <ArchiveIcon className="size-3.5 mr-2"/>,
			link: urlForTab("archived"),
			bubble: archivedCount && archivedCount > 0 ? {
				text: archivedCount.toString(),
				color: "bg-orange-300 text-neutral-900"
			} : undefined
		},
		{
			name: "obsolete",
			label: "Obsolete",
			floatRight: true,
			icon: <XCircle className="size-3.5 mr-2"/>,
			link: urlForTab("obsolete"),
			bubble: obsoleteCount && obsoleteCount > 0 ? {
				text: obsoleteCount.toString(),
				color: "bg-red-400 text-white"
			} : undefined
		},
	];
	
	const dataView = () => {
		if (error) return <p>Error: {error}</p>;
		if (!assetList) return <p>Loading...</p>;
		if (assetList.length === 0) return <p>No models found</p>;
		
		const filteredList = searchTerm ? assetList.filter((asset: Asset) => asset.matchesSearch(searchTerm)) : assetList
		let renderList = []
		
		switch (activeTab) {
			case "all":
				renderList = filteredList;
				break;
			case "releases":
				renderList = filteredList.filter((asset: Asset) => asset.isReleased());
				break;
			case "experimental":
				renderList = filteredList.filter((asset: Asset) => asset.isExperimental());
				break;
			case "deprecated":
				renderList = filteredList.filter((asset: Asset) => asset.isDeprecated());
				break;
			case "archived":
				renderList = filteredList.filter((asset: Asset) => asset.isArchived());
				break;
			case "obsolete":
				renderList = filteredList.filter((asset: Asset) => asset.isObsolete());
				break;
			default:
				renderList = filteredList;
		}
		
		renderList.forEach((asset: Asset) => {
			const query = `version=${asset.leaf_version?.number}`;
			asset.identifier = asset.title ? asset.title : asset.alias ? asset.alias : asset.name(assetClass!.name);
			asset.link = `/${projectId}/models/${assetClass!.id}/${asset.id}`;
			asset.description = asset.description ? asset.description : "No description available";
		});
		
		return (
			<GenericDataList data={renderList}
			                 dataCardComponent={(item) =>
				                 <AssetCard item={item.item} className={assetClass!.name}/>}
			/>
		)
	}
	
	return (
		<React.Fragment>
			<div className='flex items-center justify-center'>
				<div className="w-full flex items-center justify-center bg-dark-color-100 shadow-sm">
					<div className="container mx-auto pt-6">
						<div className="flex">
							<BreadCrumbNav Icon={ModelIcon}
							               sections={NAV_SECTIONS as BreadCrumbSection[]}/>
						</div>
						<div className="mt-6">
							<SortAndFilterBar
								itemIcon={<ModelIcon className="size-4 mt-1 mr-1"/>}
								itemLabel={assetClass?.title || ""}
								itemCount={assetClass?.counter || 0}
								onSearch={setSearchTerm}
							/>
							<TabBar tabs={TABS} activeTab={activeTab ? activeTab.toLowerCase() : ""}/>
						</div>
					</div>
				</div>
			</div>
			
			<div className="container mx-auto pt-12">
				{
					assetClass && dataView()
				}
				{error && <Alert variant={"error"} title={"Oh snap! You got an error!"} description={[error]}/>}
			</div>
		</React.Fragment>
	);
};
