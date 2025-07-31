import React from "react";
import {PRDetails, PRList, ReviewComponent} from "./PRList.tsx";

const ModelRegistryPRWorkflow = () => {
	return (
		<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			<div className="px-4 py-6 sm:px-0">
				<h1 className="text-2xl font-semibold text-gray-900 mb-6">Model Registry PR Workflow</h1>
				<div className="space-y-8">
					<PRList />
					<PRDetails />
					<ReviewComponent />
				</div>
			</div>
		</div>
	);
};

export default ModelRegistryPRWorkflow;
