/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState} from 'react';
import { ModelPerformance} from "./ModelPerformance.tsx";
import {ModelHealth} from "./ModelHealth.tsx";
import {LogsAndAlerts} from "./LogsAndAlerts.tsx";
import {DriftDetection} from "./DriftDetection.tsx";
import {Link, Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {SectionBar} from "../../../../../components/sectionbar";
import {
	AddNewIcon,
	DriftDetectionIcon,
	HealthIcon,
	LogsAndAlertsIcon,
	PerformanceIcon
} from "../../../../../components/icons";
import {MonitoringMarketPlace} from "./MonitoringMarketPlace.tsx";
import {MonitoringList} from "./MonitoringList.tsx";

const GROUPS = [
	{ name: 'performance', label: 'Performance', link: './performance', icon: PerformanceIcon },
	{ name: 'health', label: 'Health', link: './health', icon: HealthIcon },
	{ name: 'logs-and-alerts', label: 'Logs and Alerts', link: './logs-and-alerts', icon: LogsAndAlertsIcon },
	{ name: 'drift-detection', label: 'Drift Detection', link: './drift-detection', icon: DriftDetectionIcon }
];


export const Monitoring: React.FC = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		console.log('clicked');
		navigate('new');
	};
	
	return (
		<div>
			<Routes>
				<Route path="/new" element={<MonitoringMarketPlace/>}/>
				<Route index element={<MonitoringList/>}/>
				<Route path={"*"} element={<MonitoringList/>}/>
			</Routes>
			<Outlet/>
		</div>
	);
};

const base: string = "btn btn-xs"
const className: string = `${base} hover:bg-gray-500 hover:text-white`;
const classNameSelected: string = `${base} hover:bg-black hover:text-white text-white bg-gray-900`;

interface SectionLabelProps {
	label: string;
	link: string;
	selected: boolean;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({selected, label, link}: SectionLabelProps) => {
	return (
		<Link to={link}
		      className={selected ? classNameSelected : className}>
			{label}
		</Link>
	)
}
