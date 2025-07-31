import {ReactNode, useState} from "react";
import {ThemeContext} from "./hook.ts";

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState('roche')
	
	/**
	 * Toggles the current theme and applies the theme class to the root element.
	 * @param {string} themeName - The name of the theme to apply.
	 */
	const toggleTheme = (themeName: string) => {
		setTheme((themeName));
		// Apply theme class to root element
		document.documentElement.className = themeName
	};
	
	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
