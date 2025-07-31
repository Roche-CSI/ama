/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionsListView } from "./ActionsListView.tsx";
import { ActionsMarketPlace } from "./ActionsMarketPlace.tsx";

interface ActionsProps {
	model: any;
	onNewAction?: () => void;
}


export const ActionsView: React.FC<ActionsProps> = ({ model, onNewAction }) => {
	const navigate = useNavigate();
	
	const handleClick = () => {
		console.log('clicked');
		navigate('new');
	};
	
	model.actions =[
		{
			"actionType": "Train",
			"description": "Initiate training of the model.",
			"timestamp": "2024-01-15T10:00:00Z"
		},
		{
			"actionType": "Evaluate",
			"description": "Evaluate the model's performance using benchmark datasets.",
			"timestamp": "2024-02-15T10:00:00Z"
		}
	]
	
	return (
		<Routes>
			<Route index element={<ActionsListView model={model}
			                                       onNewAction={handleClick} />} />
			<Route path="new" element={<ActionsMarketPlace/>} />
		</Routes>
	);
};
