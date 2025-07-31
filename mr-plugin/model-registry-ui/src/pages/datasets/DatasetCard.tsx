/* eslint-disable no-mixed-spaces-and-tabs */
import {Link} from "react-router-dom";
import {getDaysAgo} from "../../utils";
import {CodeBlockIcon, CopyIcon, DownloadIcon, LikeIcon, TimeIcon} from "../../components/icons";
import React, {useState} from "react";
import {DataCardProps} from "../../components/datagrid";
import {DatasetInterface} from "../../api/data_types";

export interface DatasetCardProps extends DataCardProps<DatasetInterface>{}

export const DatasetCard: React.FC<DatasetCardProps> = ({item, routeGenerator}: DatasetCardProps) => {
	const codeSample: string = "fox clone epigenomics-data";
	
	return (
		<div className="bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
			<div className="card-body p-3 flex">
				<h3 className="font-medium text-base-content hover:text-primary hover:underline cursor-pointer transition-all duration-300">
					<Link to={routeGenerator("dataset", item.id)} className="hover:no-underline">
						{item.name}
					</Link>
				</h3>
				<div className="font-light flex items-center space-x-2"><TagsList tags={item.tags!}/></div>
				<div className="font-light flex items-center space-x-2 gap-2">
					<span className="text-xs font-medium text-neutral-400 flex items-center space-x-1">
						<TimeIcon className="h-4 w-4"/>
						<span>Updated {getDaysAgo(item.modified_at!)} ago</span>
					</span>
					<button
						className="text-xs font-medium text-neutral-400 flex items-center space-x-1 hover:text-blue-500">
						<LikeIcon className="h-4 w-4"/>
						<span>{item.likes}</span>
					</button>
					<span className="text-xs font-medium text-neutral-400 flex items-center space-x-1">
						<DownloadIcon className="h-4 w-4"/>
						<span>{item.downloads}</span>
					</span>
					{/* Use InfoTooltip component */}
					<span className="flex items-center">
						<InfoTooltip
							codeSample={codeSample}
							infoIconClassName="text-neutral-400 hover:text-secondary"
						/>
					</span>
				</div>
			</div>
		</div>
	)
}

const TagsList = ({tags}: { tags: string[] }) => {
	const [isHovered, setIsHovered] = useState(false);
	
	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);
	
	return (
		<div className="relative flex flex-wrap gap-2">
			{tags?.slice(0, 2).map((task, key) => (
				<span
					key={key}
					className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-base-200 text-primary">
					{task}
				</span>
			))}
			
			{tags?.length > 2 && (
				<span
					className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-neutral ring-1 ring-inset ring-base-200 cursor-pointer"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					...
				</span>
			)}
			
			{/* Tooltip for remaining tags */}
			{tags?.length > 2 && isHovered && (
				<div
					className="absolute bottom-full left-0 mb-2 p-2 bg-base-100 border border-base-300 shadow-lg rounded-md z-10 w-max">
					{tags?.slice(2).map((task, key) => (
						<span
							key={key}
							className="block mb-1 text-xs font-medium text-neutral px-2 py-1 rounded-md">
							{task}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

interface InfoTooltipProps {
	codeSample: string;
	infoIconClassName?: string;
	tooltipClassName?: string;
}


const InfoTooltip: React.FC<InfoTooltipProps> = ({codeSample, infoIconClassName = "", tooltipClassName = ""}) => {
	const [isHovered, setIsHovered] = useState(false);
	
	return (
		<div className="relative flex items-center"
		     onMouseEnter={() => setIsHovered(true)}
		     onMouseLeave={() => setIsHovered(false)}>
			<span className={`cursor-pointer ${infoIconClassName}`}>
				<CodeBlockIcon className={"h-4 w-4 text-neutral-400 hover:text-blue-500"}/>
			</span>
			{isHovered && (
				<div
					className={`absolute top-full left-1/2 transform -translate-x-3/4 -translate-y-1 p-1  z-10 ${tooltipClassName}`}
					style={{width: 'auto'}}>
					<CodeBlock codeString={codeSample}/>
					<button
						className="absolute top-4 right-4 text-neutral-content text-xs px-2 py-1 rounded-md focus:outline-none"
						onClick={() => {
							navigator.clipboard.writeText(codeSample);
							alert('Code copied to clipboard');
						}}>
						<CopyIcon className="h-4 w-4 text-base-100 hover:text-secondary transform hover:scale-110"/>
					</button>
				</div>
			)}
		</div>
	);
};

const CodeBlock = ({codeString}: { codeString: string }) => {
	return (
		<div className="card bg-base-content w-96 shadow-xl border border-base-300 text-base-100">
			<div className="card-body">
				<pre data-prefix="$"><code>{codeString}</code></pre>
			</div>
		</div>
	);
};
