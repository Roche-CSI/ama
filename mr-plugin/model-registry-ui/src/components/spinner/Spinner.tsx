/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';

interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
	                                                size = 'xl',
	                                                message = 'Loading...'
                                                }) => {
	const sizeClasses = {
		sm: 'w-6 h-6 border-2',
		md: 'w-8 h-8 border-2',
		lg: 'w-12 h-12 border-3',
		xl: 'w-16 h-16 border-4'
	};
	
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<div
				className={`${sizeClasses[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}
				role="status"
				aria-label="loading"
			>
				<span className="sr-only">Loading...</span>
			</div>
			{message && (
				<p className="text-sm text-gray-600">{message}</p>
			)}
		</div>
	);
};
