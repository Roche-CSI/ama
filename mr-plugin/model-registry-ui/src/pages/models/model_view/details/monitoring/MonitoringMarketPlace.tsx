import React from 'react';
import integrationData from "./sample_data.json";
import {ExperimentVendorCard} from "./ExperimentVendorCard.tsx";
import {MonitoringVendorCard} from "./MonitoringVendorCard.tsx";
import {ArrowLeft} from "lucide-react";

export const MonitoringMarketPlace = () => {
	const actions = integrationData;
	
	const handleBack = () => {
		window.history.back();
	};
	
	return (
		<div className="container py-2">
			<div className="flex items-center gap-4 mb-6 w-full justify-between">
				<h1 className="text-xl">Monitoring Automations</h1>
				<button
					onClick={handleBack}
					className="btn btn-sm border border-base-300"
				>
					<ArrowLeft className="w-5 h-5"/>
					<span>Back</span>
				</button>
			
			</div>
			<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
				{
					actions.map((action, index) => (
						<MonitoringVendorCard key={index} vendor={action} disabled={index > 3}/>
					))
				}
			</div>
		</div>
	);
};


