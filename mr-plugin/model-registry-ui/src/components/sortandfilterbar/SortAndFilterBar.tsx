/* eslint-disable no-mixed-spaces-and-tabs */
import React, {ChangeEvent, useState} from 'react';
import {ResetIcon} from "../icons";


// Define the props for the TopBar component
interface BarProps<T> {
	itemIcon?: React.ReactNode;
	itemLabel?: string;
	itemCount?: number;
	onSearch: (searchTerm: T) => void;
	onRightButtonClick?: () => void;
	onReset?: () => void;
	placeholder: string;
	rightButtonLabel?: string;
	rightButtonIcon?: React.ReactNode;
}

// The TopBar component
export const SortAndFilterBar = <T, >({
	                                      itemIcon,
	                                      itemLabel,
	                                      itemCount,
	                                      onSearch,
	                                      placeholder,
	                                      rightButtonLabel,
	                                      rightButtonIcon,
	                                      onRightButtonClick
                                      }: BarProps<T>) => {
	
	const [inputValue, setInputValue] = useState<string>('');
	
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		onSearch && onSearch(value as T);
	};
	
	const handleReset = () => {
		setInputValue('');
		onSearch && onSearch('' as T);
	};
	
	const handleClick = () => {
		onRightButtonClick && onRightButtonClick();
	}
	
	return (
		<div className="basis-3/4 flex gap-2 self-start mb-4 justify-between">
			<div className="flex gap-2 text-md">
				<p className="flex font-bold self-center text-base-content text-md">
					{itemIcon}
					{itemLabel}
				</p>
				<p className="flex self-center text-neutral-400 mr-4 text-md min-w-[20px]">{itemCount?.toLocaleString()}</p>
				{/* FILTER BAR */}

				<div className="flex gap-1">
			<label className=" input input-bordered flex items-center gap-2 h-8 grow flex-1 px-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="h-4 w-4 opacity-70">
					<path
						fillRule="evenodd"
						d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
						clipRule="evenodd" />
				</svg>
				<input type="text" className="grow" placeholder={placeholder} value={inputValue}
				onChange={handleInputChange}/>
			</label>
			{
				inputValue &&
				<button className="btn btn-square btn-ghost btn-sm"
					onClick={handleReset}>
					<ResetIcon className={"size-6"} />
				</button>
			}
		</div>
				{/* FILTER BAR END */}
			</div>
			{/* SORT BUTTON */}
			{rightButtonLabel && (
				<button className="btn btn-secondary btn-sm shadow-sm" onClick={() => handleClick()}>
					{rightButtonIcon}
					{rightButtonLabel}
				</button>
			)}
			{/* SORT BUTTON END */}
		</div>
	);
};
