import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
	AlertTriangle,
	Info,
	Container,
	Images,
	Layers,
	Lock,
	Menu,
	Plus,
	Search,
	Trash2,
	Waypoints,
	X,
	Package
} from 'lucide-react';
import {Logo} from "../../components/logo";
import {useNavigate} from "react-router-dom";
import Access from "./Access";
import {useProject} from "../../contexts/projectContext/useProject";
import {useUser} from "../../contexts/userContext/useUser";
import {ProjectInterface} from "../../api/data_types";

const CLASS_TYPES = [
	{name: 'all', icon: <Menu className="size-4 mr-2 text-indigo-400"/>, label: "All"},
	{name: 'models', icon: <Waypoints className="size-4 mr-2 text-red-400"/>, label: "Models"},
	{name: 'data', icon: <Layers className="size-3.5 mr-2 text-yellow-400"/>, label: "Datasets"},
	// {name: 'containers', icon: <Container className="size-4 mr-2 text-teal-400"/>, label: "Containers"},
	// {name: 'images', icon: <Images className="size-4 mr-2 text-indigo-400"/>, label: "Images"},
];

interface ProjectData {
	id: string;
	value: string;
	label: string;
	access: boolean;
	deprecated: boolean;
	obsolete: boolean;
}

const SearchPage = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTabs, setSelectedTabs] = useState(['all']);
	const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	
	const navigate = useNavigate();
	const {userData} = useUser()
	const {projects, activeProjectId} = useProject();
	
	// transform projects to to label, value, access, deprecated, obsolete etc
	const projectsData = useMemo(() => {
		const result: Record<string, ProjectData> = {};
		projects.forEach((project: ProjectInterface) => {
			const access = new Access(project)
			// simulate restricted projects
			// todo: remove this
			const restrictedList  = ["r1", "r2"]
			const pr =  {
				id: project.id,
				value: project.id,
				label: project.title,
				access: !restrictedList.includes(project.name),
				deprecated: false,
				obsolete: false
			}
			result[project.id] = pr;
		});
		console.log("projectsData", result);
		return result;
	}, [projects]);
	
	const [selectedProjects, setSelectedProjects] = useState([activeProjectId]);
	
	const handleSearch = (e) => {
		e.preventDefault();
		navigate(`/${activeProjectId}/search-results?q=${encodeURIComponent(searchQuery)}&projects=${selectedProjects.join(',')}&tab=${selectedTabs.join(',')}`);
	};
	
	const toggleProject = (projectId) => {
		if (projectId === 'all') {
			setSelectedProjects(Object.keys(projects));
		} else {
			setSelectedProjects(prev => {
				const newSelection = prev.includes(projectId)
					? prev.filter(p => p !== projectId)
					: [...prev.filter(p => p !== 'all'), projectId];
				return newSelection.length ? newSelection : [activeProjectId];
			});
		}
		setIsProjectDropdownOpen(false);
	};
	
	const removeProject = (projectId) => {
		setSelectedProjects(prev => {
			const newSelection = prev.filter(p => p !== projectId);
			return newSelection.length ? newSelection : [activeProjectId];
		});
	};
	
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsProjectDropdownOpen(false);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	
	const ProjectLabel = ({ project, canCancel }) => {
		
		const [showTooltip, setShowTooltip] = useState(false);
		
		if (!project) return null;
		
		const getStatusIcons = () => {
			const icons = [];
			if (!project.access) icons.push(<Lock key="lock" className="w-3 h-3 text-red-500" />);
			if (project.deprecated) icons.push(<AlertTriangle key="deprecated" className="w-3 h-3 text-yellow-500" />);
			if (project.obsolete) icons.push(<Trash2 key="obsolete" className="w-3 h-3 text-orange-500" />);
			if (project.value === 'all') icons.push(<Info key="all" className="w-3 h-3 text-blue-500" />);
			return icons.length ? (
				<div className="flex space-x-1 mr-2">
					{icons}
				</div>
			) : null;
		};
		
		const getLabelClass = () => {
			if (!project.access) return "text-red-700 border-red-300 bg-red-50";
			if (project.deprecated) return "text-yellow-700 border-yellow-300 bg-yellow-50";
			if (project.obsolete) return "text-orange-700 border-orange-300 bg-orange-50";
			if (project.value === 'all') return "text-blue-700 border-blue-300 bg-blue-50";
			return "text-gray-700 border-base-300";
		};
		
		const getTooltipMessage = () => {
			if (project.value === 'all') {
				return "Searching only in projects with access. Some projects may be excluded.";
			}
			const messages = [];
			if (!project.access) messages.push("Access restricted");
			if (project.deprecated) messages.push("Deprecated");
			if (project.obsolete) messages.push("Obsolete");
			return messages.join(', ') + ". Please contact admin for assistance.";
		};
		
		const getTooltipClass = () => {
			if (!project.access) return "bg-red-50 text-red-700 border border-red-300";
			if (project.deprecated) return "bg-yellow-50 text-yellow-700 border border-yellow-300";
			if (project.obsolete) return "bg-orange-50 text-orange-700 border border-orange-300";
			if (project.value === 'all') return "bg-blue-50 text-blue-700 border border-blue-300";
			return "bg-base-200 text-neutral border border-base-300";
		};
		// console.log("project", project);
		
		return (
			<div className="relative inline-block">
				<div
					key={project.value}
					className={`border px-3 py-1 rounded-full text-sm flex items-center hover:shadow-md transition-shadow duration-200 ${getLabelClass()}`}
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => setShowTooltip(false)}
				>
					{getStatusIcons()}
					{project.label}
					{canCancel && (
						<button
							onClick={() => removeProject(project.value)}
							className="ml-4 -mr-2 p-1 rounded-full bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
							aria-label={`Remove ${project.label}`}
						>
							<X className="w-3 h-3 text-gray-500 hover:text-white" />
						</button>
					)}
				</div>
				{showTooltip && !project.access && (
					<div className={`absolute z-10 w-64 px-3 py-2 text-sm font-medium rounded-lg shadow-sm opacity-100 tooltip transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${getTooltipClass()}`}>
						{getTooltipMessage()}
						<div className={`tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${project.value === 'all' ? 'border-t-blue-300' : 'border-t-gray-900'}`}></div>
					</div>
				)}
			</div>
		);
	};
	
	const ProjectSelection = () => {
		// filter out nulls
		const projects = selectedProjects.map((projectId) => projectsData[projectId]).filter(project => project != null);
		return (
			<React.Fragment>
				{projects.map((project) => (
					<ProjectLabel
						key={project.id}
						project={project}
						canCancel={selectedProjects.length > 1}
					/>
				))}
				<button
					onClick={() => setIsProjectDropdownOpen(prev => !prev)}
					className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow-md transition-all duration-200 ml-2"
					aria-label="Add project"
				>
					<Plus className="w-4 h-4"/>
				</button>
			</React.Fragment>
		);
	};
	
	const ProjectDropDown = ({ isProjectDropdownOpen, dropdownRef, selectedProjects, toggleProject }) => {
		const getProjectIcon = (project) => {
			if (!project.access) return <Lock className="w-4 h-4 text-red-500 mr-2" />;
			if (project.deprecated) return <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />;
			if (project.obsolete) return <Trash2 className="w-4 h-4 text-orange-500 mr-2" />;
			if (project.value === 'all') return <Info className="w-4 h-4 text-blue-500 mr-2" />;
			return <Package className="w-4 h-4 text-gray-500 mr-2" />;
		};
		
		const getProjectClass = (project) => {
			if (!project.access) return "text-red-700 hover:bg-red-50";
			if (project.deprecated) return "text-yellow-700 hover:bg-yellow-50";
			if (project.obsolete) return "text-orange-700 hover:bg-orange-50";
			if (project.value === 'all') return "text-blue-700 hover:bg-blue-50";
			return "text-gray-700 hover:bg-gray-50";
		};
		
		return (
			isProjectDropdownOpen && (
				<div
					ref={dropdownRef}
					className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
				>
					<div className="py-1">
						{Object.values(projectsData).filter(project => !selectedProjects.includes(project.value)).map((project) => (
							<button
								key={project.value}
								onClick={() => toggleProject(project.value)}
								className={`block w-full text-left px-4 py-2 text-sm ${getProjectClass(project)} flex items-center`}
							>
								{getProjectIcon(project)}
								<span>{project.label}</span>
							</button>
						))}
					</div>
				</div>
			)
		);
	};
	
	const ClassTypeSelection = ({ tabs, activeTabs }) => {
		
		const handleMultipleTabs = (tabs) => {
			// If no tabs are selected, default to 'all'
			if (tabs.length === 0) {
				return ['all'];
			}
			
			// If any other tabs are selected, remove 'all'
			if (tabs.length >= 1 && tabs.includes('all')) {
				return tabs.filter(tab => tab !== 'all');
			}
			
			// Return the filtered tabs
			return tabs;
		};
		
		const handleTabClick = (tabName) => {
			// if 'all' tab is selected, deselect all other tabs
			if (tabName === 'all') {
				setSelectedTabs([tabName]);
				return;
			}
			// toggle activeTabs
			const newTabs = activeTabs.includes(tabName) ? activeTabs.filter((tab) => tab !== tabName) : [...activeTabs, tabName];
			setSelectedTabs(handleMultipleTabs(newTabs));
		}
		
		return (
			<React.Fragment>
				{tabs.map((tab) => (
					<button
						key={tab.name}
						type="button"
						onClick={() => handleTabClick(tab.name)}
						className={`btn rounded-full btn-ghost border border-base-300 shadow-sm font-normal ${
							activeTabs.includes(tab.name) ? 'bg-base-200 border-secondary text-primary font-semibold' : ''
						}`}
					>
						{tab.icon}
						{tab.label}
					</button>
				))}
			</React.Fragment>
		)
	}
	
	return (
		<div className="flex flex-col items-center justify-start pt-20 min-h-screen bg-white">
			<div className="text-center w-full max-w-4xl">
				<h1 className="text-4xl md:text-4xl font-bold text-[#0064FF] w-full flex justify-center items-center py-4">
					<Logo className="w-16 h-16"/>
				</h1>
				<div className="flex flex-wrap justify-center mt-6 gap-2 relative">
					<ProjectSelection/>
					<ProjectDropDown
						isProjectDropdownOpen={isProjectDropdownOpen}
						dropdownRef={dropdownRef}
						selectedProjects={selectedProjects}
						toggleProject={toggleProject}
					/>
				</div>
				<form onSubmit={handleSearch} className="mt-8 px-16">
					<div
						className="flex items-center w-full h-12 rounded-full border border-gray-200 shadow-sm hover:shadow-md focus-within:shadow-md px-4">
						<Search className="text-gray-500 mr-3" size={20}/>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-grow outline-none text-md"
							placeholder="Search using name, title, description, meta keywords, tags etc."
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery('')}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
								aria-label="Clear search"
							>
								<X className="size-4 text-gray-500"/>
							</button>
						)}
					</div>
				</form>
				<div className="mt-8 flex justify-center space-x-4 flex-wrap">
					<ClassTypeSelection tabs={CLASS_TYPES} activeTabs={selectedTabs}/>
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
