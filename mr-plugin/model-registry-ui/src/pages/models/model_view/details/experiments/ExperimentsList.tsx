/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState, useMemo, useEffect} from 'react';
import {USE_MOCK_API} from "../../../../../config.ts";
import {useData, WandbApi} from "../../../../../api";
import {MockWandbApi} from "../../../../../api/mocks";
import {RunChartView} from "./charts/RunChartView.tsx";
import {Link, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {SectionBar} from "../../../../../components/sectionbar";
import {
	AddNewIcon,
	ArtifactsIcon, ExperimentIcon, FileIcon, LinkIcon,
	ModelTrainingIcon,
	SummaryDataIcon,
	ValidationChartsIcon
} from "../../../../../components/icons";
import {ModelExperimentApi} from "../../../../../api/ModelExperimentApi.ts";
import {stringToDate} from "../../../../../utils/date_utils.ts";
import WBDashboard from "./charts/WBDashboard.tsx";
import ExperimentCard from "./ExperimentCard.tsx";
import {ExperimentProviderApi} from "../../../../../api/ExperimentProviderApi.ts";
import {ChevronDown} from "lucide-react";

const api = USE_MOCK_API ? MockWandbApi : ModelExperimentApi;

export const ExperimentsList = ({model, onNewButtonClicked}) => {
	const fetchPromise = useMemo(() => api.fetchAll({
		params: {
			asset_id: model.id,
		}
	}), []);
	const experiments = useData(fetchPromise);
	
	const providersPromise = useMemo(() => ExperimentProviderApi.fetchAll(), []);
	const providers = useData(providersPromise);
	console.log("providers", providers.data);
	
	// Group experiments by provider_id
	const experimentGroups = experiments.data ? experiments.data.reduce((acc, exp) => {
		if (!acc[exp.provider]) {
			acc[exp.provider] = [];
		}
		acc[exp.provider].push(exp);
		return acc;
	}, {}) : {};
	
	const providerIds = Object.keys(experimentGroups);
	const [selectedProvider, setSelectedProvider] = useState(providerIds.length > 0 ? providerIds[0] : null);
	const [activeExperiment, setActiveExperiment] = useState(experiments.data?.length > 0 ? experiments.data[0] : null);
	
	// Update activeExperiment when experiments change
	useEffect(() => {
		if (providerIds.length > 0 && !selectedProvider) {
			setSelectedProvider(providerIds[0]);
		}
	}, [providerIds]);
	
	const ExperimentIcon = () => {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="size-5 p-0.5 mr-2"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
				/>
			</svg>
		)
	}
	
	const ExperimentItem = ({experiment, onClick, activeExperiment, isLastItem}) => {
		const selected = activeExperiment && activeExperiment.id === experiment.id;
		
		return (
			<div
				className={`p-2 border-t ${isLastItem ? 'border-b' : ''} hover:bg-gray-100 border-[#64748b40] ${selected ? "bg-gray-200" : ""
				}`}
				onClick={() => onClick(experiment)}>
				<div className={`hover:text-blue-700 hover:font-semibold cursor-pointer text-sm flex ${selected ? "font-bold text-blue-700" : ""}`}
				>
					{/* Icon Placeholder */}
					<ExperimentIcon/>
					{experiment.data.name}
				</div>
				<span className="text-xs ml-8 text-gray-500">
					{stringToDate(experiment.created_at).toLocaleDateString()}
				</span>
			</div>
		)
	}
	
	const ProvidersDropdown = ({providers, selectedProvider, onSelect}) => {
		return (
			<div className="relative">
				{
					providers.data && (
						<div className="flex items-center gap-2">
							<select
								value={selectedProvider || ""}
								onChange={(e) => onSelect(e.target.value)}
								className="h-12 w-96 border-b border-base-300 font-semibold bg-gray-50 rounded-tl-md px-3 py-2 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
							>
								{
									providers.data.map((provider) => (
										<option key={provider.id}
										        value={provider.id}>
											{provider.title}
										</option>
									))}
							</select>
							<div
								className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
								<ChevronDown className="h-4 w-4"/>
							</div>
						</div>
					)}
			</div>
		)
	}
	
	// Sidebar Component
	const Sidebar = ({
		                 providers,
		                 setSelectedProvider,
		                 onProviderChange,
		                 experiments,
		                 onExperimentClick,
		                 onSummaryClick,
		                 activeExperiment
	                 }) => {
		if (!experiments || !experiments.length) {
			return null;
		}
		
		return (
			<div className="w-1/4 border-r border-base-300">
				<div>
					<ProvidersDropdown
						providers={providers}
						selectedProvider={selectedProvider}
						onSelect={onProviderChange}
					/>
					<h2 className={`text-md px-2 py-4 mt-6 border-t border-base-300 flex cursor-pointer hover:text-blue-700 hover:font-semibold ${activeExperiment ? "" : "bg-base-200"}`}
					    onClick={onSummaryClick}>
						<ExperimentIcon/>
						Summary
					</h2>
				</div>
				<ul>
					{experiments.map((exp, index) => (
						<li key={exp.id}>
							<ExperimentItem
								experiment={exp}
								onClick={onExperimentClick}
								activeExperiment={activeExperiment}
								isLastItem={index === experiments.length - 1}
							/>
						</li>
					))}
				</ul>
			</div>
		);
	};
	
	// Detail View Component
	const DetailView = ({experiments, activeExperiment}) => {
		if (!experiments) {
			return null;
		}
		
		if (!activeExperiment) {
			return (
				<div className="pl-4 w-3/4 mt-6 mr-6">
					<WBDashboard experiments={experiments}/>
				</div>
			);
		}
		
		return (
			<div className="pl-4 w-3/4">
				<div className="mb-8 mt-8 pr-6">
					<ExperimentCard experiment={activeExperiment}/>
				</div>
			</div>
		);
	};
	
	return (
		<div className="container mb-6">
			<div className="flex items-center gap-1 mb-6 justify-end">
				<div className="flex items-center justify-between w-full">
					<p className="text-lg font-semibold">Experiments</p>
					<div>
						<button className="btn btn-sm border border-base-300 hover:bg-gray-50 transition-colors"
						        onClick={onNewButtonClicked}>
							<AddNewIcon className="size-5"/>
							<span className="ml-1">New Experiment</span>
						</button>
					</div>
				</div>
			</div>
			<div className="flex border border-base-300 rounded-lg">
				<Sidebar
					providers={providers}
					setSelectedProvider={selectedProvider}
					onProviderChange={setSelectedProvider}
					experiments={experiments.data}
					onExperimentClick={setActiveExperiment}
					activeExperiment={activeExperiment}
					onSummaryClick={() => setActiveExperiment(null)}
				/>
				
				<DetailView activeExperiment={activeExperiment}
				            experiments={experiments.data}/>
			</div>
		</div>
	);
};
