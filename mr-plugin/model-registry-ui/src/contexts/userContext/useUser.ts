import {useContext} from "react";
import {UserContext, UserData} from "./UserProvider";


export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	
	const { userData, setUserData } = context;
	
	const updateUser = (newData: Partial<UserData>) => {
		if (!userData) return;
		setUserData({ ...userData, ...newData });
	};
	
	const clearUser = () => {
		setUserData(null);
	};
	
	return {
		userData,
		setUserData,
		updateUser,
		clearUser,
		isLoggedIn: !!userData
	};
};
