import React from 'react';
import {Logo, LogoBlue, LogoLightBlue} from "../../components/logo/Logo";
import URLs, {END_POINTS} from "../../api/Urls.ts";

const LoginCard = () => {
	const handleGoogleSignIn = async () => {
		try {
			const clientUrl = window.location.origin; // Gets the current client's URL
			const route = new URLs({endPoint: END_POINTS.LOGIN}).route();
			// remove any extra slashes
			// const loginUrl = route.replace(/([^:]\/)\/+/g, "$1");
			//`${loginUrl}?client_url=${encodeURIComponent(clientUrl)}
			const loginUrl = "http://localhost:5000/auth/web/login?client_url=" + encodeURIComponent(clientUrl);
			const response = await fetch(loginUrl);
			const data = await response.json();
			
			if (data.auth_url) {
				window.location.assign(data.auth_url);
			}
		} catch (error) {
			console.error('Login error:', error);
		}
	};
	
	return (
		<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
			<div className="px-8 pt-12 pb-8">
				{/* Logo and Branding Section */}
				<div className="text-center space-y-6 mb-10">
					<div className="relative">
						<div className="w-20 h-20 mx-auto bg-accent/5 rounded-2xl flex items-center justify-center">
							<div className="w-12">
								<Logo width={48} height={48}/>
							</div>
						</div>
					</div>
					
					<div className="space-y-2">
						<h1 className="text-4xl font-bold tracking-tight">
							<span className="text-accent">Fox</span>
							<span className="text-gray-900"> Registry</span>
						</h1>
						<div className="space-y-1">
							<p className="text-lg text-gray-600">
								Discover and manage ML models with ease
							</p>
							<p className="text-sm text-gray-500">
								Your centralized hub for all model-related activities
							</p>
						</div>
					</div>
				</div>
				
				{/* Sign In Section */}
				<div className="space-y-6">
					<button
						onClick={handleGoogleSignIn}
						className="flex items-center justify-center w-full px-4 py-3 text-white bg-accent hover:bg-accent/90 rounded-xl transition-colors duration-200 gap-3 font-medium group"
					>
						<svg
							className="w-5 h-5"
							viewBox="0 0 21 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
								fill="#ffffff"
							/>
							<path
								d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
								fill="#ffffff"
							/>
							<path
								d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
								fill="#ffffff"
							/>
							<path
								d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
								fill="#ffffff"
							/>
						</svg>
						Sign in with Google
					</button>
					
					<div className="text-center">
            <span className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
	            <a href="#" className="text-accent hover:underline">
                Terms of Service
              </a>{' '}
	            and{' '}
	            <a href="#" className="text-accent hover:underline">
                Privacy Policy
              </a>
            </span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginCard;
