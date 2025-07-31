/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, LabelList, Cell} from 'recharts';
import {ChartCard} from "./ChartCard.tsx";

// Sample data
const performanceData = [
	{ month: 'Jan', accuracy: 0.85, latency: 120 },
	{ month: 'Feb', accuracy: 0.87, latency: 115 },
	{ month: 'Mar', accuracy: 0.88, latency: 110 },
	{ month: 'Apr', accuracy: 0.86, latency: 130 },
	{ month: 'May', accuracy: 0.87, latency: 125 },
	{ month: 'Jun', accuracy: 0.89, latency: 140 },
	{ month: 'Jul', accuracy: 0.90, latency: 135 }
];

const confusionMatrixData = [
	{ category: 'True Positive', value: 50 },
	{ category: 'False Positive', value: 10 },
	{ category: 'True Negative', value: 40 },
	{ category: 'False Negative', value: 20 }
];

// Sample real-time data for the 4th chart
const classificationMetrics = [
	{ metric: 'Accuracy', value: 0.85 },
	{ metric: 'Precision', value: 0.80 },
	{ metric: 'Recall', value: 0.78 },
	{ metric: 'F1 Score', value: 0.79 }
];

const regressionMetrics = [
	{ metric: 'MAE', value: 0.5 },
	{ metric: 'MSE', value: 0.3 },
	{ metric: 'RMSE', value: 0.4 }
];

const aucROCCurveData = [
	{ threshold: 0, tpr: 0, fpr: 0 },
	{ threshold: 0.1, tpr: 0.1, fpr: 0.05 },
	{ threshold: 0.2, tpr: 0.4, fpr: 0.1 },
	{ threshold: 0.3, tpr: 0.6, fpr: 0.2 },
	{ threshold: 0.4, tpr: 0.7, fpr: 0.3 },
	{ threshold: 0.5, tpr: 0.8, fpr: 0.4 },
	{ threshold: 0.6, tpr: 0.85, fpr: 0.5 },
	{ threshold: 0.7, tpr: 0.9, fpr: 0.6 },
	{ threshold: 0.8, tpr: 0.95, fpr: 0.7 },
	{ threshold: 0.9, tpr: 1, fpr: 0.8 }
];

const realTimeData = [
	{ time: '00:00', latency: 120 },
	{ time: '01:00', latency: 115 },
	{ time: '02:00', latency: 110 },
	{ time: '03:00', latency: 130 },
	{ time: '04:00', latency: 125 },
	{ time: '05:00', latency: 140 },
	{ time: '06:00', latency: 135 }
];


export const ModelPerformance: React.FC = () => {

	console.log("model performance");
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/*PERFORMANCE METRICS*/}
			<ChartCard title={"Performance Metrics"}>
				<LineChart data={performanceData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="month"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Line type="monotone" dataKey="accuracy" stroke="#8884d8"/>
					<Line type="monotone" dataKey="latency" stroke="#82ca9d"/>
				</LineChart>
			</ChartCard>
			
			{/*CONFUSION MATRIX*/}
			<ChartCard title={"Confusion Matrix"}>
				<BarChart data={confusionMatrixData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="category"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Bar dataKey="value" fill="#8884d8">
						<LabelList dataKey="value" position="top"/>
					</Bar>
				</BarChart>
			</ChartCard>
			
			{/*CLASSIFICATION METRICS*/}
			<ChartCard title={"Classification Metrics"}>
				<BarChart data={classificationMetrics}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="metric"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Bar dataKey="value" fill="#8884d8">
						<Cell key="0" fill="#8884d8"/>
						<Cell key="1" fill="#83a6ed"/>
						<Cell key="2" fill="#8dd1e1"/>
						<Cell key="3" fill="#82ca9d"/>
					</Bar>
				</BarChart>
			</ChartCard>
			
			{/*REGRESSION METRICS*/}
			<ChartCard title={"Regression Metrics"}>
				<BarChart data={regressionMetrics}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="metric"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Bar dataKey="value" fill="#8884d8">
						<Cell key="0" fill="#8884d8"/>
						<Cell key="1" fill="#83a6ed"/>
						<Cell key="2" fill="#8dd1e1"/>
					</Bar>
				</BarChart>
			</ChartCard>
			
			{/*AUC ROC CURVE*/}
			<ChartCard title={"AUC-ROC Curve"}>
				<LineChart data={aucROCCurveData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="threshold"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Line type="monotone" dataKey="tpr" stroke="#8884d8"/>
					<Line type="monotone" dataKey="fpr" stroke="#82ca9d"/>
				</LineChart>
			</ChartCard>
			
			{/*REALTIME LATENCY*/}
			<ChartCard title={"Real-Time Latency"}>
				<LineChart data={realTimeData}>
					<CartesianGrid strokeDasharray="3 3"/>
					<XAxis dataKey="time"/>
					<YAxis/>
					<Tooltip/>
					<Legend/>
					<Line type="monotone" dataKey="latency" stroke="#ff7300"/>
				</LineChart>
			</ChartCard>
		</div>
	);
};

