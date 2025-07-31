/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";

export interface FieldProps {
	label: string;
	name: string;
	value: string;
	placeholder?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	readOnly?: boolean;
	error?: string;
	
}

export const InputField: React.FC<FieldProps> = ({
	                                                 label, name,
	                                                 value, onChange,
	                                                 placeholder = "",
	                                                 readOnly = false,
	                                                 error
                                                 }) => (
	<div className="flex-1 text-sm ">
		<label htmlFor={name} className="block font-semibold text-gray-700 mb-1">{label}</label>
		<input
			id={name}
			name={name}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			readOnly={readOnly}
			className={`w-full p-2 border rounded-md ${readOnly ? "bg-base-200 text-neutral-500" : ""} ${error ? "border-red-500" : ""}`}
		/>
		{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
	</div>
);
