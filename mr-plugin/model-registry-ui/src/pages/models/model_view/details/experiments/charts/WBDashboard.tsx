import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';
import {ChartCard} from "../../monitoring/ChartCard";
import {ExperimentInterface} from "../../../../../../api/data_types/experiment";

const WandbDashboard: React.FC<{experiments: ExperimentInterface[]}> = ({experiments}) => {
	const displayData = experiments.map((run, index) => {
		return {
			"id": run.experiment_id,
			"name": run.data.name,
			"acc": run.data.summary.acc,
			"loss": run.data.summary.loss,
			"_runtime": run.data.summary._runtime,
			"_timestamp": run.data.summary._timestamp
		}
	}).sort((a, b) => a._timestamp - b._timestamp);
	
	return (
		<div className="space-y-12 mt-6">
			{/* Performance Overview */}
			<ChartCard title={"Performance Overview"}>
				<div className="h-96">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={displayData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
							<XAxis
								dataKey="name"
								angle={-45}
								textAnchor="end"
								height={100}
								stroke="#9CA3AF"
							/>
							<YAxis yAxisId="left" stroke="#9CA3AF"/>
							<YAxis yAxisId="right" orientation="right" stroke="#9CA3AF"/>
							<Tooltip
								contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}}
								labelStyle={{color: '#E5E7EB'}}
							/>
							<Legend/>
							<Line yAxisId="left" type="monotone" dataKey="acc" stroke="#60A5FA" name="Accuracy"/>
							<Line yAxisId="right" type="monotone" dataKey="loss" stroke="#F87171" name="Loss"/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</ChartCard>
			
			{/* Accuracy vs Loss Scatter */}
			<ChartCard title={"Accuracy vs Loss Distribution"}>
				<div className="h-96">
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
							<XAxis
								type="number"
								dataKey="loss"
								name="Loss"
								stroke="#9CA3AF"
								domain={[0, 'auto']}
							/>
							<YAxis
								type="number"
								dataKey="acc"
								name="Accuracy"
								stroke="#9CA3AF"
								domain={[0.7, 1]}
							/>
							<Tooltip
								contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}}
								labelStyle={{color: '#E5E7EB'}}
							/>
							<Scatter
								name="Runs"
								data={displayData}
								fill="#60A5FA"
							/>
						</ScatterChart>
					</ResponsiveContainer>
				</div>
			</ChartCard>
			
			{/* Runtime Distribution */}
			<ChartCard title={"Runtime Distribution"}>
				<div className="h-96">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={displayData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
							<XAxis
								dataKey="name"
								angle={-45}
								textAnchor="end"
								height={100}
								stroke="#9CA3AF"
							/>
							<YAxis stroke="#9CA3AF"/>
							<Tooltip
								contentStyle={{backgroundColor: '#1F2937', border: '1px solid #374151'}}
								labelStyle={{color: '#E5E7EB'}}
							/>
							<Bar dataKey="_runtime" fill="#60A5FA" name="Runtime (s)"/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</ChartCard>
		</div>
	);
};

export default WandbDashboard;
