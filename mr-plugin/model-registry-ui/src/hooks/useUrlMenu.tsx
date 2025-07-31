import { useLocation } from 'react-router-dom';

export const useUrlMenu = () => {
	const location = useLocation();
	
	const getActiveMenuItem = () => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
		// Assuming the fixed position of the menu item is at index 1
		// For URL like /2/deployments/<id>, 'deployments' is at index 1
		const fixedMenuPosition = 1;
		const menuItem = pathSegments[fixedMenuPosition] || '';
		return menuItem;
	};
	
	return getActiveMenuItem();
};

