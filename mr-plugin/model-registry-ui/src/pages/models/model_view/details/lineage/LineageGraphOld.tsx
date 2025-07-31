/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useCallback} from 'react';
import ReactFlow, {
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	MarkerType,
} from 'react-flow-renderer';
import {DatasetNode, DeploymentNode, DockerNode, ExperimentNode, ModelNode} from "./CustomNodes.tsx";
import CustomEdge from "./CustomEdge.tsx";

// Node Types
const nodeTypes = {
	model: ModelNode,
	dataset: DatasetNode,
	experiment: ExperimentNode,
	docker: DockerNode,
	deployment: DeploymentNode,
}

const edgeTypes = {
	custom: CustomEdge,
}


// Elements
const NODES = [
	{ id: '1', type: 'model', data: { label: 'Model A', isStartNode: true}, position: { x: 0, y: 100 }},
	{ id: '2', type: 'dataset', data: { label: 'Dataset A' }, position: { x: 200, y: 50 } },
	{ id: '3', type: 'dataset', data: { label: 'Dataset B' }, position: { x: 200, y: 150 } },
	{ id: '4', type: 'dataset', data: { label: 'Raw Data A' }, position: { x: 400, y: 50 } },
	{ id: '5', type: 'experiment', data: { label: 'Experiment A' }, position: { x: 600, y: 100 } },
	{ id: '6', type: 'docker', data: { label: 'Docker Container' }, position: { x: 800, y: 100 } },
	{ id: '7', type: 'deployment', data: { label: 'Deployment' }, position: { x: 1000, y: 100 } },
];

const EDGES = [
	{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed},},
	{ id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed}, },
	{ id: 'e2-4', source: '2', target: '4', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed}, },
	{ id: 'e4-5', source: '4', target: '5', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed}, },
	{ id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed}, },
	{ id: 'e6-7', source: '6', target: '7', type: 'smoothstep', markerEnd: {type: MarkerType.ArrowClosed}, },
];

const model = { label: 'Model A' };
const dependencies = [
	{ type: 'dataset', label: 'Dataset A', dependencies: [{ type: 'dataset', label: 'Raw Data A' }] },
	{ type: 'dataset', label: 'Dataset B' },
	{ type: 'experiment', label: 'Experiment A' },
	{ type: 'docker', label: 'Docker Container' },
	{ type: 'deployment', label: 'Deployment' },
];

export const LineageGraph = () => {
	
	const elements = generateElements(model, dependencies);
	console.log(elements);
	
	const [nodes, _, onNodesChange] = useNodesState(elements.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(elements.edges);
	const onConnect = useCallback(
		(params) => setEdges((els) => addEdge(params, els)),
		[],
	);
	
	return (
		<div className="border border-[#64748b40] h-screen rounded-md">
			<ReactFlow nodes={NODES}
			           edges={EDGES}
			           onNodesChange={onNodesChange}
			           onEdgesChange={onEdgesChange}
			           onConnect={onConnect}
			           edgeTypes={edgeTypes}
			           nodeTypes={nodeTypes}>
				{/*<MiniMap />*/}
				<Controls/>
				<Background/>
			</ReactFlow>
		</div>
	);
};

const generateElements = (model, dependencies) => {
	const nodes = [];
	const edges = [];
	let positionX = 10;
	let positionY = 100;
	let nodeId = 1;
	let edgeId = 1;
	
	const addNode = (type, label) => {
		const node = {
			id: `${nodeId}`,
			type,
			data: { label },
			position: { x: positionX, y: positionY },
		};
		nodes.push(node);
		nodeId++;
		positionX += 200;
		return node.id;
	};
	
	const addEdge = (source, target) => {
		const edge = {
			id: `e${edgeId}`,
			source,
			target,
			type: 'smoothstep',
			markerEnd: { type: 'arrowclosed' },
		};
		edges.push(edge);
		edgeId++;
	};
	
	const modelId = addNode('model', model.label);
	
	dependencies.forEach((dependency) => {
		const dependencyId = addNode(dependency.type, dependency.label);
		addEdge(modelId, dependencyId);
		
		if (dependency.dependencies) {
			dependency.dependencies.forEach((subDependency) => {
				const subDependencyId = addNode(subDependency.type, subDependency.label);
				addEdge(dependencyId, subDependencyId);
			});
		}
	});
	
	return { nodes, edges };
};
