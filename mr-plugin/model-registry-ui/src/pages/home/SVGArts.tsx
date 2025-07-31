/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";

interface SVGArtProps {
	width?: number;
	height?: number;
	className?: string;
}

export const BaseCallingSVG: React.FC<SVGArtProps> = ({width = 350, height = 200, className}) => {
	return (
		<div className={`w-full h-full`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${width} ${height}`}
				width={width}
				height={height}
				className={`w-full h-full ${className}`}
				preserveAspectRatio="xMidYMid meet"
			>
				{/* Background */}
				{/*<rect width={width} height={height} fill="#f0f4f8"/>*/}
				
				{/* Abstract DNA helix */}
				<path d="M0,100 Q87.5,20 175,100 T350,100"
				      stroke="#16213e" fill="none" strokeWidth="4"/>
				<path
					d="M0,100 Q87.5,180 175,100 T350,100"
					stroke="#16213e" fill="none" strokeWidth="4"/>
				
				{/* Base calling representation */}
				<circle cx="87.5" cy="100" r="30" fill="none" stroke="#e94560" strokeWidth="3"/>
				<circle cx="175" cy="100" r="30" fill="none" stroke="#0f3460" strokeWidth="3"/>
				<circle cx="262.5" cy="100" r="30" fill="none" stroke="#2fc4b2" strokeWidth="3"/>
				
				{/* Data flow lines */}
				<line x1="117.5" y1="100" x2="145" y2="100" stroke="#e94560" strokeWidth="2"/>
				<line x1="205" y1="100" x2="232.5" y2="100" stroke="#0f3460" strokeWidth="2"/>
				
				{/* Base call indicators */}
				<rect x="72.5" y="90" width="30" height="20" fill="#e94560" opacity="0.7"/>
				<rect x="160" y="90" width="30" height="20" fill="#0f3460" opacity="0.7"/>
				<rect x="247.5" y="90" width="30" height="20" fill="#2fc4b2" opacity="0.7"/>
				
				{/* Labels */}
				<text x="87.5" y="100" fontFamily="Arial, sans-serif" fontSize="14" fill="#ffffff"
				      textAnchor="middle" dominantBaseline="middle">A
				</text>
				<text x="175" y="100" fontFamily="Arial, sans-serif" fontSize="14" fill="#ffffff"
				      textAnchor="middle" dominantBaseline="middle">T
				</text>
				<text x="262.5" y="100" fontFamily="Arial, sans-serif" fontSize="14" fill="#ffffff"
				      textAnchor="middle" dominantBaseline="middle">G
				</text>
			</svg>
		</div>
	)
}


export const CancerDetectionSVG: React.FC<SVGArtProps> = ({ width = 350, height = 200, className = '' }) => {
	const centerX = width / 2;
	const centerY = height / 2;
	
	return (
		<div className={`w-full h-full`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${width} ${height}`}
				width={width}
				height={height}
				className={`w-full h-full ${className}`}
				preserveAspectRatio="xMidYMid meet"
			>
				{/* Abstract AI network representation */}
				<path
					d={`M${width * 0.05},${centerY} Q${centerX},${height * 0.1} ${width * 0.95},${centerY} T${width * 0.05},${centerY}`}
					fill="none"
					stroke="#0f3460"
					strokeWidth="3"
				/>
				<path
					d={`M${width * 0.05},${centerY} Q${centerX},${height * 0.9} ${width * 0.95},${centerY} T${width * 0.05},${centerY}`}
					fill="none"
					stroke="#0f3460"
					strokeWidth="3"
				/>
				
				{/* Abstract cell representations */}
				<circle cx={centerX - width * 0.15} cy={centerY - height * 0.15} r={Math.min(width, height) * 0.1} fill="#2fc4b2" opacity="0.7"/>
				<circle cx={centerX + width * 0.15} cy={centerY + height * 0.15} r={Math.min(width, height) * 0.13} fill="#e94560" opacity="0.7"/>
				
				{/* AI analysis representation */}
				<path d={`M${centerX - width * 0.15},${centerY - height * 0.15} L${centerX + width * 0.15},${centerY + height * 0.15}`} stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
				<path d={`M${width * 0.1},${centerY} L${width * 0.9},${centerY}`} stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
				<path d={`M${centerX},${height * 0.1} L${centerX},${height * 0.9}`} stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
				
				{/* Abstract data points */}
				<circle cx={centerX - width * 0.15} cy={centerY - height * 0.15} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				<circle cx={centerX + width * 0.15} cy={centerY + height * 0.15} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				<circle cx={width * 0.1} cy={centerY} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				<circle cx={width * 0.9} cy={centerY} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				<circle cx={centerX} cy={height * 0.1} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				<circle cx={centerX} cy={height * 0.9} r={Math.min(width, height) * 0.015} fill="#ffffff"/>
				
				{/* Central focus point */}
				<circle cx={centerX} cy={centerY} r={Math.min(width, height) * 0.045} fill="#f9d56e"/>
			</svg>
		</div>
	);
};

export const DrugResponsePredictionSVG: React.FC<SVGArtProps> = ({width = 600, height = 200, className}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			height={height}
			className={`w-full h-full ${className}`}
		>
			<rect width={width} height={height} fill="#f0f4f8"/>
			
			<path
				d={`M${width * 0.1},${height * 0.5} Q${width * 0.25},${height * 0.2} ${width * 0.5},${height * 0.5} T${width * 0.9},${height * 0.5}`}
				fill="none"
				stroke="#94a3b8"
				strokeWidth="1.5"
			/>
			<path
				d={`M${width * 0.1},${height * 0.5} Q${width * 0.25},${height * 0.8} ${width * 0.5},${height * 0.5} T${width * 0.9},${height * 0.5}`}
				fill="none"
				stroke="#94a3b8"
				strokeWidth="1.5"
			/>
			
			<circle
				cx={width * 0.2}
				cy={height * 0.5}
				r={Math.min(width, height) * 0.05}
				fill="#7dd3fc"
				opacity="0.6"
			/>
			
			<rect
				x={width * 0.7}
				y={height * 0.3}
				width={width * 0.15}
				height={height * 0.1}
				fill="#fca5a5"
				opacity="0.4"
			/>
			<rect
				x={width * 0.7}
				y={height * 0.45}
				width={width * 0.15}
				height={height * 0.1}
				fill="#fca5a5"
				opacity="0.3"
			/>
			<rect
				x={width * 0.7}
				y={height * 0.6}
				width={width * 0.15}
				height={height * 0.1}
				fill="#fca5a5"
				opacity="0.2"
			/>
			
			<line
				x1={width * 0.25}
				y1={height * 0.5}
				x2={width * 0.7}
				y2={height * 0.35}
				stroke="#94a3b8"
				strokeWidth="0.5"
				opacity="0.5"
			/>
			<line
				x1={width * 0.25}
				y1={height * 0.5}
				x2={width * 0.7}
				y2={height * 0.5}
				stroke="#94a3b8"
				strokeWidth="0.5"
				opacity="0.5"
			/>
			<line
				x1={width * 0.25}
				y1={height * 0.5}
				x2={width * 0.7}
				y2={height * 0.65}
				stroke="#94a3b8"
				strokeWidth="0.5"
				opacity="0.5"
			/>
		</svg>
	);
};

export const CancerDetectionAI: React.FC<SVGArtProps> = ({width = 350, height = 200, className}) => {
	return (
		<div className={`w-full h-full`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={`0 0 ${width} ${height}`}
				width={width}
				height={height}
				className={`w-full h-full ${className}`}>
				<defs>
					<pattern id="cancerPattern" patternUnits="userSpaceOnUse" width="5" height="5">
						<circle cx="2.5" cy="2.5" r="1" fill="#ff4081"/>
					</pattern>
					<filter id="glow">
						<feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
						<feMerge>
							<feMergeNode in="coloredBlur"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>
				
				{/* Neutral Background */}
				{/*<rect width={width} height={height} fill="#f0f0f0"/>*/}
				
				{/* Cellular network */}
				<g id="cellNetwork" transform="translate(35, 10)">
					{/* Cells */}
					<path
						d="M50,25 L65,33 Q67,34 67,35 L67,55 Q67,56 65,57 L50,65 L35,57 Q33,56 33,55 L33,35 Q33,34 35,33 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path
						d="M100,25 L115,33 Q117,34 117,35 L117,55 Q117,56 115,57 L100,65 L85,57 Q83,56 83,55 L83,35 Q83,34 85,33 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path
						d="M150,25 L165,33 Q167,34 167,35 L167,55 Q167,56 165,57 L150,65 L135,57 Q133,56 133,55 L133,35 Q133,34 135,33 Z"
						fill="#ff6e7f" stroke="#e91e63" strokeWidth="1" opacity="0.9" filter="url(#glow)"/>
					<path
						d="M75,75 L90,83 Q92,84 92,85 L92,105 Q92,106 90,107 L75,115 L60,107 Q58,106 58,105 L58,85 Q58,84 60,83 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path
						d="M125,75 L140,83 Q142,84 142,85 L142,105 Q142,106 140,107 L125,115 L110,107 Q108,106 108,105 L108,85 Q108,84 110,83 Z"
						fill="url(#cancerPattern)" stroke="#e91e63" strokeWidth="1" opacity="0.9" filter="url(#glow)"/>
					<path
						d="M175,75 L190,83 Q192,84 192,85 L192,105 Q192,106 190,107 L175,115 L160,107 Q158,106 158,105 L158,85 Q158,84 160,83 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path
						d="M50,125 L65,133 Q67,134 67,135 L67,155 Q67,156 65,157 L50,165 L35,157 Q33,156 33,155 L33,135 Q33,134 35,133 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path
						d="M100,125 L115,133 Q117,134 117,135 L117,155 Q117,156 115,157 L100,165 L85,157 Q83,156 83,155 L83,135 Q83,134 85,133 Z"
						fill="#ff6e7f" stroke="#e91e63" strokeWidth="1" opacity="0.9" filter="url(#glow)"/>
					<path
						d="M150,125 L165,133 Q167,134 167,135 L167,155 Q167,156 165,157 L150,165 L135,157 Q133,156 133,155 L133,135 Q133,134 135,133 Z"
						fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
				</g>
				
				{/* Interconnections */}
				<g id="connections" stroke="#90caf9" strokeWidth="0.5" opacity="0.5" transform="translate(35, 10)">
					<line x1="67" y1="45" x2="83" y2="45"/>
					<line x1="117" y1="45" x2="133" y2="45"/>
					<line x1="50" y1="65" x2="75" y2="75"/>
					<line x1="100" y1="65" x2="125" y2="75"/>
					<line x1="150" y1="65" x2="175" y2="75"/>
					<line x1="92" y1="95" x2="108" y2="95"/>
					<line x1="142" y1="95" x2="158" y2="95"/>
					<line x1="75" y1="115" x2="50" y2="125"/>
					<line x1="125" y1="115" x2="100" y2="125"/>
					<line x1="175" y1="115" x2="150" y2="125"/>
					<line x1="67" y1="145" x2="83" y2="145"/>
					<line x1="117" y1="145" x2="133" y2="145"/>
				</g>
				
				{/* Enhanced Abstract AI representation */}
				<g transform="translate(280, 100)">
					<circle cx="0" cy="0" r="30" fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.6"/>
					<circle cx="0" cy="0" r="25" fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.7"/>
					<circle cx="0" cy="0" r="20" fill="none" stroke="#2196f3" strokeWidth="1" opacity="0.8"/>
					<path d="M-15,-15 Q0,-20 15,-15 Q20,0 15,15 Q0,20 -15,15 Q-20,0 -15,-15" fill="none"
					      stroke="#2196f3" strokeWidth="1" opacity="0.9"/>
					<circle cx="0" cy="0" r="5" fill="#2196f3" opacity="1"/>
					<path d="M0,-30 L0,-20 M0,20 L0,30 M-30,0 L-20,0 M20,0 L30,0" stroke="#2196f3" strokeWidth="1"
					      opacity="0.6"/>
					<path d="M-21,-21 L-14,-14 M21,-21 L14,-14 M-21,21 L-14,14 M21,21 L14,14" stroke="#2196f3"
					      strokeWidth="1" opacity="0.6"/>
				</g>
				
				{/* Analysis lines */}
				<g stroke="#90caf9" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.7" transform="translate(35, 10)">
					<line x1="167" y1="45" x2="245" y2="90"/>
					<line x1="192" y1="95" x2="245" y2="90"/>
					<line x1="167" y1="145" x2="245" y2="90"/>
				</g>
			</svg>
		</div>
	)
		;
};
