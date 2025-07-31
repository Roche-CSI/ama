/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useState} from 'react';
import {FileItem} from "./FileTree.ts";
import {FolderIcon} from "../icons";
import {IconProvider} from "./IconProvider.tsx";
import {getDaysAgo} from "../../utils";
import {FileViewer} from "./FileViewer.tsx";
import {Spinner} from "../spinner";
import {set} from "lodash";

// SVG Icons

interface ElementProps {
	file: FileItem;
	onClick?: (path: FileItem) => void;
}

const FileElement = ({file, onClick}: ElementProps) => {
	return (
		<div className="flex items-center border-b border-[#64748b40]  p-2 hover:bg-base-200 cursor-pointer"
		     onClick={() => onClick && onClick(file)}>
			<IconProvider file={file}/>
			<span className="flex-1 text-sm">{file.object.name}</span>
			<span className="flex-shrink-0 text-xs ml-4 mr-24">
			{(file.object.size ? (file.object.size / 1024).toFixed(2) : 'N/A')} KB
		</span>
			<span className="flex-shrink-0 text-xs ml-4 mr-6">
			{file.object.created_at ? `${getDaysAgo(file.object.created_at)} days ago` : 'N/A'}
		</span>
			{/*<div className="flex-shrink-0 text-sm text-gray-600 ml-4">*/}
			{/*	{file.object.modified_at ? new Date(file.object.modified_at).toLocaleDateString() : 'N/A'}*/}
			{/*</div>*/}
		</div>
	);
}

const FolderElement = ({file, onClick}: ElementProps) => (
	<div className="border-b border-base-200 p-2 hover:bg-base-200 cursor-pointer"
	     onClick={() => onClick && onClick(file)}>
		<div className="flex items-center">
			<IconProvider file={file}/>
			<span className="text-sm">{file.object.name}</span>
		</div>
	</div>
);


interface DirectoryProps {
	file: FileItem;
	onToggle?: (file: FileItem) => void;
	fetchFileContent?: (file: FileItem) => Promise<FileData>;
}

export interface FileData {
	content: string;
	type: string;
	error?: string;
}

const FileRenderer: React.FC<DirectoryProps> = ({file, fetchFileContent}) => {
	// Sort the array such that files come before folders
	const [loading, setLoading] = useState<boolean>(false);
	const [fileData, setFileData] = useState<FileData | null>(null);
	
	useEffect(() => {
		console.log("FileRenderer useEffect called");
		// Create an async function inside useEffect
		const fetchData = async () => {
			try {
				setLoading(true);
				const fetched = fetchFileContent ? await fetchFileContent(file) : {content: "", type: ""};
				setLoading(false);
				setFileData(fetched!);
			} catch (error) {
				console.error('Error fetching file:', error);
				// Move error state update inside setTimeout as well
				setLoading(false);
				setFileData({content: '', type: '', error: 'Failed to fetch file content'});
			}
		};
		
		// Call the async function
		if (fetchFileContent) {
			fetchData();
		}
	}, [file, fetchFileContent]);
	
	return (
		<div className="h-full min-h-96">
			{
				!fileData || loading ? (
					<div className="min-h-96 h-full flex items-center justify-center">
						<Spinner message={"Loading..."}/>
					</div>
				) : fileData.error ? (
					<div className="p-4 text-center text-red-500">{fileData.error}</div>
				) : (
					<FileViewer language={fileData!.type} text={fileData!.content}/>
				)
			}
		</div>
	)
}

export const Directory: React.FC<DirectoryProps> = ({file, onToggle, fetchFileContent}) => {
	
	
	file.items && file.items.sort((a, b) => {
		if (a.type === 'file' && b.type === 'folder') {
			return -1;
		}
		if (a.type === 'folder' && b.type === 'file') {
			return 1;
		}
		return 0; // They are the same type, so no change in order
	});
	
	if (file.type === 'file') {
		return (
			<FileRenderer file={file} fetchFileContent={fetchFileContent}/>
		)
	} else {
		return (
			<div className="border border-[#64748b40] ">
				<div>
					{file.items?.map((item) =>
						item.type === 'folder' ? (
							<FolderElement file={item} onClick={onToggle} key={item.id}/>
						) : (
							<FileElement file={item} onClick={onToggle} key={item.id}/>
						)
					)}
				</div>
			</div>
		);
	}
	
};
