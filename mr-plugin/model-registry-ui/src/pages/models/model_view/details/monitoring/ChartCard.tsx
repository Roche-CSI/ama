import React from "react";
import {ResponsiveContainer} from "recharts";

interface ChartCardProps {
	title: string;
	children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
	return (
		<div className="h-96 bg-white drop-shadow-sm p-4 border border-gray-300">
			<h2 className="text-center font-semibold mb-4 text-gray-700">
				{title}
			</h2>
			<ResponsiveContainer width="100%">
				{children}
			</ResponsiveContainer>
		</div>
	);
};
