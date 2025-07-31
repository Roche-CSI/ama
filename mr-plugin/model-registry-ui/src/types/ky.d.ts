
declare module 'ky' {
	import * as React from 'react';
	
	export const setChonkyDefaults: (options: any) => void;
	
	export interface FileData {
		id: string;
		name: string;
		isDir: boolean;
		size?: number;
		[key: string]: any;
	}
	
	export interface FileBrowserActions {
		id: string;
		payload: any;
	}
	
	export const ChonkyActions: {
		OpenFiles: { id: string };
		[key: string]: any;
	};
	
	export const FullFileBrowser: React.FC<{
		instanceId?: string;
		files: FileData[];
		folderChain: FileData[];
		onFileAction: (action: FileBrowserActions) => void;
		defaultFileViewActionId?: string;
	}>;
}
