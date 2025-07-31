import React from 'react';

export const VendorCard = ({ vendor, disabled }) => {
	const cardClasses = `
	bg-base-100 border border-[#64748b40] rounded-lg hover:bg-[#0064FF10] hover:cursor-pointer transition-shadow duration-300
		${disabled ? 'opacity-50 cursor-not-allowed' : ''}
	`;

	const buttonClasses = `
		inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
		${disabled ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-gray-800 bg-gray-200 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'}
		
	`;

	return (
		<div className={cardClasses} >
			<div className="px-4 py-5 sm:p-6 flex-1">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div className="avatar mr-2">
							<div className="w-5 rounded-full">
								<img src="https://seeklogo.com/images/G/github-logo-7880D80B8D-seeklogo.com.png" />
							</div>
						</div>
						<h3 className="text-md font-semibold">{vendor.title}</h3>
					</div>
				</div>
				<div className='mt-3'>
					<span
						className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-base-200 text-primary"
					>
						{vendor.configs.action.type}
					</span>
				</div>
				<div className="mt-3">
					<p className="text-neutral-400 text-sm">{vendor.description}</p>
				</div>
			</div>
			{/* <div className="border-t border-gray-100 px-4 py-3 sm:px-6">
				<div className="text-left">
					<a
						href={disabled ? '#' : ''}
						className={buttonClasses}
						aria-disabled={disabled}
					>
						Configure
					</a>
				</div>
			</div> */}
		</div>
	);
};
