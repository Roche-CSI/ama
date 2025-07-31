/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useMemo, useState} from 'react';
import {AddNewIcon} from "../../../../../components/icons";
import {AssetActionApi} from "../../../../../api/AssetActionApi.ts";
import {stringToDate} from "../../../../../utils/date_utils.ts";
import {ActionRunInterface, AssetActionInterface} from "../../../../../api/data_types/action";
import {ActionRunApi} from "../../../../../api/ActionRunApi.ts";
import {Spinner} from "../../../../../components/spinner";
import {useData} from "../../../../../api";
import { Activity, Github, GitBranch } from 'lucide-react';

const getProviderIcon = (providerName) => {
	switch (providerName.toLowerCase()) {
		case 'github':
			return <Github className="w-5 h-5" />;
		default:
			return <Activity className="w-5 h-5" />;
	}
};

const Badge = ({ children, variant = 'default', className = "" }) => {
	const variants: Record<string, string> = {
		default: 'bg-gray-200 text-gray-700',
		primary: 'bg-blue-100 text-blue-700',
		success: 'bg-green-100 text-green-700'
	};
	
	return (
		<span className={`text-xs px-2 py-0.5 rounded-full ${variants[variant]} ${className}`}>
			{children}
		</span>
	);
};

const ActionItem = ({ action, selected, onClick }) => {
	const provider = action.action.provider;
	
	return (
		<div
			className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-l-4 ${
				selected?.id === action.id ? 'border-l-blue-500 bg-blue-50 hover:bg-blue-50' : 'border-l-transparent'
			}`}
			onClick={() => onClick(action)}
		>
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0 mt-1">
					{getProviderIcon(provider.name)}
				</div>
				
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-gray-900">
							{action.action.title}
						</p>
						<Badge variant="primary" className="text-xs font-semibold">
							{provider.title}
						</Badge>
					</div>
					
					<p className="mt-1 text-sm text-gray-600 line-clamp-2">
						{action.action.description}
					</p>
					
					<div className="mt-2 flex flex-wrap items-center gap-2 justify-end">
						{/*<span className="flex items-center text-xs text-gray-500">*/}
						{/*	<Activity className="w-3 h-3 mr-1" />*/}
						{/*	{stringToDate(action.created_at).toLocaleString()}*/}
						{/*</span>*/}
						
						<Badge>
							{action.trigger_type.replace(/[()'"]/g, '').replace(/,/g, '')}
						</Badge>
						
						{action.config && action.config[0]?.environment && (
							<Badge variant="success">
								{action.config[0].environment}
							</Badge>
						)}
					</div>
					
					{/*{*/}
					{/*	action.config && action.config[0]?.metric_name && (*/}
					{/*	<div className="mt-2 flex items-center gap-2">*/}
					{/*		<span className="text-xs text-gray-500">*/}
					{/*			Metric: {action.config[0].metric_name}*/}
					{/*		</span>*/}
					{/*		<span className="text-xs text-gray-500">*/}
					{/*			Threshold: {action.config[0].threshold}*/}
					{/*		</span>*/}
					{/*	</div>*/}
					{/*)}*/}
				</div>
			</div>
		</div>
	);
};

//
// const ActionItem: React.FC<{
// 	action: AssetActionInterface,
// 	selected?: AssetActionInterface,
// 	onClick: (arg0: AssetActionInterface) => void
// }> = ({action, selected, onClick}) => {
// 	console.log('ActionItem', JSON.stringify(action));
// 	return (
// 		<div
// 			className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
// 				selected?.id === action.id ? 'bg-blue-50 hover:bg-blue-50' : ''
// 			}`}
// 			onClick={() => onClick(action)}
// 		>
// 			<div className="flex items-center space-x-3">
// 				<div className="flex-1 min-w-0">
// 					<p className="text-sm font-medium truncate">
// 						{action.action.title}
// 					</p>
// 					<p className="text-xs text-gray-500">
// 						{action.action.description}
// 					</p>
// 					<div className="flex items-center gap-2 mt-1">
// 										<span className="text-xs text-gray-400">
// 											Created: {stringToDate(action.created_at).toLocaleString()}
// 										</span>
// 						<span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
// 											{action.trigger_type.replace(/[()'"]/g, '')}
// 										</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// Left panel component for AssetActions list
const AssetActionsList = ({actions, selectedAction, onActionSelect, onNewAction}) => {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 border-x border-base-300">
				<ul className="h-full overflow-y-auto">
					{actions.map((action) => (
						<li key={action.id} className="border-b border-base-300">
							<ActionItem
								action={action}
								selected={selectedAction}
								onClick={onActionSelect}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};


const ActionRunItem = ({run}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	
	const getStateColor = (state) => {
		const colors = {
			completed: 'bg-green-100 text-green-800',
			failed: 'bg-red-100 text-red-800',
			running: 'bg-blue-100 text-blue-800',
			pending: 'bg-yellow-100 text-yellow-800'
		};
		return colors[state.toLowerCase()] || 'bg-gray-100 text-gray-800';
	};
	
	// Helper to format JSON data
	const JsonDisplay = ({data, title}) => {
		if (!data || Object.keys(data).length === 0) return null;
		
		return (
			<div className="mt-2">
				<h5 className="text-sm font-medium text-gray-300 mb-1">{title}</h5>
				<pre
					className="text-xs bg-gray-900 p-3 rounded-lg overflow-auto max-h-48 text-gray-300 font-mono border border-gray-700">
          {JSON.stringify(data, null, 2)}
        </pre>
			</div>
		);
	};
	
	const LogEntry = ({log}) => (
		<div className="flex items-start space-x-2 text-xs font-mono">
      <span className="text-gray-500 whitespace-nowrap">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
			<span className="text-gray-300">
        {log.message}
      </span>
			{log.metadata && Object.keys(log.metadata).length > 0 && (
				<span className="text-gray-500">
          {JSON.stringify(log.metadata)}
        </span>
			)}
		</div>
	);
	
	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 transition-all duration-200">
			{/* Header - Always visible */}
			<div
				className="flex justify-between items-start mb-2 cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex-1">
					<h4 className="text-sm font-medium flex items-center gap-2">
						{run.description}
						<svg
							className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M19 9l-7 7-7-7"/>
						</svg>
					</h4>
					<div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStateColor(run.state)}`}>
              {run.state}
            </span>
						<span className="text-xs text-gray-500">
              Attempt {run.attempt_number} of {run.max_retries}
            </span>
					</div>
				</div>
				<div className="text-right text-xs text-gray-500">
					{stringToDate(run.started_at).toLocaleTimeString()}
				</div>
			</div>
			
			{/* Preview Logs - Always visible */}
			<div className="mt-3 space-y-1">
				{!isExpanded && run.essential_logs?.slice(0, 2).map((log, index) => (
					<div key={index} className="text-xs text-gray-600 font-mono bg-gray-50 p-1 rounded">
						<span className="text-gray-400">{stringToDate(log.timestamp).toLocaleTimeString()}</span>
						{' '}{log.message}
					</div>
				))}
			</div>
			
			{/* Expanded Content */}
			{isExpanded && (
				<div className="mt-4 space-y-4">
					{/* Timing Information */}
					<div className="bg-gray-900 rounded-lg p-4 text-gray-300">
						<div className="grid grid-cols-2 gap-4 text-xs mb-4">
							<div>
								<span className="text-gray-500">Started:</span>
								<span className="ml-2">{stringToDate(run.started_at).toLocaleString()}</span>
							</div>
							{run.completed_at && (
								<div>
									<span className="text-gray-500">Completed:</span>
									<span className="ml-2">{stringToDate(run.completed_at).toLocaleString()}</span>
								</div>
							)}
						</div>
						
						{/* Essential Logs Section */}
						{run.essential_logs && run.essential_logs.length > 0 && (
							<div className="mb-4">
								<h5 className="text-sm font-medium text-gray-300 mb-2">Logs</h5>
								<div className="space-y-1 bg-gray-800 p-3 rounded-lg">
									{run.essential_logs.map((log, index) => (
										<LogEntry key={index} log={log}/>
									))}
								</div>
							</div>
						)}
						
						{/* Input Data */}
						<JsonDisplay data={run.input_data} title="Input Data"/>
						
						{/* Output Data */}
						<JsonDisplay data={run.output_data} title="Output Data"/>
						
						{/* Provider Response */}
						<JsonDisplay data={run.provider_response} title="Provider Response"/>
						
						{/* Detailed Logs Link */}
						{run.detailed_logs && (
							<div className="mt-4">
								<h5 className="text-sm font-medium text-gray-300 mb-1">Detailed Logs</h5>
								<div className="text-xs">
									<a
										href={run.detailed_logs.bucket_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-400 hover:text-blue-300 transition-colors"
									>
										View Full Logs
									</a>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

// Right panel component for Action runs
const ActionRunList = ({action}) => {
	//LEFT SECTION DATA
	const fetchPromise = useMemo(() => ActionRunApi.fetchAll({
		params: {
			asset_action: action?.id,
		}
	}), [action]); // Ensure fetchAll is only called once
	const {data, loading, error} = useData(fetchPromise);
	
	if (!action) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				Select an action to view its runs
			</div>
		);
	}
	
	if (loading || !data) {
		return (
			<div className="flex items-center justify-center h-full">
				<Spinner/>
			</div>
		);
	}
	
	return (
		<div className="flex flex-col h-full pr-6">
			<div className="py-4">
				<h3 className="text-lg font-medium">{action.action.title}</h3>
				<p className="text-sm text-gray-600">{action.action.description}</p>
			</div>
			
			{/* Action Runs List */}
			<div className="flex-1 overflow-y-auto">
				{data.length === 0 ? (
					<div className="text-sm text-gray-500">No runs found for this action</div>
				) : (
					data.map((run, index) => (
						<ActionRunItem key={index} run={run}/>
					))
				)}
			</div>
		</div>
	);
};

export const ActionsListView = ({model, onNewAction}) => {
	const [actionList, setActionList] = useState([]);
	const [selectedAction, setSelectedAction] = useState(null);
	
	const handleActionSelect = (action) => {
		setSelectedAction(action);
	};
	
	const handleClick = () => {
		console.log('clicked');
		onNewAction && onNewAction();
	};
	
	useEffect(() => {
		AssetActionApi.fetchAll({
			params: {
				assetId: model.id,
				recursive: true
			}
		}).then((data) => {
			setActionList(data);
			if (data && data.length > 0) {
				setSelectedAction(data[0]);
			}
		}).catch((error) => {
			console.log('ActionsList', error);
		});
	}, [model.id]);
	
	if (!actionList || actionList.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500">
				No actions found
			</div>
		);
	}
	
	return (
		<div className="relative h-full">
			<div className='flex justify-between items-center gap-1 w-full mb-6'>
				<p className="text-lg font-semibold">Actions</p>
				<button
					className="btn btn-sm border border-base-300"
					onClick={() => handleClick()}
				>
					<AddNewIcon className="size-5"/>
					New Action
				</button>
			</div>
			
			<div
				className='relative flex h-[calc(100%-3rem)] items-stretch justify-center gap-6 border border-base-300 rounded-lg'>
				<div className="left basis-1/3 flex flex-col">
					<AssetActionsList
						actions={actionList}
						selectedAction={selectedAction}
						onActionSelect={handleActionSelect}
						onNewAction={onNewAction}
					/>
				</div>
				<div className="right basis-2/3 h-full">
					<ActionRunList action={selectedAction}/>
				</div>
			</div>
		</div>
	);
};
