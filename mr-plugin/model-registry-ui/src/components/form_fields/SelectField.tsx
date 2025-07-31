/* eslint-disable no-mixed-spaces-and-tabs */

import React from "react";
import {ChevronDown} from "lucide-react";
import {FieldProps} from "./InputField";


interface SelectFieldProps extends FieldProps {
	options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
	                                                        label,
	                                                        name,
	                                                        value,
	                                                        onChange,
	                                                        options,
	                                                        readOnly = false,
	                                                        error
                                                        }) => (
	<div className="flex-1 text-sm">
		<label htmlFor={name} className="block font-semibold text-gray-700 mb-1">{label}</label>
		<div className="relative">
			<select
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				disabled={readOnly}
				className={`w-full p-2 border rounded-md ${readOnly ? "bg-base-200 text-neutral-500" : ""} ${error ? "border-red-500" : ""} appearance-none`}
				style={{WebkitAppearance: "none", MozAppearance: "none"}}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
				<ChevronDown className="size-4 text-neutral-500"/>
			</div>
		</div>
		{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
	</div>
);

