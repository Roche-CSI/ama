import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
	return (
		<div className="min-h-screen">
			<Outlet />
		</div>
	);
};

import { NavBar } from "../components/navbar";

export const ProtectedLayout = () => {
	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center shadow shadow-[#64748b20]">
				<div className="container">
					<NavBar />
				</div>
			</div>
			<Outlet />
		</div>
	);
};


