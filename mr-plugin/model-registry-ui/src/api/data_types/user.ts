import {jwtDecode} from 'jwt-decode';
import {ProjectInterface} from "./project.ts";

type UserData = {
	id: string;
	username: string;
	email: string;
	token: string;
}



export default class User {
	
	private jwt: string;
	private data: never;
	
	constructor(jwt: string) {
		this.jwt = jwt;
		this.data = jwtDecode(jwt);
	}
	
	get userData(): UserData {
		const user = this.data.user;
		if (!user) {
			throw new Error('User data not found in JWT');
		}
		
		return {
			id: user.id,
			username: user.username,
			email: user.email,
			token: this.jwt
		}
	}
	//gs:md5_8bZyVwu/kKC2W5nLqrw5bg==::summary_dict.json
	// gs:md5_NlEP8NyE9jkKHAAVnJQF5Q==::summary_dict.json
	get projects(): ProjectInterface[] {
		const roles = this.data.roles;
		if (!roles) {
			throw new Error('User roles not found in JWT');
		}
		
		// Create a map to group roles by project ID
		const projectMap = new Map<string, { project: any, roles: any[] }>();
		
		roles.forEach((role: any) => {
			const projectId = role.project.id;
			if (!projectMap.has(projectId)) {
				projectMap.set(projectId, {
					project: role.project,
					roles: []
				});
			}
			projectMap.get(projectId)?.roles.push({
				can_admin: role.can_admin_project,
				can_delete: role.can_delete,
				can_edit: role.can_edit,
				can_read: role.can_read
			});
		});
		
		// Combine roles for each project, keeping highest privileges
		return Array.from(projectMap.values()).map(({ project, roles }) => {
			const combinedRoles = {
				can_admin: roles.some(r => r.can_admin),
				can_delete: roles.some(r => r.can_delete),
				can_edit: roles.some(r => r.can_edit),
				can_read: roles.some(r => r.can_read)
			};
			
			return { ...project, roles: combinedRoles };
		});
	}
	
	get activeProjectId(): string {
		// todo: implement this
		return "e8f7d1c1-df4a-4a1b-b8b8-8b2b0f90c3d2";
		// const projects = this.projects;
		// if (projects.length === 1) {
		// 	return projects[0].id;
		// }
		//
		// const defaultProjectId = this.data.default_project;
		// if (defaultProjectId) {
		// 	const defaultProject = projects.find(project => project.id === defaultProjectId);
		// 	if (defaultProject) {
		// 		return defaultProject.id;
		// 	}
		// }
		// return projects[0].id;
	}
}
