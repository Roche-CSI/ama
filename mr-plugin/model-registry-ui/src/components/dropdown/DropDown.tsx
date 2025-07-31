/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useRef, useState, useEffect } from "react";

interface DropDownProps<T> {
	title: string;
	options: T[];
	onSelect: (item: T) => void;
	icon: React.ReactNode;
	className?: string;
	stateless?: boolean;
}

export const DropDown = <T extends { id: string; name: string }>({
	                                                          title,
	                                                          options,
	                                                          onSelect,
	                                                          icon,
	                                                          className,
	                                                          stateless = false,
                                                          }: DropDownProps<T>) => {
	console.log("DropDown", title, options, onSelect, icon, className, stateless);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState<T | null>(null);
	
	const handleSelect = (e: React.MouseEvent<HTMLButtonElement>, value: T) => {
		e.preventDefault();
		!stateless && setActive(value);
		setIsOpen(false);
		onSelect && onSelect(value);
	};
	
	const handleClickOutside = (e: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
			setIsOpen(false);
		}
	};
	
	useEffect(() => {
		if (isOpen) {
			window.addEventListener('mousedown', handleClickOutside);
		}
		return () => window.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);
	
	return (
		<div className="hidden lg:block relative z-10" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={className || "btn flex items-center py-3 px-4 btn-ghost text-sm font-light bg-gray-200 w-max"}
			>
				{icon}
				<span className={active ? "font-extrabold" : ""}>
          {active ? active.name : title}
        </span>
			</button>
			
			{isOpen && (
				<div className="absolute mt-2 bg-base-100 rounded-lg shadow-lg w-max min-w-full">
					<div className="py-2">
						{options.map((item) => (
							<button
								key={item.id}
								onClick={(e) => handleSelect(e, item)}
								className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150"
							>
								{item.name}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
