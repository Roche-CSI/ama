/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {Link} from "react-router-dom";
import {getDaysAgo} from "../../utils";
import {TimeIcon} from "../../components/icons";
import {ModelInterface} from "../../api/data_types";
import {DataCardProps} from "../../components/datagrid";

export interface ModelCardProps extends DataCardProps<ModelInterface> {
}

export const ModelCard: React.FC<ModelCardProps> = ({item, routeGenerator}: ModelCardProps) => {
	return (
		<div
			className="bg-base-100 border border-[#64748b40] rounded-lg hover:bg-[#0064FF10] hover:cursor-pointer transition-shadow duration-300">
			<div className="card-body p-3 flex">
				<h3 className="font-medium text-base-content hover:text-primary hover:underline cursor-pointer transition-all duration-300">
					<Link
						to={routeGenerator("models", item.id)}
						className="hover:text-blue-600 hover:underline" 
					>
						{item.name}
					</Link>
				</h3>
				<div className="space-y-3">
					<div className="flex flex-wrap gap-2">
						{item.tasks.map((task, key) => (
							<span
								key={key}
								className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-base-200 text-primary"
							>
								{task}
							</span>
						))}
					</div>
					<div className="flex items-center space-x-4 text-xs text-neutral-400">
						<span className="flex items-center">
							{item.author}
						</span>
						<span className="flex items-center">
							<TimeIcon className="h-4 w-4 mr-1"/>
							{getDaysAgo(item.modified_at)} days ago
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
