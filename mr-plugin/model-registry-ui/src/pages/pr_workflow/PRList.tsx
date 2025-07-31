/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';

// Sample data
const samplePRs = [
	{ id: 1, title: "Release model-v1.0", author: "alice", status: "open", createdAt: "2024-08-25T10:00:00Z" },
	{ id: 2, title: "Pre-release model-v0.9", author: "bob", status: "open", createdAt: "2024-08-24T14:30:00Z" },
	{ id: 3, title: "Update model metadata", author: "charlie", status: "closed", createdAt: "2024-08-23T09:15:00Z" },
];

const samplePRDetails = {
	id: 1,
	title: "Release model-v1.0",
	author: "alice",
	status: "open",
	createdAt: "2024-08-25T10:00:00Z",
	description: "This PR proposes to release model-v1.0 to production. The model has passed all required tests and validations.",
	changes: [
		{ file: "model/metadata.json", changes: "+version: 1.0.0\n-version: 0.9.2" },
		{ file: "model/weights.h5", changes: "Binary file changed" },
	],
	comments: [
		{ id: 1, author: "bob", content: "Looks good to me. Have we run the final accuracy test?", createdAt: "2024-08-25T11:30:00Z" },
		{ id: 2, author: "alice", content: "Yes, the accuracy test passed with 98.5% accuracy.", createdAt: "2024-08-25T12:00:00Z" },
	],
};

// PRList Component
export const PRList = () => {
	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-md">
			<ul className="divide-y divide-gray-200">
				{samplePRs.map((pr) => (
					<li key={pr.id}>
						<a href={`#pr-${pr.id}`} className="block hover:bg-gray-50">
							<div className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium text-indigo-600 truncate">{pr.title}</p>
									<div className="ml-2 flex-shrink-0 flex">
										<p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											pr.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
											{pr.status}
										</p>
									</div>
								</div>
								<div className="mt-2 sm:flex sm:justify-between">
									<div className="sm:flex">
										<p className="flex items-center text-sm text-gray-500">
											<svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
											</svg>
											{pr.author}
										</p>
									</div>
									<div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
										<svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
										</svg>
										<p>
											Created on <time dateTime={pr.createdAt}>{new Date(pr.createdAt).toLocaleDateString()}</time>
										</p>
									</div>
								</div>
							</div>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

// PRDetails Component
export const PRDetails = ({ pr = samplePRDetails }) => {
	return (
		<div className="bg-white shadow overflow-hidden sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg leading-6 font-medium text-gray-900">
					PR #{pr.id}: {pr.title}
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Created by {pr.author} on {new Date(pr.createdAt).toLocaleString()}
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-5 sm:px-6">
				<dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
					<div className="sm:col-span-2">
						<dt className="text-sm font-medium text-gray-500">Description</dt>
						<dd className="mt-1 text-sm text-gray-900">{pr.description}</dd>
					</div>
					<div className="sm:col-span-2">
						<dt className="text-sm font-medium text-gray-500">Changes</dt>
						<dd className="mt-1 text-sm text-gray-900">
							{pr.changes.map((change, index) => (
								<div key={index} className="mb-2">
									<p className="font-semibold">{change.file}</p>
									<pre className="bg-gray-100 p-2 rounded">{change.changes}</pre>
								</div>
							))}
						</dd>
					</div>
				</dl>
			</div>
			<div className="border-t border-gray-200 px-4 py-5 sm:px-6">
				<h4 className="text-lg leading-6 font-medium text-gray-900 mb-4">Comments</h4>
				{pr.comments.map((comment) => (
					<div key={comment.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center mb-2">
							<span className="font-semibold mr-2">{comment.author}</span>
							<span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
						</div>
						<p>{comment.content}</p>
					</div>
				))}
			</div>
		</div>
	);
};

// ReviewComponent
export const ReviewComponent = () => {
	const [comment, setComment] = useState('');
	const [approval, setApproval] = useState('');
	
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Submitted review:', { comment, approval });
		// Here you would typically send this data to your backend
		setComment('');
		setApproval('');
	};
	
	return (
		<div className="bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<h3 className="text-lg leading-6 font-medium text-gray-900">
					Review this PR
				</h3>
				<div className="mt-5">
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="comment" className="block text-sm font-medium text-gray-700">
								Comment
							</label>
							<div className="mt-1">
                <textarea
	                id="comment"
	                name="comment"
	                rows={3}
	                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
	                value={comment}
	                onChange={(e) => setComment(e.target.value)}
                />
							</div>
						</div>
						<div className="mt-4">
							<label htmlFor="approval" className="block text-sm font-medium text-gray-700">
								Approval
							</label>
							<select
								id="approval"
								name="approval"
								className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
								value={approval}
								onChange={(e) => setApproval(e.target.value)}
							>
								<option value="">Select an option</option>
								<option value="approve">Approve</option>
								<option value="request-changes">Request Changes</option>
								<option value="comment">Comment</option>
							</select>
						</div>
						<div className="mt-5">
							<button
								type="submit"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Submit Review
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
