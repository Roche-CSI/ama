import React, { useMemo } from 'react';
import { DeploymentInterface } from "../../api/data_types";
import { DeploymentApi, useData } from "../../api";
import { useLocation } from 'react-router-dom';

// Fetch deployment data based on the deployment ID
export const DeploymentViewPage: React.FC = () => {
	const location = useLocation();
	const pathSegments = location.pathname.split('/').filter(Boolean);
	const deploymentId = pathSegments[2] || '';
	// Fetch deployment data using the `DeploymentApi`
	const deploymentFetch = useMemo(() => DeploymentApi.fetchById(deploymentId), [deploymentId]);
	const { data: deploymentData, loading, error } = useData<DeploymentInterface>(deploymentFetch);

	// Helper function to render the status class based on deployment status
	const getStatusClass = (status: 'pending' | 'active' | 'failed' | 'completed') => {
		switch (status) {
			case 'pending':
				return 'text-yellow-500';
			case 'active':
				return 'text-green-500';
			case 'failed':
				return 'text-red-500';
			case 'completed':
				return 'text-blue-500';
			default:
				return '';
		}
	};

	return (
		<div className="container mx-auto px-6 py-8">
			<h1 className="text-4xl font-bold mb-6">
				{loading ? 'Loading Deployment...' : deploymentData?.model.name || 'Deployment'}
			</h1>
			<p className="text-lg mb-4">{deploymentData?.model.description || 'No description available.'}</p>

			{/* Deployment Details */}
			<div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
				<h2 className="text-2xl font-semibold mb-4">Deployment Details</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-xl font-semibold">General Information</h3>
						<ul className="list-disc list-inside mt-2">
							<li><strong>Created At:</strong> {deploymentData ? new Date(deploymentData.model.created_at).toLocaleDateString() : 'Loading...'}</li>
							{deploymentData?.model.updated_at && (
								<li><strong>Updated At:</strong> {new Date(deploymentData.model.updated_at).toLocaleDateString()}</li>
							)}
							<li><strong>Deployment URL:</strong> <a href={deploymentData?.model.url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{deploymentData?.model.url || 'Loading...'}</a></li>
							<li><strong>Model ID:</strong> {deploymentData?.model.model_id || 'Loading...'}</li>
							<li><strong>User:</strong> {deploymentData?.model.user_username || 'Loading...'}</li>
							<li><strong>Status:</strong> <span className={`font-medium ${getStatusClass(deploymentData?.model.status || 'pending')}`}>{deploymentData?.model.status || 'pending'}</span></li>
							<li><strong>Environment:</strong> {deploymentData?.model.deployment_environment || 'Loading...'}</li>
							<li><strong>Tags:</strong> {deploymentData?.model.tags?.join(', ') || 'None'}</li>
						</ul>
					</div>


				</div>
			</div>
			{/* Machine Configuration Section */}
			{deploymentData?.model.machine_config && (
				<div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-2xl font-semibold mb-4">Machine Configuration</h2>
					<ul className="list-disc list-inside mt-2">
						<li><strong>CPU:</strong> {deploymentData?.model.machine_config.cpu || 'Loading...'}</li>
						<li><strong>Memory:</strong> {deploymentData?.model.machine_config.memory || 'Loading...'}</li>
						{deploymentData?.model.machine_config.gpu && (
							<li><strong>GPU:</strong> {deploymentData?.model.machine_config.gpu}</li>)}
						<li><strong>Disk:</strong> {deploymentData?.model.machine_config.disk || 'Loading...'}</li>
					</ul>
				</div>)}


			{/* Metrics Section */}
			{deploymentData?.model.metrics && (
				<div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-2xl font-semibold mb-4">Metrics</h2>
					<ul className="list-disc list-inside mt-2">
						<li><strong>CPU Usage:</strong> {deploymentData.model.metrics.cpu_usage !== undefined ? `${deploymentData.model.metrics.cpu_usage}%` : 'Loading...'}</li>
						<li><strong>Memory Usage:</strong> {deploymentData.model.metrics.memory_usage !== undefined ? `${deploymentData.model.metrics.memory_usage}%` : 'Loading...'}</li>
						<li><strong>Disk Usage:</strong> {deploymentData.model.metrics.disk_usage !== undefined ? `${deploymentData.model.metrics.disk_usage}%` : 'Loading...'}</li>
					</ul>
				</div>
			)}

			{/* Logs Section */}
			{deploymentData?.model.logs_url && (
				<div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
					<h2 className="text-2xl font-semibold mb-4">Logs</h2>
					<ul className="list-disc list-inside mt-2">
						<li><strong>Log URL:</strong> <a href={deploymentData.model.logs_url} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">View Logs</a></li>
					</ul>
				</div>
			)}
		</div>
	);
};
