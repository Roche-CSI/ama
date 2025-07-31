import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts';

// const data = [
// 	{_step: 0, acc: 0.586, loss: 0.704},
// 	{_step: 1, acc: 0.624, loss: 0.430},
// 	{_step: 2, acc: 0.795, loss: 0.317},
// 	{_step: 3, acc: 0.763, loss: 0.292},
// 	{_step: 4, acc: 0.695, loss: 0.289},
// 	{_step: 5, acc: 0.774, loss: 0.206},
// 	{_step: 6, acc: 0.760, loss: 0.158},
// 	{_step: 7, acc: 0.778, loss: 0.131}
// ];

export const RunHistoryChart: React.FC<{data: object[]}> = ({data}) => {
	return (
		<LineChart width={500} height={300}
			data={data}
			margin={{top: 20, right: 30, left: 20, bottom: 5}}>
			<CartesianGrid strokeDasharray="3 3"/>
			<XAxis dataKey="_step"/>
			<YAxis yAxisId="left" orientation="left"/>
			<YAxis yAxisId="right" orientation="right"/>
			<Tooltip/>
			<Legend/>
			<Line
				yAxisId="left"
				type="monotone"
				dataKey="acc"
				stroke="#8884d8"
				activeDot={{r: 8}}
				name="Accuracy"
			/>
			<Line
				yAxisId="right"
				type="monotone"
				dataKey="loss"
				stroke="#82ca9d"
				name="Loss"
			/>
		</LineChart>
	);
};
