/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';
import {
	CircleSlash,
	Clock,
	Cpu,
	Database,
	GitBranch,
	HardDrive,
	Codesandbox,
	ServerCog,
	Terminal,
	Trophy,
	User,
	Check,
	Eye,
	Code
} from 'lucide-react';
import {FileViewer} from "../../../../../components/fileexplorer/FileViewer.tsx";

const ExperimentCard = ({ experiment }) => {
	const [showRawView, setShowRawView] = useState(false);
	
	const formatDate = (timestamp) => {
		return new Date(timestamp * 1000).toLocaleString();
	};
	
	// Parse json_config string into object
	const config = JSON.parse(experiment.data.json_config);
	const configValues = Object.fromEntries(
		Object.entries(config).map(([key, value]) => [key, value.value])
	);
	
	const PrettyView = () => (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg border border-gray-200">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">{experiment.data.name}</h1>
					<div className="flex items-center space-x-4 text-gray-600">
                        <span className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
	                        {experiment.data.metadata.username}
                        </span>
						<span className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
							{formatDate(experiment.data.summary._timestamp)}
                        </span>
					</div>
				</div>
				<div className="flex items-center">
					{experiment.data.state === 'finished' ? (
						<Check className="w-6 h-6 text-emerald-600" />
					) : (
						<div className="flex items-center text-amber-600">
							<Clock className="w-6 h-6 mr-2" />
							Running
						</div>
					)}
				</div>
			</div>
			
			{/* Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg p-6 border border-gray-200">
					<div className="text-gray-600 mb-2">Accuracy</div>
					<div className="text-3xl font-bold text-gray-900">
						{(experiment.data.summary.acc * 100).toFixed(2)}%
					</div>
				</div>
				
				<div className="bg-white rounded-lg p-6 border border-gray-200">
					<div className="text-gray-600 mb-2">Loss</div>
					<div className="text-3xl font-bold text-gray-900">
						{experiment.data.summary.loss.toFixed(4)}
					</div>
				</div>
				
				<div className="bg-white rounded-lg p-6 border border-gray-200">
					<div className="text-gray-600 mb-2">Runtime</div>
					<div className="text-3xl font-bold text-gray-900">
						{experiment.data.summary._runtime.toFixed(2)}s
					</div>
				</div>
			</div>
			
			{/* Configuration */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<div className="flex items-center mb-4">
					<ServerCog className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold text-gray-900">Model Configuration</h2>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{Object.entries(configValues).map(([key, value]) => (
						<div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
							<div className="text-gray-600 text-sm mb-1">{key}</div>
							<div className="text-gray-900 font-semibold">{value}</div>
						</div>
					))}
				</div>
			</div>
			
			{/* System Info */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<div className="flex items-center mb-4">
					<HardDrive className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold text-gray-900">System Information</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<Terminal className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">OS</div>
							<div className="text-gray-900">{experiment.data.metadata.os}</div>
						</div>
					</div>
					
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<Cpu className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">CPU Cores</div>
							<div className="text-gray-900">{experiment.data.metadata.cpu_count}</div>
						</div>
					</div>
					
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<Codesandbox className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">Memory</div>
							<div className="text-gray-900">{experiment.data.metadata.memory.total} GB</div>
						</div>
					</div>
					
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<Database className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">Python</div>
							<div className="text-gray-900">{experiment.data.metadata.python}</div>
						</div>
					</div>
					
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<CircleSlash className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">GPU</div>
							<div className="text-gray-900">
								{experiment.data.metadata.gpuapple ?
									`${experiment.data.metadata.gpuapple.vendor} ${experiment.data.metadata.gpuapple.type}` :
									'N/A'}
							</div>
						</div>
					</div>
					
					<div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
						<Trophy className="w-5 h-5 text-gray-500" />
						<div>
							<div className="text-gray-600 text-sm">Status</div>
							<div className="text-gray-900 capitalize">{experiment.data.state}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	
	const RawView = () => (
		<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm font-mono">
	            <FileViewer language={"json"} text={JSON.stringify(experiment, null, 2)}/>
            </pre>
		</div>
	);
	
	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex justify-end mb-4">
				<button
					onClick={() => setShowRawView(!showRawView)}
					className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
				>
					{showRawView ? <Eye className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
					{showRawView ? 'Pretty View' : 'Raw View'}
				</button>
			</div>
			{showRawView ? <RawView /> : <PrettyView />}
		</div>
	);
};

export default ExperimentCard;
