import React, { useCallback } from 'react';
import ReactFlow, {
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	useReactFlow,
	MarkerType,
	ReactFlowProvider
} from 'react-flow-renderer';
import { DatasetNode, DeploymentNode, DockerNode, ExperimentNode, ModelNode } from "./CustomNodes.tsx";
import CustomEdge from "./CustomEdge.tsx";
import Legend from './Legend';

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

// Sample data structure for Nanopore Fast Call model lineage
const model = {
	label: 'Nanopore Fast Call',
	upstream: [
		{
			type: 'dataset',
			label: 'Human Reference Genome GRCh38',
			dependencies: [
				{ type: 'dataset', label: 'Primary Assembly Data' },
				{ type: 'dataset', label: 'GIAB Truth Set HG002' }
			]
		},
		{
			type: 'dataset',
			label: 'ONT R10.4.1 Flow Cell Data',
			dependencies: [
				{ type: 'dataset', label: 'Raw FAST5 Files' },
				{ type: 'dataset', label: 'Signal-Level Data' }
			]
		},
		{
			type: 'experiment',
			label: 'Model Architecture Optimization',
			dependencies: [
				{ type: 'model', label: 'Oxford Nanopore Base Model' }
			]
		}
	],
	downstream: [
		{
			type: 'experiment',
			label: 'Accuracy Benchmark',
			dependencies: [
				{ type: 'dataset', label: 'Variant Truth Set' }
			]
		},
		{
			type: 'docker',
			label: 'Nanopore Pipeline v2.1',
			dependencies: [
				{ type: 'deployment', label: 'GPU Cluster Validation' }
			]
		},
		{
			type: 'deployment',
			label: 'Clinical Sequencing Pipeline'
		}
	]
};

const getLayoutedElements = (nodes, edges) => {
	return { nodes, edges };
};

const LayoutFlow = ({ initialNodes, initialEdges }) => {
	const {fitView} = useReactFlow();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	
	// const onConnect = useCallback(
	// 	(params) => setEdges((els) => addEdge(params, els)),
	// 	[],
	// );
	
	const onLayout = useCallback(() => {
		const layouted = getLayoutedElements(nodes, edges);
		setNodes([...layouted.nodes]);
		setEdges([...layouted.edges]);
		
		window.requestAnimationFrame(() => {
			fitView();
		});
	}, [nodes, edges]);
	
	return (
		<div className="border border-gray-200 h-screen rounded-md">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
				fitView>
				<Controls />
				<Background />
				<Legend />
			</ReactFlow>
		</div>
	);
}


export const LineageGraph = () => {
	const {nodes, edges} = generateElements(model);
	return (
		<ReactFlowProvider>
			<LayoutFlow initialNodes={nodes} initialEdges={edges} />
		</ReactFlowProvider>
	);
};

const generateElements = (model) => {
	const nodes = [];
	const edges = [];
	let nodeId = 1;
	let edgeId = 1;
	
	// Layout configuration
	const startX = 500;
	const startY = 400;
	const horizontalSpacing = 300;
	const minVerticalSpacing = 150;
	const verticalPadding = 100;
	const nodeHeight = 80; // Approximate height of each node
	const nodeWidth = 200; // Approximate width of each node
	
	const containerHeight = 800;
	const availableHeight = containerHeight - (2 * verticalPadding);
	
	// Helper function to check if two nodes overlap
	const nodesOverlap = (node1, node2) => {
		const verticalDistance = Math.abs(node1.position.y - node2.position.y);
		const horizontalDistance = Math.abs(node1.position.x - node2.position.x);
		
		return verticalDistance < nodeHeight && horizontalDistance < nodeWidth;
	};
	
	// Recursive function to resolve overlaps
	const resolveOverlaps = (nodes, currentIndex, visited = new Set()) => {
		if (visited.has(currentIndex)) return;
		visited.add(currentIndex);
		
		const currentNode = nodes[currentIndex];
		let hasOverlap = false;
		
		for (let i = 0; i < nodes.length; i++) {
			if (i === currentIndex) continue;
			
			const otherNode = nodes[i];
			if (nodesOverlap(currentNode, otherNode)) {
				hasOverlap = true;
				
				// Calculate shift direction (up or down)
				const shift = currentNode.position.y < otherNode.position.y ? -minVerticalSpacing : minVerticalSpacing;
				
				// Apply shift while keeping node within container bounds
				const newY = Math.max(
					verticalPadding,
					Math.min(
						containerHeight - verticalPadding,
						currentNode.position.y + shift
					)
				);
				
				currentNode.position.y = newY;
				
				// Recursively resolve any new overlaps
				resolveOverlaps(nodes, i, visited);
			}
		}
		
		if (hasOverlap) {
			// Check if the current position is valid
			const isValidPosition = nodes.every((node, idx) =>
				idx === currentIndex || !nodesOverlap(currentNode, node)
			);
			
			if (!isValidPosition) {
				// Try alternative positions if current position still has overlaps
				const alternativePositions = [
					currentNode.position.y + minVerticalSpacing * 1.5,
					currentNode.position.y - minVerticalSpacing * 1.5,
					currentNode.position.y + minVerticalSpacing * 2,
					currentNode.position.y - minVerticalSpacing * 2
				];
				
				for (const newY of alternativePositions) {
					if (newY >= verticalPadding && newY <= containerHeight - verticalPadding) {
						currentNode.position.y = newY;
						const nowValid = nodes.every((node, idx) =>
							idx === currentIndex || !nodesOverlap(currentNode, node)
						);
						if (nowValid) break;
					}
				}
			}
		}
	};
	
	const addNode = (type, label, level, yPosition, totalItems, direction) => {
		let xPosition;
		if (direction === 'center') {
			xPosition = startX;
		} else {
			const levelOffset = direction === 'upstream' ? -(level * horizontalSpacing) : (level * horizontalSpacing);
			xPosition = startX + levelOffset;
		}
		
		const node = {
			id: `${nodeId}`,
			type,
			data: {
				label,
				isStartNode: direction === 'center'
			},
			position: {
				x: xPosition,
				y: yPosition
			},
		};
		nodes.push(node);
		nodeId++;
		return node.id;
	};
	
	const addEdge = (source, target) => {
		const edge = {
			id: `e${edgeId}`,
			source,
			target,
			type: 'smoothstep',
			markerEnd: { type: MarkerType.ArrowClosed },
		};
		edges.push(edge);
		edgeId++;
	};
	
	// Add main model node
	const modelId = addNode('model', model.label, 0, startY, 1, 'center');
	
	const positionNodesForLevel = (items, level, direction, parentIndex = null) => {
		const totalItems = items.length;
		let positions = [];
		
		items.forEach((item, index) => {
			let adjustedIndex = index;
			if (parentIndex !== null) {
				const parentPosition = parentIndex / (totalItems + 1);
				const idealPosition = (index + 1) / (totalItems + 1);
				adjustedIndex = Math.floor(((parentPosition + idealPosition) / 2) * totalItems);
			}
			
			const baseY = startY - ((totalItems - 1) * minVerticalSpacing / 2) +
				(adjustedIndex * minVerticalSpacing);
			
			const nodeId = addNode(
				item.type,
				item.label,
				level,
				baseY,
				totalItems,
				direction
			);
			
			positions.push({
				id: nodeId,
				index: adjustedIndex,
				yPos: baseY,
				item: item
			});
		});
		
		// After adding all nodes for this level, resolve any overlaps
		for (let i = 0; i < nodes.length; i++) {
			resolveOverlaps(nodes, i, new Set());
		}
		
		return positions;
	};
	
	// Process upstream dependencies
	if (model.upstream) {
		const level1Positions = positionNodesForLevel(model.upstream, 1, 'upstream');
		
		level1Positions.forEach(parentNode => {
			if (parentNode.item.dependencies) {
				const subNodes = positionNodesForLevel(
					parentNode.item.dependencies,
					2,
					'upstream',
					parentNode.index
				);
				
				addEdge(parentNode.id, modelId);
				subNodes.forEach(subNode => {
					addEdge(subNode.id, parentNode.id);
				});
			} else {
				addEdge(parentNode.id, modelId);
			}
		});
	}
	
	// Process downstream dependencies
	if (model.downstream) {
		const level1Positions = positionNodesForLevel(model.downstream, 1, 'downstream');
		
		level1Positions.forEach(parentNode => {
			if (parentNode.item.dependencies) {
				const subNodes = positionNodesForLevel(
					parentNode.item.dependencies,
					2,
					'downstream',
					parentNode.index
				);
				
				addEdge(modelId, parentNode.id);
				subNodes.forEach(subNode => {
					addEdge(parentNode.id, subNode.id);
				});
			} else {
				addEdge(modelId, parentNode.id);
			}
		});
	}
	
	return { nodes, edges };
};
