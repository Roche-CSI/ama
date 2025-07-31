/* eslint-disable no-mixed-spaces-and-tabs */
// Discussions.js
import React from 'react';
import {ChatBubble} from "../../../../components/chat/ChatBubble.tsx";

export const Discussions: React.FC = ({ model }) => {
	console.log(model.discussions);
	return (
		<div className="p-4 border border-gray-200 rounded-md shadow-sm">
			<h2 className="text-xl font-bold mb-4">Discussions</h2>
			{model.discussions.map((thread) => (
				<div key={thread.threadId} className="mb-4">
					<div className="font-semibold mb-2">{thread.title}</div>
					{thread.comments.map((comment, index) => (
						<ChatBubble message={comment.comment}
						            author={comment.author}
						            timestamp={comment.timestamp}
						            key={index}
						            position={index % 2 === 0 ? 'left' : 'right'} // Alternates the position
						/>
						// <div key={index} className="mb-2">
						// 	<div className="font-semibold">{comment.author}</div>
						// 	<div className="text-gray-600">{comment.comment}</div>
						// 	<div className="text-gray-500 text-sm">{comment.timestamp}</div>
						// </div>
					))}
				</div>
			))}
		</div>
	);
};
