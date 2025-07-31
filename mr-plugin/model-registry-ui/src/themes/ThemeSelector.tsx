import { useTheme } from "./hook.ts";

// daisy-ui inbuilt themes
const themes: string[] = [
	"roche",
	"light",
	"dark",
	"cupcake",
	// "bumblebee",
	"emerald",
	// "corporate",
	// "synthwave",
	// "retro",
	// "cyberpunk",
	// "valentine",
	"halloween",
	"garden",
	"forest",
	"aqua",
	"lofi",
	"pastel",
	"fantasy",
	// "wireframe",
	"black",
	// "luxury",
	"dracula",
	"cmyk",
	// "autumn",
	// "business",
	// "acid",
	// "lemonade",
	// "night",
	// "coffee",
	// "winter",
	// "dim",
	// "nord",
	"sunset"];

/**
 * Component to select a theme from the available themes.
 * @returns {JSX.Element} The ThemeSelector component.
 */

export const ThemeSelector = () => {
	const { theme, toggleTheme } = useTheme();
	
	return (
		<div className="dropdown">
			<div tabIndex={0} role="button" className="btn btn-ghost">
				{theme}
				<svg
					width="12px"
					height="12px"
					className="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			{/*menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow*/}
			<ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-300 rounded-box z-[1] mt-3 w-52 shadow-2xl">
				{themes.map((themeName) => (
					<li key={themeName}>
						<input
							type="radio"
							name="theme-dropdown"
							className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label={themeName}
							value={themeName}
							checked={theme === themeName}
							onChange={() => toggleTheme(themeName)}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
