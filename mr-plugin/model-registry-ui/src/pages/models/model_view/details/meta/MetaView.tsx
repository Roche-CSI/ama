/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {FileViewer} from "../../../../../components/fileexplorer/FileViewer";

import {AssetInterface} from "../../../../../api/data_types/assetInterface.ts";


export const MetaView: React.FC<{asset: AssetInterface}> = ({asset}) => {
	if (!asset || !asset.metadata) {
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-gray-500 text-lg">No metadata available.</p>
			</div>
		);
	}
	
	return (
		<div className="relative">
			<FileViewer text={JSON.stringify(asset.metadata, null, '\t')}
			            language={"json"}
			            height={800}
			/>
		</div>
	);
};
