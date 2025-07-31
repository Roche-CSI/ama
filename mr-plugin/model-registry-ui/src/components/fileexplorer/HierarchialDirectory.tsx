/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';

// SVG Icons
const FolderClosedIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
	</svg>
);

const FolderOpenIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm16 2H8l-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6z" />
	</svg>
);

const FileIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
	</svg>
);

// Directory Component
export const HierarchialDirectory = ({ files }) => {
	const [isExpanded, setExpanded] = useState(false);
	
	if (files.type === 'folder') {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-2">
				<div
					className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md"
					onClick={() => setExpanded(!isExpanded)}
				>
					{isExpanded ? (
						<FolderOpenIcon className="w-6 h-6 text-gray-500" />
					) : (
						<FolderClosedIcon className="w-6 h-6 text-gray-500" />
					)}
					<h2 className="ml-2 text-lg font-semibold">{files.name}</h2>
					<span
						className={`ml-auto transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
					>
            <svg
	            xmlns="http://www.w3.org/2000/svg"
	            className="w-4 h-4 text-gray-500"
	            viewBox="0 0 24 24"
	            fill="none"
	            stroke="currentColor"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
				</div>
				{isExpanded && (
					<div className="ml-8 mt-2">
						{files.items.map((item) => (
							<HierarchialDirectory key={item.id} files={item} />
						))}
					</div>
				)}
			</div>
		);
	}
	return (
		<div className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-50 rounded-md">
			<FileIcon className="w-5 h-5 text-gray-500" />
			<h3 className="ml-2 text-md">{files.name}</h3>
		</div>
	);
};
