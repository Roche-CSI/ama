import React, {useState, ReactNode, useEffect, createContext} from 'react';
import {ProjectInterface} from "../../api/data_types";
import {useLocation, useNavigate} from "react-router-dom";

export interface ProjectContextType {
	activeProjectId: string;
	projects: ProjectInterface[];
	setActiveProjectId: (projectId: string) => void;
}

export const ProjectContext: React.Context<ProjectContextType> = createContext<ProjectContextType>({
	activeProjectId: "",
	projects: [],
	setActiveProjectId: () => {}
});

interface ProjectProviderProps {
	children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({children}) => {
	const location = useLocation();
	const navigate = useNavigate();
	
	const [projects, setProjects] = useState<ProjectInterface[]>([]);
	const [activeProjectId, setActiveProjectId] = useState<string>("e8f7d1c1-df4a-4a1b-b8b8-8b2b0f90c3d2");
	
	// Extract project_id from pathname
	useEffect(() => {
		if (!projects || !projects.length) return;
		const projectId = location.pathname.split("/")[1];
		if (projectId) {
			const projectExists = projects.some(project => project.id === projectId);
			if (!projectExists) {
				navigate(`/forbidden`, {replace: true});
			} else {
				setActiveProjectId(projectId);
			}
		}
	}, [location.pathname, projects, navigate]);
	
	// Fetch projects once on mount
	useEffect(() => {
		const loadProjects = () => {
			try {
				const projectData = JSON.parse(localStorage.getItem('projects') || '[]');
				setProjects(projectData);
			} catch (error) {
				console.error('Failed to fetch projects', error);
			}
			
		};
		loadProjects();
	}, []);
	
	return (
		<ProjectContext.Provider value={{
			projects,
			activeProjectId,
			setActiveProjectId
		}}>
			{children}
		</ProjectContext.Provider>
	);
};
