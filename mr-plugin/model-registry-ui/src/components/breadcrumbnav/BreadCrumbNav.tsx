/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {ChevronRightIcon} from "../icons";
import {Link} from "react-router-dom";


export interface BreadCrumbSection {
	label: string;
	link?: string;
}

interface BreadCrumbNavProps {
	Icon: React.ReactNode;
	sections: BreadCrumbSection[];
	extra?: React.ReactNode;
	badge?: string;
	onCopyClick?: () => void;
}

export const BreadCrumbNav: React.FC<BreadCrumbNavProps> = ({
	                                                            Icon,
	                                                            sections,
	                                                            badge,
	                                                            extra,
	                                                            onCopyClick
                                                            }) => {
	return (
		<p className="text-md flex items-center flex-grow">
			<span className="flex items-center justify-center pr-2">
				<Icon className="size-4 text-base-content"/>
			</span>
			{sections.map((section, index) => (
				<React.Fragment key={section.label}>
					{index > 0 && <Chevron/>}
					<Link
						to={section.link || "#"}
						className={
							`hover:text-primary hover:underline ${index === sections.length - 1 ? 'text-base-content' : 'text-base-content'}
						${index < sections.length - 1 ? 'mr-2' : ''}`}>
						{section.label}
					</Link>
				</React.Fragment>
			))}
			{
				extra &&
                <div className="ml-2 flex">
					<Chevron/>
					{extra}
                </div>
			}
			{
				badge &&
				(
					<div className="flex">
						{badge}
					</div>
				)
			}
			<button className=" btn btn-xs btn-ghost rounded-md"
			        onClick={onCopyClick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2.0}
					stroke="currentColor"
					className="size-4">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
					/>
				</svg>
			</button>
		</p>
	);
};

const Chevron: React.FC = () => {
	return (
		<span className="flex items-center justify-center text-neutral-400 mr-2">
			<ChevronRightIcon className="size-3.5"/>
		</span>
	)
}
