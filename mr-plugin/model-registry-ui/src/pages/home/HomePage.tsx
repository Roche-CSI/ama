/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/logo";
import { BaseCallingSVG, CancerDetectionAI, CancerDetectionSVG } from "./SVGArts.tsx";
import MockData from '../../api/mocks/data/models_mock_data.json';
import User from "../../api/data_types/user.ts";
import { ActivitySquare, Boxes, Brain, Cpu, Network, Waves } from 'lucide-react';

const SVGArts = {
	"basecalling model": <BaseCallingSVG className="bg-slate-100"/>,
	"cancer cell detection": <CancerDetectionAI className="bg-slate-100"/>,
	"drug response prediction": <CancerDetectionSVG className="bg-slate-100"/>,
};

// Initialize loading state based on URL parameters
const getInitialLoadingState = () => {
	const query = new URLSearchParams(window.location.search);
	return !!query.get('jwt');
};

const LoadingScreen: React.FC = () => (
	<div className="fixed inset-0 bg-gradient-to-b from-base-100 to-base-200 flex flex-col items-center justify-center z-50">
		<div className="relative w-96 h-96">
			{/* Animated Background Effect */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="absolute w-64 h-64 bg-accent/5 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
				<div className="absolute w-56 h-56 bg-accent/5 rounded-full animate-[pulse_2s_ease-in-out_infinite] delay-300" />
				<div className="absolute w-48 h-48 bg-accent/5 rounded-full animate-[pulse_2s_ease-in-out_infinite] delay-500" />
			</div>
			
			{/* Neural Grid Background */}
			<div className="absolute inset-0 opacity-10">
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
						<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
					</pattern>
					<rect width="100%" height="100%" fill="url(#grid)" className="text-accent" />
				</svg>
			</div>
			
			{/* Waves Effect Behind Logo */}
			<div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse] opacity-20">
				<Waves
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-accent"
				/>
			</div>
			
			{/* Central Logo with Glowing Effect */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="relative">
					<div className="absolute inset-0 bg-base-100 rounded-full blur-xl animate-pulse" />
					<Logo width={96} height={96} className="relative z-20" />
				</div>
			</div>
			
			{/* Orbiting AI Icons */}
			<div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
				<Brain
					className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-8 h-8 text-accent opacity-80"
				/>
				<Network
					className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-8 h-8 text-accent opacity-80"
				/>
				<Cpu
					className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-8 h-8 text-accent opacity-80"
				/>
				<ActivitySquare
					className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-8 h-8 text-accent opacity-80"
				/>
			</div>
			
			{/* Outer Ring with Neural Network Effect */}
			<div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-[spin_12s_linear_infinite]">
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-2 h-2 bg-accent rounded-full animate-ping" />
				</div>
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 bg-accent/40 rounded-full"
						style={{
							top: '50%',
							left: '50%',
							transform: `rotate(${i * 45}deg) translateX(11rem)`
						}}
					/>
				))}
			</div>
		</div>
		
		{/* Loading Text */}
		<div className="mt-12 space-y-4 text-center">
			<h2 className="text-2xl font-semibold text-accent">
				Initializing Fox AI
			</h2>
			<div className="flex items-center justify-center gap-1">
				<Boxes className="w-5 h-5 text-accent animate-pulse" />
				<span className="text-neutral text-sm">
          Loading neural networks
        </span>
			</div>
		</div>
	</div>
);

export const HomePage: React.FC = () => {
	const navigate = useNavigate();
	// Initialize loading state based on URL parameters
	const [isLoading, setIsLoading] = useState(getInitialLoadingState());
	
	const models = MockData.slice(0, 3);
	
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const jwt = query.get('jwt');
		if (jwt) {
			try {
				const user = new User(jwt);
				localStorage.setItem('userData', JSON.stringify(user.userData));
				localStorage.setItem('projects', JSON.stringify(user.projects));
				localStorage.setItem('activeProjectId', user.activeProjectId);
				// Add a slight delay to show the animation
				setTimeout(() => {
					setIsLoading(false);
					navigate(`${user.activeProjectId}/models`);
				}, 2000);
			} catch (error) {
				console.error('Error decoding JWT:', error);
				setIsLoading(false);
			}
		}
	}, [navigate]);
	
	const handleLoginSignup = () => {
		navigate('/login');
	}
	
	if (isLoading) {
		return <LoadingScreen />;
	}
	
	
	return (
		<div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Navigation Bar */}
				<nav className="flex justify-center items-center mb-8">
					<Logo width={80} height={80}/>
				</nav>
				
				{/* Hero Section */}
				<header className="text-center mb-20">
					<div className="relative">
						{/* Enhanced background effect */}
						<div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full transform scale-150"></div>
						<div className="relative space-y-2">
							<h1 className="text-8xl font-extrabold tracking-tight mb-2">
								<span className="text-accent bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
									Fox
								</span>
							</h1>
							<h2 className="text-6xl font-bold text-base-content">
								Model Registry
							</h2>
						</div>
					</div>
					<p className="text-xl text-neutral max-w-2xl mx-auto mt-12 leading-relaxed">
						Discover, manage, and deploy machine learning models with ease.
						Fox is your centralized hub for all model-related activities.
					</p>
					<div className="flex justify-center gap-8 mt-12">
						<button
							onClick={handleLoginSignup}
							className="btn btn-accent btn-lg px-12 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
						>
							Get Started
						</button>
						<button
							onClick={() => document.getElementById('learn-more').scrollIntoView({behavior: 'smooth'})}
							className="btn btn-outline btn-lg px-12 hover:bg-base-200 transition-all duration-300 text-lg group"
						>
							Learn More
							<span className="group-hover:translate-y-1 transition-transform inline-block ml-2">↓</span>
						</button>
					</div>
				</header>
				{/*<header className="text-center mb-20">*/}
				{/*	<div className="relative">*/}
				{/*		<div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full"></div>*/}
				{/*		<h1 className="relative text-6xl font-bold mb-6">*/}
				{/*			<span className="text-accent">Fox</span>*/}
				{/*			<span className="text-base-content"> Model Registry</span>*/}
				{/*		</h1>*/}
				{/*	</div>*/}
				{/*	<p className="text-xl text-neutral max-w-2xl mx-auto mt-8">*/}
				{/*		Discover, manage, and deploy machine learning models with ease.*/}
				{/*		Fox is your centralized hub for all model-related activities.*/}
				{/*	</p>*/}
				{/*	<div className="flex justify-center gap-6 mt-12">*/}
				{/*		<button onClick={handleLoginSignup}*/}
				{/*		        className="btn btn-accent btn-lg px-8 shadow-lg hover:shadow-xl transition-all">*/}
				{/*			Get Started*/}
				{/*		</button>*/}
				{/*		<button*/}
				{/*			onClick={() => document.getElementById('learn-more').scrollIntoView({ behavior: 'smooth' })}*/}
				{/*			className="btn btn-outline btn-lg px-8 hover:bg-base-200 transition-all">*/}
				{/*			Learn More ↓*/}
				{/*		</button>*/}
				{/*	</div>*/}
				{/*</header>*/}
				
				{/* Recent Models Section */}
				<section className="mb-20">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-3xl font-bold text-base-content">Recent Models</h2>
						<button className="btn btn-ghost">View All →</button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{models.map((model, index) => (
							<TrendingCard key={index} model={model} svgArt={SVGArts[model.name.toLowerCase()]}/>
						))}
					</div>
				</section>
				
				{/* Learn More Section */}
				<section id="learn-more" className="mb-20 scroll-mt-8">
					<h2 className="text-3xl font-bold text-base-content mb-12 text-center">Why Choose Fox?</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="group bg-base-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
							<div className="mb-4">
								<div
									className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent"
									     viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd"
										      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
										      clipRule="evenodd"/>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-semibold mb-3 text-base-content">Centralized Management</h3>
							<p className="text-neutral">Manage all your models and training data in one place, from
								development to deployment. Keep track of versions, metadata, and performance
								metrics.</p>
						</div>
						
						<div className="group bg-base-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
							<div className="mb-4">
								<div
									className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent"
									     viewBox="0 0 20 20" fill="currentColor">
										<path
											d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-semibold mb-3 text-base-content">Performance Tracking</h3>
							<p className="text-neutral">Monitor and analyze model performance with the analytics
								tools of your choice. Get insights into model behavior and track improvements over time. Streamline
								workflows and improve team productivity.</p>
						</div>
						
						<div className="group bg-base-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
							<div className="mb-4">
								<div
									className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent"
									     viewBox="0 0 20 20" fill="currentColor">
										<path
											d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-semibold mb-3 text-base-content">Discovery and
								Collaboration</h3>
							<p className="text-neutral">Search and discover models across organization. Easily share
								models and collaborate with team members across projects.</p>
						</div>
					</div>
				</section>
				
				<footer className="text-center py-8 border-t border-base-300">
					<p className="text-neutral">&copy; 2024 Fox Model Registry. All rights reserved.</p>
				</footer>
			</div>
		</div>
	);
};

const TrendingCard: React.FC<{model, svgArt}> = ({model, svgArt}) => (
	<div
		className="bg-base-100 border border-base-300 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent/20 flex flex-col h-full">
		<div className="p-0 flex-grow flex flex-col">
			<h3 className="p-4 pb-0 text-lg font-semibold text-base-content">{model.name}</h3>
			<p className="py-2 px-4 text-neutral text-sm mb-2 h-full">{model.description}</p>
			<div className="w-full">
				{svgArt}
			</div>
			<div className="flex justify-between items-center mt-auto p-4 pt-1">
				<div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
					{model.tasks[0]}
				</div>
				<div className="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg"
					     className="h-4 w-4 text-yellow-400 mr-1"
					     viewBox="0 0 20 20"
					     fill="currentColor">
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
					</svg>
				</div>
			</div>
		</div>
	</div>
);

const FeatureCard = ({icon, title, description}) => (
	<div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-base-200 transition-colors duration-300">
		<div className="flex-shrink-0">
			{icon}
		</div>
		<div>
			<h3 className="text-lg font-semibold mb-2 text-base-content">{title}</h3>
			<p className="text-neutral">{description}</p>
		</div>
	</div>
);

export default HomePage;
