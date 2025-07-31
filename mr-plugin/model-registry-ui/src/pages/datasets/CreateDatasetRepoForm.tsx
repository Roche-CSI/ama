import React, { useState } from "react";
import {ArtifactsIcon, ModelIcon} from "../../components/icons";

export const CreateDatasetRepoForm: React.FC = () => {
	const [repoName, setRepoName] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState("public");
	const [initialize, setInitialize] = useState(false);
	
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle form submission logic
		console.log({
			repoName,
			description,
			visibility,
			initialize,
		});
	};
	
	return (
		<div className="max-w-4xl p-0 rounded-lg">
			<form onSubmit={handleSubmit}>
				{/* Repository Name */}
				<div className="mb-6">
					<label className="block text-md font-medium text-neutral-500 mb-2" htmlFor="repoName">
						Collection Name
					</label>
					<input
						type="text"
						id="repoName"
						value={repoName}
						onChange={(e) => setRepoName(e.target.value)}
						className="w-full p-3 text-sm border border-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-base-300"
						placeholder="Enter collection name"
						required
					/>
				</div>
				
				{/* Description */}
				<div className="mb-6">
					<label className="block text-md font-medium text-neutral-500 mb-2" htmlFor="description">
						Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-3 text-sm border border-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-base-300"
						placeholder="Add a description (optional)"
					/>
				</div>
				
				{/* Visibility */}
				<div className="mb-6">
					<span className="block text-md font-medium text-neutral-500 mb-2">Visibility</span>
					<div className="flex items-center">
						<input
							type="radio"
							id="public"
							name="visibility"
							value="public"
							checked={visibility === "public"}
							onChange={() => setVisibility("public")}
							className="mr-2"
						/>
						<label htmlFor="public" className="mr-6 text-neutral-400 text-sm">Public</label>
						<input
							type="radio"
							id="private"
							name="visibility"
							value="private"
							checked={visibility === "private"}
							onChange={() => setVisibility("private")}
							className="mr-2"
						/>
						<label htmlFor="private" className="text-gray-400 text-sm">Private</label>
					</div>
				</div>
				
				{/* Submit Button */}
				<button
					type="submit"
					className="btn btn-secondary rounded-md mt-8">
					<ArtifactsIcon className="size-6 p-1 mr-2"/>
					Create Dataset
				</button>
			</form>
		</div>
	);
};
