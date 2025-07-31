import React from 'react';
import {FileList} from './FileList';
import {FileExplorer} from "../../../../../components/fileexplorer"; // Adjust import path as needed

const fileData = [
	{
		id: "RmlsZTozMjY2ODkwNDYyMQ==",
		name: "artifact/799127171/wandb_manifest.json",
		url: "xxx/wandb_manifest.json",
		directUrl: "xxx",
		sizeBytes: 0,
		mimetype: "application/json",
		updatedAt: "2024-04-16T17:07:32Z",
		md5: null
	},
	// Add more files here...
];

export const FileView = () => (
	<div className="pl-4">
		{/*<FileList files={fileData} />*/}
		<FileExplorer/>
	</div>
);

