// ExperimentTracking.js
import React from 'react';
import {ExperimentsList} from "./ExperimentsList.tsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import {ExperimentMarketPlace} from "./ExperimentMarketPlace.tsx";

export const Experiments = ({ model }) => {
	const navigate = useNavigate();
	
	const handleClick = () => {
		console.log('clicked');
		navigate('new');
	};
	
	return (
		<div className="">
			<Routes>
				<Route path="new" element={<ExperimentMarketPlace/>} />
				<Route path="/*" element={<ExperimentsList model={model} onNewButtonClicked={handleClick} />} />
			</Routes>
		</div>
	);
};

