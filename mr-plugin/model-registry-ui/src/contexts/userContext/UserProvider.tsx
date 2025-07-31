import React, { useState, ReactNode, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProviderProps {
	children: ReactNode;
}

export interface UserData {
	id: string;
	name: string;
	email: string;
}

interface UserContextType {
	userData: UserData | null;
	setUserData: (userData: UserData | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const SAMPLE_USER_DATA = {
	id: "acde070d-8c4c-4f0d-9d8a-162843c10333",
	name: "mahanti",
	email: "myemail@roche.com"
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const navigate = useNavigate();
	const [userData, setUserData] = useState<UserData | null>(() => {
		// Initialize state from localStorage during state initialization
		const storedData = localStorage.getItem('userData');
		if (storedData) {
			try {
				return JSON.parse(storedData);
			} catch (error) {
				console.error('Failed to parse initial user data', error);
				return null;
			}
		}
		return null;
	});
	
	// Initialize localStorage with sample data if empty
	useEffect(() => {
		console.log('Initial useEffect running');
		if (!localStorage.getItem('userData')) {
			console.log('Setting sample data in localStorage');
			localStorage.setItem('userData', JSON.stringify(SAMPLE_USER_DATA));
			setUserData(SAMPLE_USER_DATA);
		}
	}, []); // Empty dependency array for initialization
	
	// Navigate if no user data
	useEffect(() => {
		console.log('Navigation useEffect running, userData:', userData);
		if (!userData) {
			console.log('No user data, navigating to root');
			navigate('/', { replace: true });
		}
	}, [userData, navigate]);
	
	// Save user data changes to localStorage
	useEffect(() => {
		console.log('localStorage update useEffect running, userData:', userData);
		if (userData) {
			localStorage.setItem('userData', JSON.stringify(userData));
		} else {
			localStorage.removeItem('userData');
		}
	}, [userData]);
	
	return (
		<UserContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserContext.Provider>
	);
};
