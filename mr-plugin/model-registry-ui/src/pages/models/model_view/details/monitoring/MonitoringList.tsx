/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useMemo, useState} from 'react';
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
import {useData} from "../../../../../api";
import {ExperimentProviderApi} from "../../../../../api/ExperimentProviderApi.ts";
import {MonitoringProviderApi} from "../../../../../api/MonitoringApi.tsx";

const GROUPS = [
	{ name: 'performance', label: 'Performance', link: './performance', icon: PerformanceIcon },
	{ name: 'health', label: 'Health', link: './health', icon: HealthIcon },
	{ name: 'logs-and-alerts', label: 'Logs and Alerts', link: './logs-and-alerts', icon: LogsAndAlertsIcon },
	{ name: 'drift-detection', label: 'Drift Detection', link: './drift-detection', icon: DriftDetectionIcon }
];


export const MonitoringList: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const pathSegments = location.pathname.split('/').filter(Boolean);
	// get the last segment of the URL
	const activeGroupName = pathSegments.length > 5 ? pathSegments[5] : "performance";
	console.log("activeGroupName", activeGroupName);
	
	const fetchPromise = useMemo(() => MonitoringProviderApi.fetchAll({
	}), []);
	const providers = useData(fetchPromise);
	
	console.log("providers", providers.data);
	const providerIds = providers.data?.map((provider: any) => provider.id);
	
	if (!providers.data && !providers.loading) {
		return null;
	}
	const handleClick = () => {
		navigate('new');
	};
	
	return (
		<div className="container">
			<div className='flex items-center gap-1'>
				 <h2 className="text-lg font-semibold flex items-center text-gray-700 flex-grow py-2">Monitoring</h2>
				<button
					className="btn btn-sm border border-base-300 self-center inline-flex items-center px-2.5 py-1.5 font-bold rounded hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mt-2 mb-3"
					onClick={() => handleClick()}>
					<AddNewIcon className="size-5"/>
					New Monitoring
				</button>
			</div>
			<div className="mb-6">
				<SectionBar items={GROUPS} activeItem={activeGroupName}/>
			</div>
			<Routes>
				<Route path="/performance" element={<ModelPerformance/>}/>
				<Route path="/health" element={<ModelHealth/>}/>
				<Route path="/logs-and-alerts" element={<LogsAndAlerts/>}/>
				<Route path="/drift-detection" element={<DriftDetection/>}/>
			</Routes>
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
