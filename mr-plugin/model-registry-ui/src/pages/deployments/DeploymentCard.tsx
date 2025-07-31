import React from "react";
import { Link } from "react-router-dom";
import { getDaysAgo } from "../../utils";
import { CpuIcon, GpuIcon, MemoryIcon, TimeIcon } from "../../components/icons";
import { DataCardProps } from "../../components/datagrid";
import { DeploymentInterface } from "../../api/data_types";

export interface DeploymentCardProps extends DataCardProps<DeploymentInterface> {}

export const DeploymentCard: React.FC<DeploymentCardProps> = ({ item, routeGenerator }: DeploymentCardProps) => {
	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
			<div className="p-5">
				<div className="flex justify-between items-start mb-3">
					<h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
						<Link to={routeGenerator("deployment", item.id)} className="hover:underline">
							{item.name}
						</Link>
					</h3>
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
				</div>
				<p className="text-gray-600 text-sm mb-4">{item.description}</p>
				<div className="flex items-center text-xs text-gray-500 mb-4">
					<TimeIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
					<span>Started <span className="font-medium">{getDaysAgo(item.created_at)}</span> ago</span>
				</div>
				<div className="grid grid-cols-3 gap-4 text-center">
					{[
						{ icon: CpuIcon, label: "CPU", value: item.machine_config.cpu, color: "blue" },
						{ icon: MemoryIcon, label: "Memory", value: item.machine_config.memory, color: "teal" },
						{ icon: GpuIcon, label: "GPU", value: item.machine_config.gpu, color: "purple" },
					].map((spec) => (
						<div key={spec.label} className={`bg-${spec.color}-50 rounded-lg p-3`}>
							<spec.icon className={`h-5 w-5 text-${spec.color}-500 mx-auto mb-1`} />
							<p className={`text-lg font-semibold text-${spec.color}-600`}>{spec.value}</p>
							<p className="text-xs text-gray-500 mt-1">{spec.label}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
