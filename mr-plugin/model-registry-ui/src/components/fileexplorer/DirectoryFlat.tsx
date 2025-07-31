import React, {useEffect, useMemo, useState} from 'react';
import {Directory, FileData} from './Directory';
import {FileTree, FileItem, FileObject} from './FileTree';
import {ArtifactsIcon} from "../icons";

export interface FileExplorerProps {
	fileObjects: FileObject[];
	onFileClick?: (file: FileObject) => Promise<FileData>;
}


export const DirectoryFlat: React.FC<FileExplorerProps> = ({fileObjects, onFileClick}) => {
	const files = useMemo(() => new FileTree(fileObjects || []).generateTree(), [fileObjects]);
	const [currentPath, setCurrentPath] = useState<FileItem>(files);
	
	// Update currentPath when files change
	useEffect(() => {
		// If the current path ID still exists in the new files, find and set that path
		if (currentPath.id) {
			const existingPath = FindById(files, currentPath.id);
			if (existingPath) {
				setCurrentPath(existingPath);
				return;
			}
		}
		// If current path doesn't exist in new files, reset to root
		setCurrentPath(files);
	}, [files]);
	
	const handleToggle = (path: FileItem) => {
		setCurrentPath(path);
	};
	
	const handleFileClick = (file: FileItem): FileData => {
		return onFileClick && onFileClick(file.object);
	}
	
	const FindById = (path: FileItem, id: string): FileItem | null => {
		if (!path || !id) {
			return null;
		}
		if (path.id === id) {
			return path;
		}
		if (path.items) {
			for (const item of path.items) {
				const found = FindById(item, id);
				if (found) {
					return found;
				}
			}
		}
		return null;
	};
	
	const handlePathClick = (index: number) => {
		const clickedPath = currentPath.parent?.split("/").slice(0, index + 1).join("/");
		const targetPath = FindById(files, clickedPath);
		console.log("clickedPath", clickedPath, "targetPath", targetPath);
		setCurrentPath(targetPath || currentPath);
	};
	
	const pathArray = currentPath.id?.split("/") || [];
	
	return (
		<div>
			<nav className="flex items-center text-sm bg-base-200 px-3 py-4 rounded-t-md shadow-sm mb-1">
				<ArtifactsIcon className="size-4 mr-3"/>
				{pathArray.map((segment, index) => (
					<span key={index} className="flex items-center">
						<a
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePathClick(index);
							}}
							className={`hover:text-primary hover:underline ${
								index === pathArray.length - 1 ? 'text-neutral-500 cursor-default' : ''
							}`}
						>
							{segment}
						</a>
						{index < pathArray.length - 1 && (
							<span className="mx-2 text-neutral-400">/</span>
						)}
					</span>
				))}
			</nav>
			<Directory
				file={currentPath}
				onToggle={handleToggle}
				fetchFileContent={handleFileClick}
			/>
		</div>
	);
};
