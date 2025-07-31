import {NodeProps, EdgeProps} from "react-flow-renderer";

type Graph {
	nodes: NodeProps[];
	edges: EdgeProps[];
}


class GraphGenerator {
	
	private const addNode = (type, label) => {
		const node = {
			id: `${nodeId}`,
			type,
			data: { label },
			position: { x: positionX, y: positionY },
		};
		nodes.push(node);
		nodeId++;
		if (direction === 'right') {
			positionX += 200;
		} else {
			positionX -= 200;
		}
		return node.id;
	};
	
	public generateGraph(model, dependencies, maxWidth): Graph => {
		const nodes = [];
		const edges = [];
		let positionX = 0;
		let positionY = 100;
		let nodeId = 1;
		let edgeId = 1;
		let direction = 'right'; // Initial direction
		
		const addEdge = (source, target, sourceHandle = 'right', targetHandle = 'left') => {
			const edge = {
				id: `e${edgeId}`,
				source,
				target,
				type: 'smoothstep',
				sourceHandle,
				targetHandle,
				markerEnd: { type: 'arrowclosed' },
			};
			edges.push(edge);
			edgeId++;
		};
		
		const modelId = addNode('model', model.label);
		
		dependencies.forEach((dependency, index) => {
			if (direction === 'right' && positionX > maxWidth) {
				// Change direction to left and adjust position
				direction = 'left';
				positionX -= 200;
				positionY += 200;
				addEdge(nodes[nodes.length - 2].id, nodes[nodes.length - 1].id, 'bottom', 'top');
			}
			
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
	}
}
