import React from 'react';
import { Handle } from 'react-flow-renderer';
import { Database, Cpu, FlaskConical, Box, Cloud } from 'lucide-react';

const NodeWrapper = ({ children, borderColor }) => (
	<div className={`border ${borderColor} rounded-lg shadow-sm bg-white min-w-48`}>
		<Handle
			type="target"
			position="left"
			className="!border-gray-400"
		/>
		{children}
		<Handle
			type="source"
			position="right"
			className="!border-gray-400"
		/>
	</div>
);

export const ModelNode = ({ data }) => (
	<NodeWrapper borderColor="border-purple-200">
		<div className="flex items-center h-full">
			<div className="bg-purple-500 h-full flex items-center justify-center p-2 rounded-l-lg">
				<Cpu size={20} className="text-white" />
			</div>
			<span className="flex-1 p-2 px-3 text-sm font-medium">{data.label}</span>
		</div>
	</NodeWrapper>
);

export const DatasetNode = ({ data }) => (
	<NodeWrapper borderColor="border-blue-200">
		<div className="flex items-center h-full">
			<div className="bg-blue-500 h-full flex items-center justify-center p-2 rounded-l-lg">
				<Database size={20} className="text-white" />
			</div>
			<span className="flex-1 p-2 px-3 text-sm font-medium">{data.label}</span>
		</div>
	</NodeWrapper>
);

export const ExperimentNode = ({ data }) => (
	<NodeWrapper borderColor="border-green-200">
		<div className="flex items-center h-full">
			<div className="bg-green-500 h-full flex items-center justify-center p-2 rounded-l-lg">
				<FlaskConical size={20} className="text-white" />
			</div>
			<span className="flex-1 p-2 px-3 text-sm font-medium">{data.label}</span>
		</div>
	</NodeWrapper>
);

export const DockerNode = ({ data }) => (
	<NodeWrapper borderColor="border-orange-200">
		<div className="flex items-center h-full">
			<div className="bg-orange-500 h-full flex items-center justify-center p-2 rounded-l-lg">
				<Box size={20} className="text-white" />
			</div>
			<span className="flex-1 p-2 px-3 text-sm font-medium">{data.label}</span>
		</div>
	</NodeWrapper>
);

export const DeploymentNode = ({ data }) => (
	<NodeWrapper borderColor="border-gray-200">
		<div className="flex items-center h-full">
			<div className="bg-gray-500 h-full flex items-center justify-center p-2 rounded-l-lg">
				<Cloud size={20} className="text-white" />
			</div>
			<span className="flex-1 p-2 px-3 text-sm font-medium">{data.label}</span>
		</div>
	</NodeWrapper>
);
