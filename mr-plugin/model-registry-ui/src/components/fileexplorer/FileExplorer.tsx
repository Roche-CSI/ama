/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {DirectoryFlat, FileExplorerProps} from "./DirectoryFlat";


export const FileExplorer: React.FC<FileExplorerProps> = ({
	                                                          fileObjects,
	                                                          onFileClick
                                                          }) => {
	return (
		<div>
			{/*<HierarchialDirectory files={files}/>*/}
			<DirectoryFlat fileObjects={fileObjects}
			               onFileClick={onFileClick}/>
		</div>
	)
}
