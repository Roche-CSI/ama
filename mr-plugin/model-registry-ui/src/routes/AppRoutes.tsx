import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from "../contexts/userContext/UserProvider.tsx";
import { ProjectProvider } from "../contexts/projectContext";
import ProtectedRoutes from './ProtectedRoutes';
import {PublicLayout, ProtectedLayout } from './Layouts';
import { LoginSignupPage } from "../pages/login";
import { HomePage } from "../pages/home";
import { Page404 } from "../pages/404";

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route element={<PublicLayout />}>
				<Route path="/login" element={<LoginSignupPage />} />
				<Route path="/" element={<HomePage />} />
			</Route>
			
			{/* Protected Routes */}
			<Route
				element={
					<UserProvider>
						<ProjectProvider>
							<ProtectedLayout />
						</ProjectProvider>
					</UserProvider>
				}>
				<Route path="/*" element={<ProtectedRoutes />} />
			</Route>
			
			{/* 404 page outside of both layouts */}
			<Route path="*" element={<Page404 />} />
		</Routes>
	);
};

export default AppRoutes;
