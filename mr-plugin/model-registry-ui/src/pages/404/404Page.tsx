import React from 'react';


export const Page404: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="max-w-md w-full text-center px-6 py-16 space-y-8">
				{/* Error Icon */}
				<div className="relative">
					<svg
						className="mx-auto h-24 w-24 text-blue-500 animate-pulse"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				
				{/* Error Message */}
				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900">
						Page Not Found
					</h1>
					<p className="text-lg text-gray-600">
						Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
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
