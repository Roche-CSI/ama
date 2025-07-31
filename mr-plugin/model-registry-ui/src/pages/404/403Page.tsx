import React from 'react';

export const Page403: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="max-w-md w-full text-center px-6 py-16 space-y-8">
				{/* Error Icon */}
				<div className="relative">
					<svg
						className="mx-auto h-24 w-24 text-red-500 animate-pulse"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3a3 3 0 11-6 0 3 3 0 016 0z" />
						<path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				
				{/* Error Message */}
				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900">
						Access Denied
					</h1>
					<p className="text-lg text-gray-600">
						Sorry, you don't have permission to access this resource. Please check your credentials or contact the administrator.
					</p>
				</div>
				
				{/* Action Buttons */}
				<div className="flex justify-center gap-4 pt-4">
					<button
						onClick={() => window.history.back()}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						Go Back
					</button>
					
					<button
						onClick={() => window.location.href = '/'}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						Home Page
					</button>
				</div>
			</div>
		</div>
	);
}
