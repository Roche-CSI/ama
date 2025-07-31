/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState} from 'react';
import {FileExplorer} from "../../../../../components/fileexplorer";
import {Asset} from "../../../../../api/data_types/asset";
import {stringToDate} from "../../../../../utils/date_utils";
import {SignedUrlApi} from "../../../../../api/SignedUrlApi";
import {FileObject} from "../../../../../components/fileexplorer/FileTree";
import {FileHandler, getFileType} from "../../../../../api/FileHandler";
import {FileData} from "../../../../../components/fileexplorer/Directory";
import {Option, VersionSelector} from "./VersionSelector.tsx";
import {useUrlParser} from "../../../../../hooks/useUrlParser.tsx";
import {AssetVersion} from "../../../../../api/data_types/assetVersion.ts";
import {HistoryView} from "./HistoryView";
import {FileIcon, HistoryIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";

const castToFile = (object: any) => {
	// convert to { path: 'recursive-components-react/.gitignore', size: 123, created_at: new Date('2024-01-01T10:00:00Z'), modified_at: new Date('2024-01-10T15:00:00Z') },
	return {
		id: object.id,
		path: object.id.split("::")[1],
		size: object.size || 0,
		created_at: stringToDate(object.created_at),
	}
}

export const FilesView: React.FC<{ asset: Asset }> = ({asset}) => {
	const {queryParams} = useUrlParser();
	const verNumber = queryParams['version'];
	const history = queryParams['history'];
	const navigate = useNavigate()
	const viewMode: 'files' | 'history' = history ? 'history' : 'files'
	
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
	
	const versionOptions = asset.versions.map((version) => ({
		id: version.id,
		number: version.number,
		label: version.number
	}));
	const latestVersion = asset.versions.length > 0 ? asset.versions[asset.versions.length - 1] : null;
	
	const handleVersionSelect = (option: Option) => {
		console.log('selected version', option);
		// navigate to the selected version
		navigate(`?version=${option.number}`);
	}
	const handleHistorySelect = (option: Option) => {
		console.log('selected history', option);
		// navigate to the selected history
		navigate(`?history=${option.number}`);
	}
	
	// find the previous version to the active version
	const activeVersionIndex = asset.versions.findIndex((v) => v.id === activeVersion.id);
	const previousVersion = activeVersionIndex > 0 ? asset.versions[activeVersionIndex - 1] : null;
	
	// retrieve the history parameter
	const historyParts = history?.split('vs');
	const baseVersionNumber = historyParts ? historyParts[0] : null;
	const compareVersionNumber = historyParts ? historyParts[1] : null;
	
	const handleViewToggle = (viewMode: string) => {
		if (viewMode === 'files') {
			// remove the history query parameter and navigate to files view
			navigate(`?version=${activeVersion.number}`);
		}else {
			// remove the version query parameter and navigate to history view
			// join the active and previous as a history parameter
			const history = `${previousVersion?.number}vs${activeVersion.number}`
			navigate(`?history=${history}`);
		}
	}
	
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex-1 flex items-center gap-4">
					{viewMode === 'files' ? (
						<VersionSelector options={versionOptions}
						                 latestId={latestVersion?.id}
						                 selectedId={activeVersion.id}
						                 onSelect={handleVersionSelect}
						/>
					) : (
						<>
							<VersionSelector
								options={versionOptions}
								selectedId={previousVersion?.id}
								disabled={!previousVersion}
								label="Base Version"/>
							<VersionSelector
								options={versionOptions}
								label="Compare Version"
								selectedId={activeVersion.id}
							/>
						</>
					)}
				</div>
				
				<button
					onClick={() => handleViewToggle(viewMode == 'files' ? 'history' : 'files')}
					className="btn btn-sm btn-ghost hover:btn-primary transition-colors duration-200"
					disabled={previousVersion == null}
				>
					<div className="flex items-center gap-2">
						{viewMode === 'files' ? (
							<>
								<HistoryIcon className="size-4"/>
								<span>Show History</span>
							</>
						) : (
							<>
								<FileIcon className="size-4"/>
								<span>Show Files</span>
							</>
						)}
					</div>
				</button>
			</div>
			
			<div className="relative">
				{viewMode === 'files' ? (
					<FileExplorer
						fileObjects={files}
						onFileClick={handleFileClick}
					/>
				) : (
					<HistoryView
						asset={asset}
					/>
				)}
			</div>
		</div>
	);
};
