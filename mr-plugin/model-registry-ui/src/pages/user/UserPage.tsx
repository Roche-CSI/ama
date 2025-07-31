/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {DataGrid} from "../../components/datagrid";
import {ModelIcon} from "../../components/icons";
import {BreadCrumbNav} from "../../components/breadcrumbnav";

const NAV_SECTIONS = [
	{label: "Models", link: "/models"},
	{label: "black-forest-labs", link: "./"},
];

export const UserPage = () => {
	// Sample user data
	const user = {
		name: 'Black Forest Labs',
		username: 'black-forest-labs',
		avatar: '/api/placeholder/200/200',
		bio: 'Innovating in AI and machine learning. We create cutting-edge models for various applications.',
		location: 'Black Forest, Germany',
		joinDate: 'Joined January 2022',
		repositories: [
			{
				name: 'NLP-Classifier',
				description: 'A powerful NLP classification model',
				language: 'Python',
				stars: 120,
				forks: 35
			},
			{
				name: 'Image-Segmentation',
				description: 'Advanced image segmentation using deep learning',
				language: 'Python',
				stars: 85,
				forks: 22
			},
			{
				name: 'Time-Series-Forecaster',
				description: 'Accurate time series forecasting model',
				language: 'R',
				stars: 200,
				forks: 50
			},
			{
				name: 'Sentiment-Analyzer',
				description: 'Real-time sentiment analysis for social media',
				language: 'Python',
				stars: 150,
				forks: 40
			},
		]
	};
	
	return (
		<div className="container mx-auto px-4 py-8">
			<BreadCrumbNav Icon={ModelIcon} sections={NAV_SECTIONS}
			               badge={""}/>
			<div className="flex flex-col md:flex-row mt-6">
				{/* User info sidebar */}
				<div className="md:w-1/4 mb-8 md:mb-0 p-4">
					<div className="mb-8 md:mb-0 p-4 flex flex-col items-center">
						<div
							className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-red-400 flex items-center justify-center">
							<span className="text-neutral-content text-center font-semibold">user</span>
						</div>
						<h1 className="text-2xl font-bold text-center">{user.name}</h1>
						<p className="text-xl text-neutral-400 mb-4 text-center">{user.username}</p>
						<p className="mb-4 text-center text-neutral">{user.bio}</p>
						<p className="flex items-center mb-2 text-neutral">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
							     stroke="currentColor" className="w-5 h-5 mr-2">
								<path strokeLinecap="round" strokeLinejoin="round"
								      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
								<path strokeLinecap="round" strokeLinejoin="round"
								      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
							</svg>
							{user.location}
						</p>
						<p className="flex items-center mb-4 text-neutral">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
							     stroke="currentColor" className="w-5 h-5 mr-2">
								<path strokeLinecap="round" strokeLinejoin="round"
								      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
							</svg>
							{user.joinDate}
						</p>
					</div>
				</div>
				
				{/* Repositories section */}
				<div className="md:w-3/4 md:pl-8">
					<h2 className="text-2xl font-bold mb-4 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
						     stroke="currentColor" className="w-6 h-6 mr-2">
							<path strokeLinecap="round" strokeLinejoin="round"
							      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
						</svg>
						Repositories
					</h2>
					<div className="space-y-4">
						<DataGrid items={user.repositories} itemCard={RepoCard}/>
						{/*user.repositories.map((repo) => (*/}
						{/*	<RepoCard repo={repo} />*/}
						{/*))}*/}
					</div>
				</div>
			</div>
		</div>
	);
};

const RepoCard = ({item}) => {
	return (
		<div key={item.name} className="bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4">
			<h3 className="text-xl font-semibold mb-2 text-base-content">{item.name}</h3>
			<p className="text-neutral mb-2">{item.description}</p>
			<div className="flex items-center space-x-4 text-neutral-400">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>
	                  {item.language}
                  </span>
				<span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                    </svg>
					{item.stars}
                  </span>
				<span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                    </svg>
					{item.forks}
                  </span>
			</div>
		</div>
	)
}
