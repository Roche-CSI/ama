import {useContext} from "react";
import {ProjectContext, ProjectContextType} from "./ProjectProvider.tsx";

export const useProject = () => {
	const context: ProjectContextType | undefined = useContext(ProjectContext);
	if (context === undefined) {
		throw new Error('useProject must be used within a ProjectProvider');
	}
	
	const {activeProjectId, projects, setActiveProjectId} = context;
	
	return {
		activeProjectId,
		projects,
		setActiveProjectId
	};
}
