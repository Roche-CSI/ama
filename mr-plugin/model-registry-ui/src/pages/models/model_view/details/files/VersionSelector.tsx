/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

export interface Option {
	id: string | number;
	number: string;
	label: string;
}

interface SelectorProps {
	options: Option[];
	label?: string;
	selectedId?: string | number;
	onSelect?: (option: Option) => void;
	latestId?: string | number;
	disabled?: boolean; // Added disabled prop
}

interface TriggerProps {
	value: string;
	open: boolean;
	label?: string;
	disabled?: boolean; // Added disabled prop
}

const Trigger: React.FC<TriggerProps & { isLatest?: boolean }> = ({
	                                                                  value,
	                                                                  open,
	                                                                  label,
	                                                                  isLatest,
	                                                                  disabled
                                                                  }) => {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<span className="text-xs font-medium text-neutral-500 px-1">
                    {label}
                </span>
			)}
			<button
				disabled={disabled}
				className={`flex w-full min-w-[10rem] items-center justify-between rounded-md border border-base-300 px-3 py-2 text-sm font-medium transition-colors
                    ${disabled
					? 'bg-base-200 text-base-content/50 cursor-not-allowed'
					: 'hover:bg-base-200'
				}`}
			>
				<div className="flex items-center gap-2">
					<span>{value}</span>
					{isLatest && (
						<span className="px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                            Latest
                        </span>
					)}
				</div>
				{open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
			</button>
		</div>
	);
};

export const VersionSelector: React.FC<SelectorProps> = ({
	                                                         options,
	                                                         label,
	                                                         selectedId,
	                                                         latestId,
	                                                         onSelect,
	                                                         disabled
                                                         }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	
	const selectedVersion = options.find(v => v.id === selectedId) || options[0];
	
	const handleSelect = (option: Option) => {
		if (!disabled) {
			setIsOpen(false);
			onSelect?.(option);
		}
	};
	
	const handleToggle = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};
	
	return (
		<div className="relative" ref={dropdownRef}>
			<div onClick={handleToggle}>
				<Trigger
					value={selectedVersion.label}
					open={isOpen}
					label={label}
					isLatest={selectedVersion.id === latestId}
					disabled={disabled}
				/>
			</div>
			
			{isOpen && !disabled && (
				<div className="absolute z-10 mt-1 w-full min-w-[10rem] max-h-60 overflow-auto rounded-md border border-base-300 bg-base-100 py-1 shadow-lg">
					{options.map((version) => (
						<button
							key={version.id}
							className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-base-200 transition-colors"
							onClick={() => handleSelect(version)}
						>
							<span>{version.label}</span>
							{version.id === latestId && (
								<span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                                    Latest
                                </span>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};
