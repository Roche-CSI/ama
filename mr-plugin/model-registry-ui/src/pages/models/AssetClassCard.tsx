/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {CheckCircle, Lock, Trash, AlertTriangle, XCircle, Star, Layers} from 'lucide-react';
import {CLASS_ICONS, CLASS_TYPE} from "./ClassIcons";
import {StatusEnums, Status} from "../../api/Status";
import {getDaysAgo} from "../../utils/date_utils";
import {AssetClassInterface} from "../../api/AssetClassApi.ts";

export interface AssetClassCardProps {
	item: AssetClassInterface;
	routeGenerator: (item: any) => string;
	isFavorite?: boolean;
	onFavoriteClicked?: (item: any) => void;
}

const container = "bg-white p-4 border border-base-300 rounded-lg hover:shadow-md transition duration-150 ease-in-out cursor-pointer flex flex-col group";

const getStatusConfig = (status) => {
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
		default:
			return {icon: CheckCircle, color: 'text-gray-500', bgColor: 'bg-gray-100', label: 'Unknown'};
	}
};

const BADGE_COLORS = {
	[StatusEnums.PRIVATE]: "bg-blue-100 text-blue-600",
	[StatusEnums.OBSOLETE]: "bg-red-100 text-red-600",
	[StatusEnums.DEPRECATED]: "bg-yellow-100 text-orange-600",
	[StatusEnums.ARCHIVED]: "bg-orange-100 text-orange-600",
	[StatusEnums.ARCHIVE_FLAGGED]: "bg-orange-400 text-white",
	[StatusEnums.PUBLIC]: "bg-green-200 text-green-950",
}


export const AssetClassCard: React.FC<AssetClassCardProps> = ({
	                                                              item,
	                                                              routeGenerator,
	                                                              isFavorite = false,
	                                                              onFavoriteClicked
                                                              }) => {
	const badge = item.status > 1 ? new Status(item.status as number).description().toLowerCase() : null;
	
	const Icon = CLASS_ICONS[item.class_type] || CLASS_ICONS["default"];
	const navigate = useNavigate();
	const onClick = () => navigate(routeGenerator(item));
	
	const badgeColor = BADGE_COLORS[item.status];
	
	const status = item.status || StatusEnums.PUBLIC;
	const showStatusBadge = status !== StatusEnums.PUBLIC;
	const {icon: StatusIcon, color: statusColor, bgColor: statusBgColor, label: statusLabel} = getStatusConfig(status);
	
	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onFavoriteClicked?.(item);
	};
	
	return (
		<div className={container}>
			<div className="flex items-start justify-between mb-2">
				<Link to={routeGenerator(item)} className="flex-grow min-w-0" onClick={onClick}>
					<div className="flex items-center">
						{/*<Icon className="flex-shrink-0 size-3.5 mr-4"/>*/}
						<h3 className="text-md font-semibold text-neutral-600 hover:text-primary hover:underline transition-colors duration-150 truncate">
							{item.title}
						</h3>
					</div>
				</Link>
				<div className="flex items-center gap-2">
					<button
						onClick={handleFavoriteClick}
						className={`p-1 rounded-md hover:bg-neutral-100 transition-colors duration-150 opacity-0 group-hover:opacity-100 ${isFavorite ? 'opacity-100' : ''}`}
						title={isFavorite ? "Remove from favorites" : "Add to favorites"}
					>
						<Star
							className={`size-4 ${isFavorite ? 'text-orange-400 fill-orange-400' : 'text-neutral-400'}`}
						/>
					</button>
					{badge && (
						<span
							className={`px-2 py-0.5 text-[10px] flex-shrink-0 ${badgeColor} rounded-sm whitespace-nowrap`}>
                            {badge}
                        </span>
					)}
				</div>
			</div>
			<p className="text-neutral-600 text-xs mb-2 flex-grow truncate overflow-hidden whitespace-nowrap">
				{item.description}
			</p>
			<div className="text-xs text-neutral-400 flex gap-2 items-center mt-auto">
				<Layers className="size-3"/>
				<p className="mr-4">models: {item.counter}</p>
				{item.modified_at && (
					<p className="mr-4">last modified: {getDaysAgo(item.modified_at)} days ago</p>
				)}
			</div>
		</div>
	);
}
