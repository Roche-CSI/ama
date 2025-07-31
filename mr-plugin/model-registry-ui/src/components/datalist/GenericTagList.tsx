/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {TagView} from "../tagview";
import {TaggableGroup} from "../../api/data_types";

interface GenericTagListProps {
	groupNames: string[];
	activeGroupName: string;
	groupData: TaggableGroup;
	onSelectedTagsChange?: (group: TaggableGroup) => void;
	onSelectedGroupChange?: (name: string) => void;
}

export const GenericTagList: React.FC<GenericTagListProps> = ({
	                                                              groupNames,
	                                                              activeGroupName,
	                                                              groupData,
	                                                              onSelectedTagsChange,
	                                                              onSelectedGroupChange
                                                              }: GenericTagListProps) => {
	console.log("grupData", groupData);
	return (
		<TagView groupNames={groupNames}
		         activeGroupName={activeGroupName}
		         groupData={groupData}
		         onSelectedTagsChange={onSelectedTagsChange}
		         onSelectedGroupChange={onSelectedGroupChange}/>
	);
};
