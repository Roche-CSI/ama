// HealthMonitoring.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import {ChartCard} from "./ChartCard.tsx";

const errorRateData = [
	{ time: '00:00', errorRate: 0.02 },
	{ time: '01:00', errorRate: 0.03 },
	{ time: '02:00', errorRate: 0.01 },
	{ time: '03:00', errorRate: 0.05 },
	{ time: '04:00', errorRate: 0.04 },
	{ time: '05:00', errorRate: 0.03 },
	{ time: '06:00', errorRate: 0.02 }
];

const modelOutputData = [
	{ output: 'Positive', count: 120 },
	{ output: 'Negative', count: 80 }
];

export const ModelHealth: React.FC = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Error Rates */}
			<ChartCard title={"Error Rates"}>
				<LineChart width={500} height={300} data={errorRateData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="time"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Line type="monotone" dataKey="errorRate" stroke="#ff7300"/>
				</LineChart>
			</ChartCard>
			
			{/* Model Outputs */}
			<ChartCard title={"Model Outputs"}>
				<BarChart width={500} height={300} data={modelOutputData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="output"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Bar dataKey="count" fill="#8884d8"/>
				</BarChart>
			</ChartCard>
		</div>
	);
};

