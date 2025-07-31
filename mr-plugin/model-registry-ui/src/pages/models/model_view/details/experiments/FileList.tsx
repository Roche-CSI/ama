import React from 'react';

interface FileItem {
	id: string;
	name: string;
	url: string;
	directUrl: string;
	sizeBytes: number;
	mimetype: string;
	updatedAt: string;
	md5: string | null;
}

interface FileListProps {
	files: FileItem[];
}

const formatBytes = (bytes: number): string => {
	if (bytes === 0) return '0 Byte';
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))), 10);
	return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

export const FileList: React.FC<FileListProps> = ({ files }) => {
	return (
		<div className="p-4 bg-gray-100 rounded-md shadow-md">
			<h2 className="text-xl font-semibold mb-4">Files</h2>
			<ul className="list-disc pl-5 space-y-3">
				{files.map((file) => (
					<li key={file.id} className="p-2 bg-white rounded-lg shadow">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-medium">{file.name}</h3>
								<p className="text-sm text-gray-600">Size: {formatBytes(file.sizeBytes)}</p>
								<p className="text-sm text-gray-600">Type: {file.mimetype || 'Unknown'}</p>
								<p className="text-xs text-gray-400">Updated At: {new Date(file.updatedAt).toLocaleDateString()}</p>
							</div>
							<a
								href={file.directUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:text-blue-700"
							>
								View / Download
							</a>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

