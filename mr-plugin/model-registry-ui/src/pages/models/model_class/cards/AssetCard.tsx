/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {
	Calendar, UserCircle2, Folder, Box, Hash, Tag, Copy, Check, CheckCircle, Lock, FlaskConical,
	Trash, AlertTriangle, XCircle, Beaker, Rocket, FileEdit, Layers, ShieldCheck, HelpCircle, Archive
} from "lucide-react";
import {Asset, AssetPhase} from "../../../../api/data_types/asset";
import {stringToDate} from "../../../../utils/date_utils.ts";
import {StatusEnums} from "../../../../api/Status.ts";

interface AssetCardProps {
	item: Asset;
	className?: string;
}


const PHASE_CONFIGS = {
	[AssetPhase.NOT_APPLICABLE]: {
		icon: HelpCircle,
		label: 'not set',
		className: 'bg-gray-50 text-gray-500'
	},
	[AssetPhase.DRAFT]: {
		icon: FileEdit,
		label: 'Draft',
		className: 'bg-gray-100 text-gray-600'
	},
	[AssetPhase.EXPERIMENTAL]: {
		icon: FlaskConical,
		label: 'Experimental',
		className: 'bg-purple-50 text-purple-700 font-semibold'
	},
	[AssetPhase.BETA]: {
		icon: Layers,
		label: 'Beta',
		className: 'bg-amber-50 text-amber-700 font-semibold'
	},
	[AssetPhase.RELEASED]: {
		icon: Rocket,
		label: 'Released',
		className: 'bg-blue-50 text-blue-700 font-semibold'
	},
	[AssetPhase.STABLE]: {
		icon: ShieldCheck,
		label: 'Stable',
		className: 'bg-green-50 text-green-700 font-semibold'
	}
};

const formatNumber = (num: number): string => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatBytes = (bytes: number, decimals: number = 2): string => {
	if (!+bytes) return '0 Bytes'
	
	const k: number = 1024
	const dm: number = decimals < 0 ? 0 : decimals
	const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	
	const i: number = Math.floor(Math.log(bytes) / Math.log(k))
	
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const BADGE_COLORS = {
	[StatusEnums.PRIVATE]: "bg-blue-100 text-blue-600",
	[StatusEnums.OBSOLETE]: "bg-red-100 text-red-600",
	[StatusEnums.DEPRECATED]: "bg-yellow-100 text-orange-600",
	[StatusEnums.ARCHIVED]: "bg-orange-100 text-orange-600",
	[StatusEnums.ARCHIVE_FLAGGED]: "bg-orange-400 text-white",
	[StatusEnums.PUBLIC]: "bg-green-200 text-green-950",
};

const getStatusConfig = (status: number) => {
	switch (status) {
		case StatusEnums.PUBLIC:
			return {icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Public'};
		case StatusEnums.PRIVATE:
			return {icon: Lock, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Private'};
		case StatusEnums.DELETED:
			return {icon: Trash, color: 'text-red-500', bgColor: 'bg-red-100', label: 'Deleted'};
		case StatusEnums.DEPRECATED:
			return {icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-yellow-100', label: 'Deprecated'};
		case StatusEnums.OBSOLETE:
			return {icon: XCircle, color: 'text-red-500', bgColor: 'bg-gray-100', label: 'Obsolete'};
		case StatusEnums.ARCHIVE_FLAGGED:
			return {icon: Archive, color: 'text-orange-500', bgColor: 'bg-orange-100', label: 'Archived'};
		case StatusEnums.ARCHIVED:
			return {icon: Archive, color: 'text-orange-500', bgColor: 'bg-orange-100', label: 'Archived'};
		default:
			return {icon: CheckCircle, color: 'text-gray-500', bgColor: 'bg-gray-100', label: 'Unknown'};
	}
};

const AssetCard: React.FC<AssetCardProps> = ({item, className}) => {
	const size = item.getSize(true);
	const numFiles = item.getNumObjects(true);
	const [copied, setCopied] = React.useState(false);
	
	const handlePath = `${className}/${item.seq_id}`;
	const badgeColor = BADGE_COLORS[item.status];
	const showStatusBadge = item.status !== 1;
	const {icon: StatusIcon, color: statusColor, label: statusLabel} = getStatusConfig(item.status);
	console.log("asset", item.title, item.status);
	
	const phase = item.phase || AssetPhase.NOT_APPLICABLE;
	console.log('phase', phase);
	const phaseConfig = PHASE_CONFIGS[phase];
	const PhaseIcon = phaseConfig.icon;
	
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(handlePath);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text:', err);
		}
	};
	
	return (
		<div className="bg-white rounded-xl border border-base-300 hover:shadow-md transition-all duration-300 h-48">
			<div className="p-6 h-full flex flex-col justify-between">
				{/* Header Section */}
				<div className="flex items-start justify-between pb-6">
					<div className="flex-grow mr-4">
						<div className="flex items-center gap-2 flex-wrap justify-between">
							<RouterLink
								to={item.link}
								className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
							>
								{item.identifier}
							</RouterLink>
							<div className="flex">
								{/* Status Badge */}
								{showStatusBadge && (
									<span
										className={`px-2 py-0.5 text-[10px] flex-shrink-0 ${badgeColor} rounded-sm whitespace-nowrap flex items-center gap-1`}>
                                    <StatusIcon className="w-3 h-3"/>
										{statusLabel}
                                </span>
								)}
								
								{/* Phase Badge */}
								{phase !== AssetPhase.NOT_APPLICABLE && (
									<span
										className={`px-2 py-0.5 text-[10px] flex-shrink-0 ${phaseConfig.className} rounded-sm whitespace-nowrap flex items-center gap-1`}>
                                    <PhaseIcon className="w-3 h-3"/>
										{!showStatusBadge && phaseConfig.label}
                                </span>
								)}
							</div>
						</div>
						<p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2">
							{item.description}
						</p>
					</div>
				</div>
				
				{/* Handle and Alias Section */}
				{/*<div className="space-y-3 mb-6">*/}
				{/*	<div className="flex items-center text-sm text-gray-600">*/}
				{/*		<div className="flex items-center min-w-32">*/}
				{/*			<Hash className="w-4 h-4 mr-2 text-gray-400"/>*/}
				{/*			<span className="font-medium text-gray-700">Handle:</span>*/}
				{/*		</div>*/}
				{/*		<div className="flex items-center flex-grow">*/}
				{/*			<code className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-0.5 rounded">*/}
				{/*				{handlePath}*/}
				{/*			</code>*/}
				{/*			<button*/}
				{/*				onClick={handleCopy}*/}
				{/*				className="ml-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"*/}
				{/*				title="Copy handle"*/}
				{/*			>*/}
				{/*				{copied ? (*/}
				{/*					<Check className="w-4 h-4 text-green-500"/>*/}
				{/*				) : (*/}
				{/*					<Copy className="w-4 h-4 text-gray-400 hover:text-gray-600"/>*/}
				{/*				)}*/}
				{/*			</button>*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*	*/}
				{/*	<div className="flex items-center text-sm text-gray-600">*/}
				{/*		<div className="flex items-center min-w-32">*/}
				{/*			<Tag className="w-4 h-4 mr-2 text-gray-400"/>*/}
				{/*			<span className="font-medium text-gray-700">Alias:</span>*/}
				{/*		</div>*/}
				{/*		<span className="text-gray-600">{item.alias}</span>*/}
				{/*	</div>*/}
				{/*</div>*/}
				
				{/* Stats Section */}
				<div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 pt-4 border-t border-base-300">
					<div className="flex items-center whitespace-nowrap bg-gray-50 px-2.5 py-1.5 rounded-full">
					<Box className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>
						<span className="font-medium text-gray-600">
                            {size ? formatBytes(size) : 'size missing'}
                        </span>
					</div>
					
					<div className="flex items-center whitespace-nowrap bg-gray-50 px-2.5 py-1.5 rounded-full">
						<Folder className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>
						<span className="font-medium text-gray-600">
                            {
								numFiles
	                            ? `${formatNumber(numFiles)} file${numFiles !== 1 ? 's' : ''}`
	                            : 'count missing'
							}
                        </span>
					</div>
					
					<div className="flex items-center whitespace-nowrap bg-gray-50 px-2.5 py-1.5 rounded-full">
						<UserCircle2 className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>
						<span className="font-medium text-gray-600">
                            {item.modified_by}
                        </span>
					</div>
					
					<div className="flex items-center whitespace-nowrap bg-gray-50 px-2.5 py-1.5 rounded-full">
						<Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>
						<span className="font-medium text-gray-600">
                            {stringToDate(item.created_at).toLocaleDateString()}
                        </span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AssetCard;
