/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {FileExplorer} from "../../../../../components/fileexplorer";
import {Asset} from "../../../../../api/data_types/asset";
import {stringToDate} from "../../../../../utils/date_utils";
import {SignedUrlApi} from "../../../../../api/SignedUrlApi";
import {FileObject} from "../../../../../components/fileexplorer/FileTree";
import {FileHandler, getFileType} from "../../../../../api/FileHandler";
import {FileData} from "../../../../../components/fileexplorer/Directory";
import {VersionSelector} from "./VersionSelector";
import {useUrlParser} from "../../../../../hooks/useUrlParser.tsx";
import {AssetVersion} from "../../../../../api/data_types/assetVersion.ts";


const castToFile = (object: any) => {
	// convert to { path: 'recursive-components-react/.gitignore', size: 123, created_at: new Date('2024-01-01T10:00:00Z'), modified_at: new Date('2024-01-10T15:00:00Z') },
	return {
		id: object.id,
		path: object.id.split("::")[1],
		size: object.size || 0,
		created_at: stringToDate(object.created_at),
	}
}

export const HistoryView: React.FC<{asset: Asset}> = ({asset}) => {
	const {queryParams} = useUrlParser();
	const verNumber = queryParams['version'];
	
	// Find active version
	const activeVersion = verNumber
		? asset?.versions.find((v) => v.number === verNumber)
		: asset?.versions.find((v) => v.id === asset?.leaf_version_id);
	
	if (!asset || !activeVersion) return null;
	
	// create version objects
	AssetVersion.updateVersionObjects({asset: asset, version: activeVersion});
	
	console.log('activeVersion', activeVersion);
	
	const objects = activeVersion.objects || [];
	// transform objects into files
	const files = objects.map(obj => castToFile(obj));
	// console.log('fileObjects', files);
	
	const handleFileClick = async (file: FileObject): Promise<FileData> => {
		console.log('file clicked', file);
		const res = await SignedUrlApi.fetchAll({params: {class_id: asset.asset_class, object_id: file.id}})
		const data = await res.json();
		const contentType = getFileType(file.path, data.object.content.mime_type)
		const content = await new FileHandler().download(data.signed_url, contentType);
		return {content: content, type: contentType};
	}
	
	return (
		<div className="space-y-6">
			<div className="relative">
				<FileExplorer fileObjects={files} onFileClick={handleFileClick}/>
			</div>
		</div>
	);
};
