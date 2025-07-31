// separate file for react fast refresh
import React, {createContext} from "react";

export interface ThemeContextType {
	theme: string;
	toggleTheme: (themeName: string) => void;
}

/**
 * Provides theme context to children components.
 * @param {ReactNode} children - The children components that will have access to the theme context.
 * @returns {JSX.Element} The ThemeProvider component.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to access the theme context.
 * @returns {ThemeContextType} The current theme and the function to toggle the theme.
 * @throws {Error} If the hook is used outside of the ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
	const context = React.useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	console.log("context", context);
	return context;
}
