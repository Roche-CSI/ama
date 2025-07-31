/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {ThemeSelector} from "../../themes/ThemeSelector";
import Logo from "../../assets/logo_amber.svg";
import {DataSetsIcon, DeploymentsIcon, ModelIcon, ProjectsIcon} from "../icons";
import {BookOpen, Github, Search} from "lucide-react";
import {useProject} from "../../contexts/projectContext/useProject";
import {ProjectInterface} from "../../api/data_types";

interface NavItem {
	name: string;
	route: string;
	icon?: React.ReactNode;
	label?: string;
	isExternal?: boolean;
}

const LEFT_MENU: Record<string, NavItem> = {
	models: {name: "models", label: "Models", route: "./models", icon: <ModelIcon/>},
	datasets: {
		name: "datasets",
		label: "Datasets",
		route: "./datasets",
		icon: <DataSetsIcon className="size-4 p-0.5"/>
	},
	deployments: {name: "deployments", label: "Deployments", route: "./deployments", icon: <DeploymentsIcon/>},
}

const RIGHT_MENU: Record<string, NavItem> = {
	search: {name: "search", route: "./search", icon: <Search className="size-4 text-neutral-400"/>, label: "Search"},
	github: {
		name: "github",
		route: "https://github.com/ORG/asset_client",
		label: "Github",
		icon: <Github className="size-4 text-neutral-400"/>
	},
	documentation: {
		name: "documentation",
		route: "https://laughing-adventure-j886gwp.pages.github.io/home/",
		label: "Docs",
		icon: <BookOpen className="size-4 text-neutral-400"/>
	},
}

// combine all menu items
const NAV_ITEMS: Record<string, any> = {...LEFT_MENU, ...RIGHT_MENU};

const classNameSelected: string = `font-extrabold`;

const SearchBar2 = () => {
	return (
		<div className="form-control flex-1 h-10">
			<label className="input input-bordered flex items-center gap-2 max-w-96">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
				     className="h-4 w-4 opacity-70">
					<path fillRule="evenodd"
					      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					      clipRule="evenodd"/>
				</svg>
				<input type="text" className="grow"
				       placeholder="Models, Datasets, Deployments, Docs..."/></label>
		</div>
	)
}

export const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const activeMenuName = location.pathname ? location.pathname.split('/')[2] : "";
	const activeMenu = NAV_ITEMS[activeMenuName];
	
	const {activeProjectId, projects, setActiveProjectId} = useProject();
	const activeProject = activeProjectId ? projects.filter((project) => project.id == activeProjectId)[0] : {};
	
	// useEffect(() => {
	// 	if (urlMenu != activeMenu?.name) {
	// 		setActiveMenu(NAV_ITEMS.filter((item) => item.name.toLowerCase() === urlMenu.toLowerCase())[0]);
	// 	}
	// }, [urlMenu, activeMenu]);
	
	const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
		e.preventDefault();
		navigateToMenu(item);
	}
	
	const onProjectSelect = (id: string) => {
		console.log("Selected project: ", name);
		const selected = projects.filter((project) => project.id == id)[0];
		if (selected.id == activeProjectId) {
			return;
		}
		setActiveProjectId(id);
		navigateToMenu(activeMenu);
	}
	
	const navigateToMenu = (item: NavItem | null) => {
		if (!item || !activeProjectId) return;
		navigate(`${activeProjectId}/${item.route}`);
	}
	console.log("activeMenu: ", activeMenu);
	if (!projects) {
		return null;
	}
	console.log("projects: ", projects);
	
	const NavLink: React.FC<{ item: NavItem, active?: NavItem }> = ({item, active}) => {
		const isExternal = item.route.startsWith('http');
		const isSelected = item.name === active?.name;
		const css = `flex items-center ${isSelected ? "bg-base-200 font-extrabold" : "font-medium"}`;
		
		// Add subtle styling for external links
		const externalClasses = isExternal ? "after:content-['↗'] after:ml-1 after:text-neutral-400 hover:after:text-primary" : "";
		
		if (isExternal) {
			return (
				<a
					key={item.name}
					href={item.route}
					target="_blank"
					rel="noopener noreferrer"
					className={`${css} ${externalClasses} hover:text-primary transition-colors`}
				>
					<span className="mr-2">{item.icon}</span>
					<span>
                        {item.label}
                    </span>
				</a>
			);
		}
		
		return (
			<Link className={css}
			      key={item.name}
			      to={`${activeProjectId}/${item.route}`}>
				<span className="mr-2">{item.icon}</span>
				<span>
                    {item.label}
                </span>
			</Link>
		);
	};
	
	return (
		
		// Nav Bar
		<div className="navbar">
			{/*LEFT HALF*/}
			<div className="flex-1">
				{/*LOGO AND TITLE*/}
				<a className="w-10" href={"/"}>
					<img
						// src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hoffmann-La_Roche_logo.svg/1280px-Hoffmann-La_Roche_logo.svg.png"
						src={Logo}
						className="h-auto max-w-full max-h-full object-contain w-10"
						alt={"Company logo"}/>
				</a>
				{/*LOGO AND TITLE END*/}
				{/*NAV MENU LARGE SCREEN*/}
				<div className="w-full flex justify-between mx-8">
					<ul className="menu menu-horizontal px-1 hidden md:flex lg:flex space-x-12">
						{
							Object.values(LEFT_MENU).map((item) => {
								return (
									<li key={item.name}>
										<NavLink item={item} active={activeMenu!}/>
									</li>
								);
							})
						}
					</ul>
					<ul className="menu menu-horizontal px-1 hidden md:flex lg:flex space-x-8">
						{
							Object.values(RIGHT_MENU).map((item) => {
								return (
									<li key={item.name}>
										<NavLink item={item} active={activeMenu!}/>
									</li>
								);
							})
						}
					</ul>
				</div>
				{/*NAV MENU LARGE SCREEN END*/}
				{/*NAV MENU SMALL SCREEN*/}
				<div className="dropdown">
					<div role="button" className="btn btn-ghost lg:hidden">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
						     stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
							      d="M4 6h16M4 12h8m-8 6h16"/>
						</svg>
					</div>
					<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
						{
							Object.values(LEFT_MENU).map((item: NavItem) => (
								<li key={item.name}><a>{item.name}</a></li>
							))
						}
						<li>
							<details>
								<summary>Projects</summary>
								<ul className="p-2">
									<li><a>Projects 1</a></li>
									<li><a>Projects 2</a></li>
								</ul>
							</details>
						</li>
					</ul>
				</div>
				{/*NAV MENU SMALL SCREEN END*/}
				{/*SEARCH BAR*/}
				{/*<SearchBar/>*/}
				{/*SEARCH BAR END*/}
			</div>
			{/*LEFT HALF END*/}
			{/*RIGHT HALF*/}
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1 hidden lg:flex relative z-20 mr-2">
					<li>
						<ProjectDropDown title={activeProject?.title || "Projects"}
						                 options={projects}
						                 onSelect={onProjectSelect}/>
					</li>
				</ul>
				{/*<ul className="menu menu-horizontal px-1 hidden lg:flex ">*/}
				{/*	{NAV_ITEMS.map((item) => {*/}
				{/*		const isSelected = item.name === activeMenu?.name;*/}
				{/*		return (*/}
				{/*			<li key={item.name}>*/}
				{/*				<a*/}
				{/*					className={isSelected ? classNameSelected : ""}*/}
				{/*					onClick={(e) => handleMenuClick(e, item)}>*/}
				{/*					{MenuIcon(item.name)}*/}
				{/*					{item.name}*/}
				{/*				</a>*/}
				{/*			</li>*/}
				{/*		);*/}
				{/*	})}*/}
				{/*	/!*<li>*!/*/}
				{/*	/!*	<DropDown title={"Projects"} options={PROJECTS.map((project) => project.name)}*!/*/}
				{/*	/!*	          onSelect={onProjectSelect}/>*!/*/}
				{/*	/!*</li>*!/*/}
				{/*</ul>*/}
				
				{/*PROFILE DROPDOWN*/}
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
						<div className="w-10 rounded-full">
							<img alt="Tailwind CSS Navbar component"
							     src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
						</div>
					</div>
					<ul tabIndex={0}
					    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
						<li>
							<a className="justify-between">
								Profile
								<span className="badge">New</span>
							</a>
						</li>
						<li><a><ThemeSelector/></a></li>
						<li><a>Settings</a></li>
						<li><a>Logout</a></li>
					</ul>
				</div>
				{/*PROFILE DROPDOWN END*/}
			</div>
		</div>
	);
}

interface DropDownProps {
	title: string;
	options: ProjectInterface[];
	onSelect: (item: string) => void;
}

const ProjectDropDown = (props: DropDownProps) => {
	const detailsRef = useRef<HTMLDetailsElement>(null);
	// const [active, setActive] = useState<ProjectInterface | null>(null);
	
	// Add this check to help debug duplicate IDs
	useEffect(() => {
		const idCount = new Map<string, number>();
		props.options.forEach(item => {
			idCount.set(item.id, (idCount.get(item.id) || 0) + 1);
		});
		
		idCount.forEach((count, id) => {
			if (count > 1) {
				console.warn(`Duplicate project ID found: ${id} appears ${count} times`);
			}
		});
	}, [props.options]);
	
	const handleSelect = (_e: React.MouseEvent<HTMLAnchorElement>, value: ProjectInterface) => {
		// e.preventDefault()
		// setActive(value);
		props.onSelect && props.onSelect(value.id);
		window.removeEventListener('mousedown', handleClickOutside);
		if (detailsRef.current) {
			detailsRef.current.removeAttribute('open');
		}
	}
	
	// Function to handle clicks outside the dropdown
	const handleClickOutside = (e: MouseEvent) => {
		console.log("listening to clicks outside dropdown, if it persists, its a bug - remove listener properly");
		window.removeEventListener('mousedown', handleClickOutside);
		if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
			detailsRef.current.removeAttribute('open');
		}
	};
	
	const addClickOutsideListener = () => {
		window.addEventListener('mousedown', handleClickOutside);
	}
	
	return (
		<details ref={detailsRef} onClick={() => addClickOutsideListener()}>
			<summary className='btn btn-sm py-3text-sm btn-ghost font-light'>
				<ProjectsIcon className={`size-5 ${classNameSelected}`}/>
				<span className="font-extrabold">
					{props.title}
				</span>
			</summary>
			<ul className="p-2">
				{props.options.map((item: ProjectInterface) => (
					<li key={item.id}>
						<a onClick={(e) => handleSelect(e, item)}>{item.title}</a>
					</li>
				))}
			</ul>
		</details>
	);
};


