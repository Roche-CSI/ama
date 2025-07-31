import React from 'react';
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';

const data = [
	{ _step: 0, acc: 0.586, loss: 0.704 },
	{ _step: 1, acc: 0.624, loss: 0.430 },
	{ _step: 2, acc: 0.795, loss: 0.317 },
	{ _step: 3, acc: 0.763, loss: 0.292 },
	{ _step: 4, acc: 0.695, loss: 0.289 },
	{ _step: 5, acc: 0.774, loss: 0.206 },
	{ _step: 6, acc: 0.760, loss: 0.158 },
	{ _step: 7, acc: 0.778, loss: 0.131 }
];

export const RunHistoryScatter: React.FC = () => {
	return (
		<ScatterChart width={500} height={300}
			margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
		>
			<CartesianGrid />
			<XAxis type="number" dataKey="_step" name="Step" />
			<YAxis type="number" dataKey="acc" name="Accuracy" />
			<Tooltip cursor={{ strokeDasharray: '3 3' }} />
			<Scatter name="Accuracy" data={data} fill="#8884d8" />
			<YAxis type="number" dataKey="loss" name="Loss" orientation="right" />
			<Scatter name="Loss" data={data} fill="#82ca9d" />
		</ScatterChart>
	);
};

