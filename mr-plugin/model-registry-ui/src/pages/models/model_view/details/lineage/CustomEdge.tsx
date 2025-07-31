/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { getSmoothStepPath } from 'react-flow-renderer';

const CustomEdge = ({
	                    id,
	                    sourceX,
	                    sourceY,
	                    targetX,
	                    targetY,
	                    sourcePosition,
	                    targetPosition,
	                    style = {},
	                    arrowHeadType,
	                    markerEndId,
                    }) => {
	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});
	
	return (
		<>
			<path
				id={id}
				style={style}
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEndId}
			/>
			<marker
				id={markerEndId}
				markerWidth="10"
				markerHeight="10"
				refX="10"
				refY="5"
				orient="auto"
				markerUnits="strokeWidth"
			>
				<path d="M0,0 L0,10 L10,5 z" fill="#000" />
			</marker>
		</>
	);
};

export default CustomEdge;
