// DriftDetection.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {ChartCard} from "./ChartCard.tsx";

const featureDistributionData = [
	{ time: '2024-08-01', feature1: 0.4, feature2: 0.6 },
	{ time: '2024-08-02', feature1: 0.5, feature2: 0.7 },
	{ time: '2024-08-03', feature1: 0.6, feature2: 0.5 },
	{ time: '2024-08-04', feature1: 0.5, feature2: 0.6 }
];

const targetDistributionData = [
	{ time: '2024-08-01', targetA: 0.3, targetB: 0.7 },
	{ time: '2024-08-02', targetA: 0.4, targetB: 0.6 },
	{ time: '2024-08-03', targetA: 0.5, targetB: 0.5 },
	{ time: '2024-08-04', targetA: 0.4, targetB: 0.6 }
];

export const DriftDetection: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			
			{/* Feature Distribution Changes */}
			<ChartCard title={"Feature Distribution Changes"}>
				<LineChart width={500} height={300} data={featureDistributionData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="time"/>
					<YAxis/>
					<Tooltip/>
					<Line type="monotone" dataKey="feature1" stroke="#8884d8"/>
					<Line type="monotone" dataKey="feature2" stroke="#82ca9d"/>
				</LineChart>
			</ChartCard>
			
			{/* Target Distribution Changes */}
			<ChartCard title={"Target Distribution Changes"}>
				<LineChart width={500} height={300} data={targetDistributionData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="time"/>
					<YAxis/>
					<Tooltip/>
					<Line type="monotone" dataKey="targetA" stroke="#8884d8"/>
					<Line type="monotone" dataKey="targetB" stroke="#82ca9d"/>
				</LineChart>
			</ChartCard>
		</div>
	);
};
