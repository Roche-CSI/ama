export interface FileObject{
	id?: string;
	path: string;
	name?: string;
	size?: number;
	created_at?: Date;
	modified_at?: Date;
}

export interface FileItem {
	object: FileObject;
	type: 'file' | 'folder';
	id: string;
	parent?: string;
	items?: FileItem[];
}

export class FileTree {
	private fileObjects: FileObject[];
	
	constructor(fileObjects: FileObject[]) {
		this.fileObjects = fileObjects;
	}
	
	public generateTree(): FileItem {
		// Determine the root folder by finding the common first folder in all paths
		const rootFolderName = this.detectRootFolder("root");
		
		// Initialize root and the tree structure
		const root: FileItem = {
			object: {
				path: 'root',
				name: 'root'
			},
			type: 'folder',
			id: 'root',
			items: []
		};
		
		if (rootFolderName !== 'root') {
			// Initialize detected root folder node
			const rootFolder: FileItem = {
				object: {
					path: rootFolderName,
					name: rootFolderName
				},
				type: 'folder',
				id: rootFolderName,
				items: []
			};
			root.items?.push(rootFolder);
		}
		
		const currentFolder = root.items && root.items.length > 0 ? root.items[0] : root;
		
		// Process each path and add it to the tree
		this.fileObjects.forEach(fileObject => {
			const parts = fileObject.path.split('/');
			this.addPathToTree(currentFolder, parts, fileObject);
		});
		
		return root;
	}
	
	private detectRootFolder(parent: string): string {
		// Extract the first segment of each path and determine the common root folder
		const firstSegments = new Set(this.fileObjects.map(obj => obj.path.split('/')[0]));
		
		if (firstSegments.size !== 1) {
			// Multiple items at root, so return the parent
			return parent;
		}
		
		return Array.from(firstSegments)[0];
	}
	
	private addPathToTree(currentNode: FileItem, pathParts: string[], fileObject: FileObject): void {
		if (pathParts.length === 0) return;
		
		const [currentPart, ...remainingParts] = pathParts;
		
		let childNode = currentNode.items?.find(item => item.object.path === currentPart);
		if (!childNode) {
			childNode = {
				object: {
					id: fileObject.id!,
					path: currentPart,
					name: this.extractName(currentPart),
					size: remainingParts.length === 0 ? fileObject.size : undefined,
					created_at: remainingParts.length === 0 ? fileObject.created_at : undefined,
					modified_at: remainingParts.length === 0 ? fileObject.modified_at : undefined
				},
				type: remainingParts.length > 0 ? 'folder' : 'file',
				id: `${currentNode.id}/${currentPart}`,
				parent: currentNode.id
			};
			if (remainingParts.length > 0) {
				childNode.items = [];
			}
			currentNode.items = currentNode.items || [];
			currentNode.items.push(childNode);
		}
		
		if (remainingParts.length > 0) {
			this.addPathToTree(childNode, remainingParts, fileObject);
		}
	}
	
	private extractName(pathPart: string): string {
		// Extract the file name from the path
		return pathPart.split('/').pop() || '';
	}
}

// Usage Example:
export const fileObjects: FileObject[] = [
	{ path: 'recursive-components-react/.gitignore', size: 123, created_at: new Date('2024-01-01T10:00:00Z'), modified_at: new Date('2024-01-10T15:00:00Z') },
	{ path: 'recursive-components-react/index.html', size: 456, created_at: new Date('2024-02-01T10:00:00Z'), modified_at: new Date('2024-02-10T15:00:00Z') },
	{ path: 'recursive-components-react/package-lock.json', size: 789, created_at: new Date('2024-03-01T10:00:00Z'), modified_at: new Date('2024-03-10T15:00:00Z') },
	{ path: 'recursive-components-react/package.json', size: 101, created_at: new Date('2024-04-01T10:00:00Z'), modified_at: new Date('2024-04-10T15:00:00Z') },
	{ path: 'recursive-components-react/vite.config.js', size: 202, created_at: new Date('2024-05-01T10:00:00Z'), modified_at: new Date('2024-05-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/App.css', size: 303, created_at: new Date('2024-06-01T10:00:00Z'), modified_at: new Date('2024-06-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/App.jsx', size: 404, created_at: new Date('2024-07-01T10:00:00Z'), modified_at: new Date('2024-07-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/index.css', size: 505, created_at: new Date('2024-08-01T10:00:00Z'), modified_at: new Date('2024-08-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/main.jsx', size: 606, created_at: new Date('2024-09-01T10:00:00Z'), modified_at: new Date('2024-09-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/components/Checkbox.jsx', size: 707, created_at: new Date('2024-10-01T10:00:00Z'), modified_at: new Date('2024-10-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/pages/Home.jsx', size: 808, created_at: new Date('2024-11-01T10:00:00Z'), modified_at: new Date('2024-11-10T15:00:00Z') },
	{ path: 'recursive-components-react/src/pages/About.jsx', size: 909, created_at: new Date('2024-12-01T10:00:00Z'), modified_at: new Date('2024-12-10T15:00:00Z') },
	{ path: 'readme.md', size: 1010, created_at: new Date('2024-01-15T10:00:00Z'), modified_at: new Date('2024-01-20T15:00:00Z') }
];


// const fileTree = new FileTree(fileObjects);
// const tree = fileTree.generateTree();
//
// console.log(JSON.stringify(tree, null, 2));
