/* eslint-disable no-mixed-spaces-and-tabs */
import React, {ChangeEvent} from 'react';

interface FilterBarProps {
	onSearch?: (searchTerm: string) => void;
	placeholder?: string;
	className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({onSearch, placeholder = 'Filter by name', className}: FilterBarProps) => {
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		onSearch && onSearch(e.target.value);
	};
	
	return (
		<label className={`input input-bordered flex items-center gap-2 h-10 ${className}`}>
			<svg
				xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
				className="h-4 w-4 opacity-70">
				<path fillRule="evenodd"
				      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
				      clipRule="evenodd"/>
			</svg>
			<input
				type="text"
				className="grow flex-1"
				placeholder={placeholder}
				onChange={handleSearch}
			/>
		</label>
	);
};
