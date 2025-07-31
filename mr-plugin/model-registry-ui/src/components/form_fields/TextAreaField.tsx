/* eslint-disable no-mixed-spaces-and-tabs */

import {FieldProps} from "./InputField.tsx";
import React from "react";

interface TextAreaFieldProps extends FieldProps {
	rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
	                                                            label,
	                                                            name,
	                                                            value,
	                                                            onChange,
	                                                            placeholder = "",
	                                                            readOnly = false,
	                                                            rows = 4,
	                                                            error
                                                            }) => (
	<div className="flex-1 text-sm">
		<label htmlFor={name} className="block font-semibold text-gray-700 mb-1">{label}</label>
		<textarea
			id={name}
			name={name}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			readOnly={readOnly}
			className={`w-full p-2 border rounded-md ${readOnly ? "bg-base-200 text-neutral-500" : ""} ${error ? "border-red-500" : ""}`}
			rows={rows}
		/>
		{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
	</div>
);
