import React, { useMemo, useState } from 'react';
import { DatasetInterface } from '../../api/data_types';
import { useLocation } from 'react-router-dom';
import { DatasetApi, useData } from '../../api';

export const DatasetViewPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'datasetCard' | 'viewer' | 'files' | 'versions'>('datasetCard');
	const location = useLocation();
	const pathSegments = location.pathname.split('/').filter(Boolean);
	const datasetId = pathSegments[2] || '';

	// Fetch Dataset Data
	const datasetFetch = useMemo(() => DatasetApi.fetchById(datasetId), [datasetId]);
	const { data: datasetData, loading: datasetLoading, error: datasetError } = useData<DatasetInterface>(datasetFetch);

	const renderContent = () => {
		if (datasetLoading) {
			return <p className="text-center text-gray-500">Loading dataset...</p>;
		}

		if (datasetError) {
			return <p className="text-center text-red-500">Error loading dataset: {datasetError}</p>;
		}

		if (!datasetData) {
			return <p className="text-center text-gray-500">Dataset not found.</p>;
		}

		switch (activeTab) {
			case 'datasetCard':
				return (
					<div className="p-4">
						<h2 className="text-xl font-bold mb-4">Description</h2>
						<p className="text-gray-700">{datasetData.model.description || 'No description available.'}</p>
						<ul className="mt-4 text-sm text-gray-600">
							<li>
								<strong>Owner:</strong> {datasetData.model.owner_username || 'Unknown'}
							</li>
							<li>
								<strong>Size:</strong> {datasetData.model.size || 'Unknown'}
							</li>
							<li>
								<strong>License:</strong> {datasetData.model.license || 'Not specified'}
							</li>
							<li>
								<strong>Format:</strong> {datasetData.model.format || 'Unknown'}
							</li>
							<li>
								<strong>Records:</strong> {datasetData.model.num_records?.toLocaleString() || 'N/A'}
							</li>
						</ul>
					</div>
				);
			case 'viewer':
				return (
					<div className="p-4">
						<h2 className="text-xl font-bold mb-4">Viewer</h2>
						<p>Dataset visualization or preview will be displayed here.</p>
					</div>
				);
			case 'files':
				return (
					<div className="p-4">
						<h2 className="text-xl font-bold mb-4">Files</h2>
						<p>File information will be displayed here.</p>
					</div>
				);
			case 'versions':
				return (
					<div className="p-4">
						<h2 className="text-xl font-bold mb-4">Versions</h2>
						<p>Version history will be displayed here.</p>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto px-6 py-8">
			{/* Dataset Name */}
			<h1 className="text-3xl font-bold mb-4">
				{datasetLoading ? 'Loading...' : datasetData?.model.name || 'Dataset'}
			</h1>

			{/* Tags */}
			{datasetData?.tags?.length > 0 && (
				<div className="mb-6">
					{datasetData.tags.map((tag, index) => (
						<span
							key={index}
							className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
						>
							{tag}
						</span>
					))}
				</div>
			)}

			{/* Tabs */}
			<div className="mb-6">
				<ul className="flex border-b border-gray-300">
					{['datasetCard', 'viewer', 'files', 'versions'].map((tab) => (
						<li key={tab} className="mr-1">
							<button
								className={`py-2 px-4 ${activeTab === tab
									? 'border-b-2 border-green-500 font-semibold'
									: 'text-gray-600 hover:text-gray-800'
									}`}
								onClick={() => setActiveTab(tab as typeof activeTab)}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						</li>
					))}
				</ul>
			</div>

			{/* Tab Content */}
			{renderContent()}
		</div>
	);
};
