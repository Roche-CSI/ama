/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {Logo, LogoBlue, LogoLightBlue} from "../../components/logo/Logo";
import LoginCard from "./LoginCard";

const AIDecoration: React.FC = () => (
	<svg
		className={`h-full w-full`}
		viewBox="0 0 100 400"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stopColor={LogoLightBlue} stopOpacity="0.2"/>
				<stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1"/>
			</linearGradient>
		</defs>
		
		{/* Abstract network representation */}
		<g stroke={`${LogoLightBlue}`} strokeWidth="0.5" fill="none">
			<circle cx="50" cy="50" r="20"/>
			<circle cx="20" cy="100" r="15"/>
			<circle cx="80" cy="130" r="25"/>
			<circle cx="40" cy="180" r="18"/>
			<circle cx="70" cy="220" r="22"/>
			<line x1="50" y1="70" x2="20" y2="85"/>
			<line x1="50" y1="70" x2="80" y2="105"/>
			<line x1="20" y1="115" x2="40" y2="162"/>
			<line x1="80" y1="155" x2="40" y2="162"/>
			<line x1="40" y1="198" x2="70" y2="198"/>
		</g>
		
		{/* Binary code representation */}
		<text fill={LogoBlue} fontSize="8" opacity="0.5">
			<tspan x="10" y="280">01001010</tspan>
			<tspan x="70" y="300">11010101</tspan>
			<tspan x="30" y="320">10110011</tspan>
			<tspan x="50" y="340">01101001</tspan>
		</text>
		
		{/* Abstract shapes */}
		<rect x="10" y="370" width="80" height="20" fill="url(#grad1)" rx="5"/>
		<circle cx="50" cy="250" r="30" fill="url(#grad1)"/>
	</svg>
);

// const LoginCard: React.FC = () => {
//
// 	const handleGoogleSignIn = () => {
// 		// TODO: Implement Google Sign-In logic
// 		console.log('Google Sign-In clicked');
// 	};
//
// 	return (
// 		<div className="bg-white shadow-lg rounded-lg overflow-hidden">
// 			<header className="text-center mb-8 pt-8">
// 				<div className="mb-4">
// 					{/* Placeholder for logo */}
// 					<div className="w-16 h-16 mx-auto flex items-center justify-center">
// 						<a className="w-10" href={"/"}>
// 							<Logo width={50} height={50}/>
// 						</a>
// 					</div>
// 				</div>
// 				<h1 className="text-4xl font-bold mb-4">
// 					<span className="mr-2 text-accent">Fox</span>
// 					<span className="text-base-content">Model Registry</span>
// 				</h1>
// 				<div className="flex flex-col items-center">
// 					<p className="text-xl text-neutral mb-2 w-max">
// 						Discover, manage, and deploy machine learning models with ease.
// 					</p>
// 					<p className="text-xl text-neutral max-w-[24ch] leading-tight">
// 						Fox is your centralized hub for all model-related activities.
// 					</p>
// 				</div>
// 			</header>
//
// 			<div className="py-8 px-4 sm:px-10">
// 				<button
// 					onClick={handleGoogleSignIn}
// 					className="btn btn-accent rounded-md w-full cursor-pointer">
// 					<svg className="w-5 h-5 mr-2"
// 					     viewBox="0 0 21 20"
// 					     fill="none"
// 					     xmlns="http://www.w3.org/2000/svg">
// 						<path
// 							d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
// 							fill="#4285F4"/>
// 						<path
// 							d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
// 							fill="#34A853"/>
// 						<path
// 							d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
// 							fill="#FBBC04"/>
// 						<path
// 							d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
// 							fill="#EA4335"/>
// 					</svg>
// 					Sign in with Google
// 				</button>
// 			</div>
// 		</div>
// 	)
// }

export const LoginSignupPage: React.FC = () => {
	return (
		<div className="w-full flex items-center justify-center bg-gray-50">
			<div className="flex w-full max-w-7xl mx-auto">
				<div className="hidden lg:flex lg:w-1/4 items-center">
					<AIDecoration/>
				</div>
				<div className="w-full lg:w-1/2 px-4 py-8 pt-36">
					<LoginCard/>
				</div>
				<div className="hidden lg:flex lg:w-1/4 items-center">
					<AIDecoration/>
				</div>
			</div>
		</div>
	);
};
