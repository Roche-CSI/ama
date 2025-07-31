import React from "react";
import { UserCircleIcon } from "../icons"; // Import your icon here

interface ChatBubbleProps {
	message: string;
	author: string;
	timestamp: string;
	position?: "left" | "right"; // Optional prop to handle position
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
	                                                      message,
	                                                      author,
	                                                      timestamp,
	                                                      position = "left", // Default to "left" if no position is provided
                                                      }) => {
	const isLeft = position === "left";
	
	return (
		<div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} items-start gap-2.5 mb-4`}>
			{/* Conditionally style the icon based on position */}
			<UserCircleIcon className={`w-8 h-8 text-gray-500 dark:text-gray-400 rounded-full ${isLeft ? 'mr-2' : 'ml-2'}`} />
			
			{/* Bubble container */}
			<div
				className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700 ${
					isLeft ? 'rounded-br-none' : 'rounded-bl-none'
				}`}
			>
				{/* Header with author and timestamp */}
				<div className="flex items-center space-x-2 rtl:space-x-reverse">
					<span className="text-sm font-semibold text-gray-900 dark:text-white">{author}</span>
					<span className="text-sm font-normal text-gray-500 dark:text-gray-400">{timestamp}</span>
				</div>
				
				{/* Message text */}
				<p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message}</p>
				<span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
			</div>
			
			{/* Options button */}
			<button
				id="dropdownMenuIconButton"
				data-dropdown-toggle="dropdownDots"
				data-dropdown-placement="bottom-start"
				className={`inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 ${isLeft ? 'ml-2' : 'mr-2'}`}
				type="button"
			>
				<svg
					className="w-4 h-4 text-gray-500 dark:text-gray-400"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 4 15"
				>
					<path
						d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
					/>
				</svg>
			</button>
			
			{/* Dropdown menu */}
			<div
				id="dropdownDots"
				className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600"
			>
				<ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
					<li>
						<a
							href="#"
							className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Reply
						</a>
					</li>
					<li>
						<a
							href="#"
							className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Forward
						</a>
					</li>
					<li>
						<a
							href="#"
							className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Copy
						</a>
					</li>
					<li>
						<a
							href="#"
							className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Report
						</a>
					</li>
					<li>
						<a
							href="#"
							className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							Delete
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};
