/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState} from "react";
import {TagLabel} from "../../../../../components/tagview";
import {ModelInterface} from "../../../../../api/data_types";
import {ArtifactsIcon, CodeIcon, DeploymentsIcon, TaskIcon} from "../../../../../components/icons";

const GROUPS = [
	{
		name: 'code',
		icon: <CodeIcon className="size-4" />,
		link: './code'
	},
	{
		name: 'datasets',
		icon: <ArtifactsIcon className="size-4 p-0.5" />,
		link: './datasets'
	},
	{
		name: 'tasks',
		icon: <TaskIcon className="size-4" />,
		link: './tasks'
	},
	{
		name: 'deployments',
		icon: <DeploymentsIcon className="size-4 py-0.5" />,
		link: './deployments'
	}
];


export const ModelMetaSection: React.FC = ({model}: {model: ModelInterface}) => {
	
	const [selectedGroup, setSelectedGroup] = useState<string>(GROUPS[0]);
	
	const handleGroupSelection = (name: string) => {
		setSelectedGroup(name);
	}
	
	return (
		<React.Fragment>
			<div className="">
				{
					GROUPS.map((group, index) => {
						return <TagLabel key={index}
						                 name={group.name}
						                 icon={group.icon}
						                 selected={group.name === selectedGroup}
						                 onClick={handleGroupSelection}/>
					})
				}
			</div>
			<React.Fragment>
				<h5 className="font-medium text-gray-500 mt-4 mb-2 text-xs">
					{"Code"}
				</h5>
				<div className="gap-x-8 gap-y-4 space-y-2">
					{/*{*/}
					{/*	tags.map((tag, index) => {*/}
					{/*		const selected = category.selected ? tag.id in category.selected : false;*/}
					{/*		return (*/}
					{/*			<button*/}
					{/*				key={index}*/}
					{/*				className={`btn btn-xs mr-1 font-medium ${selected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}*/}
					{/*				onClick={() => handleTagClick(tag)}*/}
					{/*			>*/}
					{/*				<span>{tag.name}</span>*/}
					{/*				{selected && <XIcon className="h-4 w-4"/>}*/}
					{/*			</button>*/}
					{/*		);*/}
					{/*	})}*/}
				</div>
			</React.Fragment>
		</React.Fragment>
	)
	
}
