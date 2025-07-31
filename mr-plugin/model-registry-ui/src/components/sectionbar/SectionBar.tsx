/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import {Link} from "react-router-dom";


const base: string = "btn btn-xs text-xs font-semibold rounded-md";
const className: string = `${base}`;
const classNameSelected: string = `${base} hover:bg-black hover:text-white text-neutral-content bg-neutral`;

interface MenuItem {
	name: string;
	label: string;
	link: string;
	icon: React.ReactNode;
	floatRight?: boolean;
	openInNewTab?: boolean;
}

export const SectionBar: React.FC<{ items: MenuItem[], activeItem: string }> = ({items, activeItem}) => {
	return (
		<div className="flex items-center gap-2">
			{
				items.map((item, index) => {
					return <SectionLabel key={index}
					                     icon={item.icon}
					                     label={item.label}
					                     selected={activeItem === item.name}
					                     floatRight={item.floatRight}
					                     openInNewTab={item.openInNewTab}
					                     link={item.link}/>
				})
			}
		</div>
	);
}


interface SectionLabelProps {
	label: string;
	link: string;
	selected: boolean;
	icon: React.ReactNode,
	floatRight?: boolean;
	openInNewTab?: boolean;
}

const SectionLabel: React.FC<SectionLabelProps> = ({selected, label, link, icon, openInNewTab, floatRight}: SectionLabelProps) => {
	const Icon = icon
	let applyCSS: string = selected ? classNameSelected : className
	applyCSS = floatRight ? `${applyCSS} ml-auto` : applyCSS
	// console.log("applyCSS", floatRight, applyCSS);
	return (
		<Link to={link}
		      className={applyCSS}
		      target={openInNewTab ? "_blank" : ""}
		      rel={openInNewTab ? "noopener noreferrer" : ""}>
			<Icon className={`size-3`}/>
			{label ? label : null}
		</Link>
	)
}
