import React from "react";
import {ChartCard} from "../../monitoring/ChartCard";
import {RunHistoryChart} from "./RunHistoryChart";
import {RunHistoryScatter} from "./RunHistoryScatter";
import {RunHistoryAreaChart} from "./RunHistoryAreaChart";
import {CombinedChart} from "../CombinedChart";
import {ExperimentInterface} from "../../../../../../api/data_types/experiment";

const data = [
	{_step: 0, acc: 0.586, loss: 0.704},
	{_step: 1, acc: 0.624, loss: 0.430},
	{_step: 2, acc: 0.795, loss: 0.317},
	{_step: 3, acc: 0.763, loss: 0.292},
	{_step: 4, acc: 0.695, loss: 0.289},
	{_step: 5, acc: 0.774, loss: 0.206},
	{_step: 6, acc: 0.760, loss: 0.158},
	{_step: 7, acc: 0.778, loss: 0.131}
];

export const RunChartView: React.FC<{experiments: ExperimentInterface[]}> = ({experiments}) => {
	
	// collect _step, acc, loss from all experiments
	const data = experiments.map(experiment => {
		const run = experiment.data.summary;
		return {
			_step: run.step,
			acc: run.acc,
			loss: run.loss
		}
	});
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-4">
			<ChartCard title="Run History">
				<RunHistoryChart data={data}/>
			</ChartCard>
			<ChartCard title="Run History">
				<RunHistoryChart data={data}/>
			</ChartCard>
			<ChartCard title="Run History Scatter">
				<RunHistoryScatter/>
			</ChartCard>
			<ChartCard title="Run History Area">
				<RunHistoryAreaChart/>
			</ChartCard>
			<ChartCard title="Run History Combined">
				<CombinedChart/>
			</ChartCard>
		</div>
	)
}
