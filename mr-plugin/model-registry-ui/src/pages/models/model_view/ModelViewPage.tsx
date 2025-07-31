/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useMemo, useState} from 'react';
import {ModelInterface} from "../../../api/data_types";
import {
	ActionsIcon,
	AlertsIcon,
	ArtifactsIcon, BranchIcon,
	CodeSquareIcon,
	DeploymentsIcon,
	DiscussionsIcon,
	ExperimentIcon,
	FilesIcon,
	GovernanceIcon,
	LineageIcon,
	MetadataIcon,
	ModelCardIcon,
	ModelIcon,
	MonitoringIcon,
	ReleaseIcon, ThreeBarsIcon
} from "../../../components/icons";
import {DropDown} from "../../../components/dropdown/DropDown.tsx";
import {USE_MOCK_API} from "../../../config.ts";
import {MockModelApi} from "../../../api/mocks";
import {ModelApi, useData, UseDataReturnType} from "../../../api";
import {ModelDetails} from "../../../api/mocks/data/model_details";
import {ModelTabView} from "./details";
import {BreadCrumbNav} from "../../../components/breadcrumbnav";
import {TabBar} from "../../../components/tabbar";
import {useUrlParser} from "../../../hooks/useUrlParser.tsx";
import {AssetApi} from "../../../api/AssetApi.ts";
import DropDownMenu from "./DropDownMenu.tsx";
import {Shield} from "lucide-react";
import {useProject} from "../../../contexts/projectContext/useProject.ts";
import {Asset} from "../../../api/data_types/asset.ts";

const TABS = [
	{name: 'card', icon: <ModelCardIcon className="size-4 mr-1"/>, label: "Card", link: "./card"},
	{name: 'files', icon: <ArtifactsIcon className="size-4 mr-1 p-0.5"/>, label: "Files", link: "./files"},
	{name: 'meta', icon: <MetadataIcon className="size-4 mr-1 p-0.5"/>, label: "Meta", link: "./meta"},
	{name: 'lineage', icon: <LineageIcon className="size-5 mr-1"/>, label: "Lineage", link: "./lineage"},
	{name: 'actions', icon: <ActionsIcon className="size-4 mr-1"/>, label: "Actions", link: "./actions"},
	{name: 'experiments', icon: <ExperimentIcon className="size-4 mr-1"/>, label: "Experiments", link: "./experiments"},
	{name: 'monitoring', icon: <MonitoringIcon className="size-4 mr-1"/>, label: "Monitoring", link: "./monitoring"},
	{name: 'governance', icon: <Shield className="size-4 mr-1"/>, label: "Governance", link: "./governance"},
	{
		name: 'alerts',
		icon: <AlertsIcon className="size-4 mr-1"/>,
		label: "2",
		link: "./alerts",
		accented: true,
		floatRight: true
	},
	{
		name: 'discussions',
		icon: <DiscussionsIcon className="size-4 mr-1"/>,
		label: "10",
		link: "./discussions",
		floatRight: true,
		accented: true
	},
];

const versions = [
	{id: 'v1.0', name: 'v1.0'},
	{id: 'v1.1', name: 'v1.1'},
	{id: 'v2.0', name: 'v2.0'},
	{id: 'v2.3', name: 'v2.3'},
	{id: 'v2.4', name: 'v2.4'}
];

const api = USE_MOCK_API ? MockModelApi : AssetApi;
const ACTIONS = [
	{"name": "Publish Request", "id": "pr"},
	{"name": "Release", "id": "release"},
	{"name": "Pre-Release", "id": "release"},
	{"name": "Deprecate", "id": "deprecate"},
	{"name": "Deploy", "id": "deploy"},
	{"name": "Delete", "id": "delete"},
]

const DEPLOY_OPTIONS = [
	{"name": "aws", "id": "aws"},
	{"name": "gcs", "id": "gcs"},
]


export const ModelViewPage: React.FC = () => {
	// const [activeTab, setActiveTab] = useState<string>('card');
	const {
		projectId,
		extras,
	} = useUrlParser();
	
	// get the last segment of the URL
	const modelId = extras[0];
	const activeTabName = extras[1] || 'card';
	const promise = useMemo(() => api.fetchById(modelId), [modelId]); // Ensure fetchAll is only called once
	const {data, loading, error}: UseDataReturnType<ModelInterface[]> = useData<ModelInterface[]>(promise);
	const {projects} = useProject();
	
	const onSelectedVersionChange = (item: any) => {}
	
	if (!data) {
		return <div>Loading...</div>
	}
	
	const asset = new Asset(data);
	const currentProject = projects.find(project => project.id === projectId);
	
	const NAV_SECTIONS = [
		{label: currentProject.title, link: "/models"},
		{label: "Models", link: "/models"},
		{label: data.title, link: "./card"},
	];
	
	const menuItems = [
		{id: "publish", label: "Publish Request", icon: <CodeSquareIcon className="size-5"/>},
		{id: "release", label: "Release", icon: <ReleaseIcon className="size-5"/>},
		{id: "pre_release", label: "Pre-Release", icon: <ReleaseIcon className="size-5"/>},
		{id: "deprecate", label: "Deprecate", icon: <ThreeBarsIcon className="size-5"/>},
		{id: "deploy", label: "Deploy", icon: <DeploymentsIcon className="size-5"/>},
		{id: "delete", label: "Delete", icon: <ThreeBarsIcon className="size-5"/>},
	];
	
	const onMenuClick = (item: any) => {
		console.log("Item clicked", item);
	}
	
	return (
		<div className="">
			<div className='flex items-center justify-center'>
				<div className="w-full flex items-center justify-center bg-dark-color-100 shadow-sm">
					<div className="container mx-auto">
						{/*HEADER*/}
						<div className="px-4 mt-6">
							<div className="flex items-center gap-1">
								<BreadCrumbNav Icon={ModelIcon}
								               sections={NAV_SECTIONS}
								               badge={<div className="ml-4"><TagLabel tag={"Experimental"}/></div>}
								               // extra={
									           //     <div className="ml-2">
										       //         <DropDown title={"Version"}
										       //                   options={versions}
										       //                   onSelect={onSelectedVersionChange}
										       //                   icon={null}
										       //                   className={"font-light text-xs px-2.5 rounded  border bg-base-400 py-0.5 border border-[#64748b40] mr-2"}/>
									           //     </div>
								               // }
								/>
								<div className="ml-auto flex items-center gap-2">
									{/*<DropDown title={"Release"}*/}
									{/*          options={RELEASE_OPTIONS}*/}
									{/*          stateless={true}*/}
									{/*          onSelect={() => {*/}
									{/*          }}*/}
									{/*          icon={<CodeSquareIcon className="size-5 p-1"/>}*/}
									{/*          className="v-center text-sm bg-gray-100 hover:bg-gray-500 hover:text-white"/>*/}
									{/*<DropDown title={"Actions"}*/}
									{/*          options={ACTIONS}*/}
									{/*          onSelect={() => {*/}
									{/*          }}*/}
									{/*          stateless={true}*/}
									{/*          icon={<ThreeBarsIcon className="size-5"/>}*/}
									{/*          className="btn btn-sm btn-primary flex flex-col justify-center items-center"/>*/}
								</div>
								<DropDownMenu menuItems={menuItems}
								              className="btn btn-sm btn-secondary flex flex-col justify-center items-center"
								              onMenuClick={onMenuClick}
								/>
								{/*<div className="dropdown dropdown-end">*/}
								{/*	<div tabIndex={0} role="button" className="btn btn-sm btn-secondary m-1 border border-red-500">*/}
								{/*		<ThreeBarsIcon className="size-5"/>Actions*/}
								{/*	</div>*/}
								{/*	<div*/}
								{/*		tabIndex={0}*/}
								{/*		className="dropdown-content card card-compact bg-white z-[1] w-64 p-2 shadow">*/}
								{/*		<div className="card-body">*/}
								{/*			<h6 className="text-gray-500">Actions</h6>*/}
								{/*			<ul>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Publish Request*/}
								{/*				</li>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Release*/}
								{/*				</li>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Pre-Release*/}
								{/*				</li>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Deprecate*/}
								{/*				</li>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Deploy*/}
								{/*				</li>*/}
								{/*				<li className='flex py-2 cursor-pointer'><ThreeBarsIcon*/}
								{/*					className="size-5 mr-2"/>Delete*/}
								{/*				</li>*/}
								{/*			</ul>*/}
								{/*		</div>*/}
								{/*	</div>*/}
								{/*</div>*/}
							</div>
							{/*HEADER END*/}
							{/*TAGS*/}
							<div className='mb-6'>
								{
									data?.tags.map((tag, index) => (
										<TagLabel key={index} tag={tag}/>
									))}
							</div>
							<div>
								<TabBar tabs={TABS} activeTab={activeTabName}/>
							</div>
						</div>
					</div>
				
				</div>
			</div>
			{/*TAGS END*/}
			<div className='flex items-center justify-center bg-base-100'>
				<div className="container mx-auto pt-2">
					<div className="gap-4 pt-6">
						<ModelTabView model={asset} tab={activeTabName}/>
					</div>
				</div>
			</div>
		</div>
	);
};

export const TagLabel: React.FC<{ tag: string }> = ({tag}) => {
	const specialTagColors: Record<string, string> = {
		"experimental": "bg-yellow-100 text-yellow-800 border border-yellow-300",
		"released": "bg-green-100 text-green-800 border border-green-300",
		"deprecated": "bg-red-100 text-red-800 border border-red-300",
		"pre-release": "bg-blue-100 text-blue-800 border border-blue-300",
	};
	const className: string = "inline-flex items-center rounded-md px-2.5 py-0.5 mr-1 text-xs bg-base-300 font-light";
	return <span className={`${className} ${specialTagColors[tag.toLocaleLowerCase()] || ""}`}>{tag}</span>
}
