import React, { useState } from 'react';
import { Database, Cpu, FlaskConical, Box, Cloud, ChevronDown, ChevronUp } from 'lucide-react';

const LegendItem = ({ icon: Icon, bgColor, label, description }) => (
	<div className="flex items-center gap-3 mb-4">
		<div className={`p-2 rounded-lg ${bgColor}`}>
			<Icon size={20} className="text-white" />
		</div>
		<div>
			<div className="font-medium">{label}</div>
			<div className="text-sm text-gray-600">{description}</div>
		</div>
	</div>
);

const Legend = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	
	return (
		<div className="absolute top-4 right-4 z-50">
			{/* Header/Toggle Button */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center justify-between w-72 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-t-lg border border-base-300 hover:bg-white/95 transition-colors"
			>
				<span className="font-semibold">Legend</span>
				{isExpanded ? (
					<ChevronUp size={20} className="text-gray-600" />
				) : (
					<ChevronDown size={20} className="text-gray-600" />
				)}
			</button>
			
			{/* Collapsible Content */}
			<div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
            `}>
				<div className="w-72 bg-white/90 backdrop-blur-sm rounded-b-lg border-x border-b border-base-300">
					<div className="p-6">
						<h3 className="font-semibold mb-4">Component Types</h3>
						<LegendItem
							icon={Database}
							bgColor="bg-blue-500"
							label="Dataset"
							description="Training data, reference genomes, and validation sets"
						/>
						<LegendItem
							icon={Cpu}
							bgColor="bg-purple-500"
							label="Model"
							description="Neural network architectures and trained models"
						/>
						<LegendItem
							icon={FlaskConical}
							bgColor="bg-green-500"
							label="Experiment"
							description="Training runs, validations, and benchmarks"
						/>
						<LegendItem
							icon={Box}
							bgColor="bg-orange-500"
							label="Docker"
							description="Containerized model pipeline packages"
						/>
						<LegendItem
							icon={Cloud}
							bgColor="bg-gray-500"
							label="Deployment"
							description="Production environments and serving endpoints"
						/>
						
						<h3 className="font-semibold mt-6 mb-4">Dependencies</h3>
						<div className="space-y-2 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<div className="w-16 h-0.5 bg-gray-300"></div>
								<span>Direct dependency</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-16 h-0.5 border-b border-dashed border-gray-400"></div>
								<span>Indirect influence</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Legend;
