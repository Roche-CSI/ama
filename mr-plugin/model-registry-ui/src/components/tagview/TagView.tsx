/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState} from "react";
import {TaggableCategory, TaggableGroup} from "../../api/data_types";
import {TagGrid} from "../taggrid/TagGrid.tsx";
import {toTitleCase} from "../../utils";

interface TagViewProps {
	groupNames: string[];
	activeGroupName: string;
	groupData: TaggableGroup;
	onSelectedTagsChange?: (group: TaggableGroup) => void;
	onSelectedGroupChange?: (name: string) => void;
	tagGridReplacer?: () => React.FC; // custom component to replace the default taggrid
}

export const TagView = ({
	                        groupNames,
	                        activeGroupName,
	                        groupData,
	                        onSelectedTagsChange,
	                        onSelectedGroupChange,
                        }: TagViewProps) => {
	const [selectedGroup, setSelectedGroup] = useState<string>(activeGroupName);
	
	const handleTagSelection = (categories: TaggableCategory[]) => {
		if (activeGroupName !== selectedGroup) return;
		const parsed: TaggableGroup = {...groupData, "categories": categories};
		onSelectedTagsChange && onSelectedTagsChange(parsed);
	}
	
	const handleGroupSelection = (name: string) => {
		onSelectedGroupChange && onSelectedGroupChange(name);
		setSelectedGroup(name);
	}
	
	return (
		<React.Fragment>
			<div className="">
				{
					groupNames.map((name, index) => {
						return <TagLabel key={index}
						                 name={name}
						                 selected={name === selectedGroup}
						                 onClick={handleGroupSelection}/>
					})
				}
			</div>
			{
				<TagGrid groupName={selectedGroup}
				         data={groupData ? groupData.categories : []}
				         onSelectedTagsChange={handleTagSelection}/>
			}
		</React.Fragment>
	);
};

const base: string = "btn btn-xs mr-2 mb-2 rounded-md box-content border-solid border-1 border-base-300";
const className: string = `${base} hover:bg-neutral hover:text-base-100`;
const classNameSelected: string = `${base} bg-base-content text-base-100 hover:text-base-content`;


export const TagLabel = ({name, selected, onClick, icon}: {
	name: string,
	selected: boolean,
	icon?: React.ReactNode,
	onClick: (name: string) => void
}) => {
	return (
		<button
			className={selected ? classNameSelected : className}
			onClick={() => onClick(name)}>
			{icon}
			{toTitleCase(name)}
		</button>
	)
}
