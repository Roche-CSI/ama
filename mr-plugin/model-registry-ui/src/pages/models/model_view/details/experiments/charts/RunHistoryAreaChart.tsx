import React from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';

// const data = [
// 	{ _step: 0, acc: 0.586, loss: 0.704 },
// 	{ _step: 1, acc: 0.624, loss: 0.430 },
// 	{ _step: 2, acc: 0.795, loss: 0.317 },
// 	{ _step: 3, acc: 0.763, loss: 0.292 },
// 	{ _step: 4, acc: 0.695, loss: 0.289 },
// 	{ _step: 5, acc: 0.774, loss: 0.206 },
// 	{ _step: 6, acc: 0.760, loss: 0.158 },
// 	{ _step: 7, acc: 0.778, loss: 0.131 }
// ];

export const RunHistoryAreaChart: React.FC<{data: object[]}> = ({data}) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="_step" />
				<YAxis />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="acc"
					stroke="#8884d8"
					fillOpacity={0.3}
					fill="#8884d8"
					name="Accuracy"
				/>
				<Area
					type="monotone"
					dataKey="loss"
					stroke="#82ca9d"
					fillOpacity={0.3}
					fill="#82ca9d"
					name="Loss"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};
