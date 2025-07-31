import React from 'react';

// Import your SVG icons
import {DocumentIcon, FolderIcon, YAMLFileIcon} from '../icons';
import { JSONFileIcon } from '../icons';
import { CodeFileIcon } from '../icons';
import { FileItem } from './FileTree';
import {FileCode2, FileJson2} from "lucide-react";

interface IconProviderProps {
	file: FileItem;
}

export const IconProvider: React.FC<IconProviderProps> = ({file}: IconProviderProps) => {
	const { name } = file.object;
	const className: string = "size-4 mr-3 "
	
	if (file.type == 'folder') {
		return <span className='text-primary'><FolderIcon className={className}/></span>;
	}
	
	if (name.endsWith(".yaml") || name.endsWith(".yml")) {
		return <FileCode2 className={className}/>;
	} else if (name.endsWith(".json")) {
		return <FileJson2 className={className}/>;
	} else if (name.endsWith(".py")) {
		return <CodeFileIcon className={className}/>;
	} else if (name.endsWith(".js")) {
		return <CodeFileIcon className={className}/>;
	} else if (
		name.endsWith(".java") ||
		name.endsWith(".cpp") ||
		name.endsWith(".c") ||
		name.endsWith(".rb") ||
		name.endsWith(".php") ||
		name.endsWith(".swift") ||
		name.endsWith(".ts") // Add more code file extensions as needed
	) {
		return <CodeFileIcon className={className}/>;
	} else {
		return <DocumentIcon className={className}/>;
	}
};


