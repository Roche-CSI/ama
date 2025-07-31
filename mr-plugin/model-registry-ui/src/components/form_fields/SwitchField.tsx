import React from "react";

interface SwitchFieldProps {
	label: string;
	name: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	error?: string;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({label, name, checked, onChange, readOnly = false, error}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Create a simulated event object that matches the structure
		// of a standard input change event
		const simulatedEvent = {
			target: {
				name: name,
				value: e.target.checked ? 'on' : 'off',
				type: 'checkbox',
				checked: e.target.checked
			}
		} as React.ChangeEvent<HTMLInputElement>;
		
		onChange(simulatedEvent);
	};
	
	return (
		<div className="flex">
			<label htmlFor={name} className="flex items-center cursor-pointer">
				<div className="relative">
					<input
						type="checkbox"
						id={name}
						name={name}
						checked={checked}
						onChange={handleChange}
						disabled={readOnly}
						className="sr-only"
					/>
					<div
						className={`block w-14 h-6 rounded-full ${checked ? 'bg-secondary' : 'bg-base-300'} ${readOnly ? 'opacity-50' : ''}`}
					></div>
					<div
						className={`dot absolute left-1 top-1 bg-white size-4 rounded-full transition ${
							checked ? 'transform translate-x-8' : ''
						}`}
					></div>
				</div>
				<div className="ml-3 text-sm font-semibold text-gray-700">{label}</div>
			</label>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
};
