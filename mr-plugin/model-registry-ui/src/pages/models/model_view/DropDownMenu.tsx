/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useState, useRef, useEffect} from 'react';
import {ChevronDown, Menu} from 'lucide-react';

interface MenuItem {
	id: string;
	label: string;
	icon: React.ReactNode;
}

interface DropdownMenuProps {
	menuItems: MenuItem[];
	className?: string;
	onMenuClick: (arg0: MenuItem) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({menuItems, className, onMenuClick}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	
	const handleMenuClick = (item) => {
		setIsOpen(false);
		onMenuClick(item);
	}
	
	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={className || "flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"}>
				<Menu className="w-5 h-5"/>
				<span>Actions</span>
				<ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
			</button>
			
			{isOpen && (
				<div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
					<div className="p-4">
						<h6 className="text-gray-500 mb-2">Actions</h6>
						<ul className="space-y-1">
							{
								menuItems.map((item, index) => (
									<li key={index}>
										<div
											className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
											onClick={() => handleMenuClick(item)}>
											{item.icon || <Menu className="size-5"/>}
											{item.label}
										</div>
									</li>
								))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
