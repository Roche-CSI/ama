import React from 'react';

export const MonitoringVendorCard = ({ vendor, disabled }) => {
	const cardClasses = `
		bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden flex flex-col h-full hover:bg-blue-100 cursor-pointer
		${disabled ? 'opacity-50 cursor-not-allowed' : ''}
	`;
	
	const buttonClasses = `
		inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
		${disabled ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-gray-800 bg-gray-200 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'}
	`;
	
	return (
		<div className={cardClasses}>
			<div className="px-4 py-5 sm:p-6 flex-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
					<div className="avatar mr-2">
							<div className="w-6 rounded-full">
								<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh8H3xi4Vh_qPRxg0fOJ-6kQuv4Ni0pWfhqQ&s" />
							</div>
						</div>
						<h3 className="text-lg font-semibold">{vendor.name}</h3>
					</div>
				</div>
					<div className='mt-3'>
						<span
							className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 text-xs"
						>
							{vendor.action.type}
						</span>
					</div>
				<div className="mt-3">
					<p className="text-gray-600 text-sm">{vendor.action.description}</p>
				</div>
			</div>
			{/*<div className="px-4 py-3 sm:px-6">*/}
			{/*	<div className="text-right">*/}
			{/*		<a*/}
			{/*			href={disabled ? '#' : ''}*/}
			{/*			className={buttonClasses}*/}
			{/*			aria-disabled={disabled}*/}
			{/*		>*/}
			{/*			Configure*/}
			{/*		</a>*/}
			{/*	</div>*/}
			{/*</div>*/}
		</div>
	);
};
