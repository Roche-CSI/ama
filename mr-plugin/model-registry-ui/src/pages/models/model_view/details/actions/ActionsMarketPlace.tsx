import React, {useEffect, useState} from 'react';
import {ArrowLeft} from 'lucide-react';
import {VendorCard} from "./VendorCard.tsx";
import {ActionProviderApi} from "../../../../../api/ActionProviderApi";
import {ActionProviderInterface} from "../../../../../api/data_types/action";
import {Spinner} from "../../../../../components/spinner";


export const ActionsMarketPlace: React.FC = () => {
	const [providers, setProviders] = useState<ActionProviderInterface[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		ActionProviderApi.fetchAll().then((data) => {
			setProviders(data);
			setLoading(false);
		}).catch((error) => {
			setError(error);
			setLoading(false);
		});
	}, []);
	
	const handleBack = () => {
		window.history.back();
	};
	
	return (
		<div className="container">
			<div className="flex items-center gap-4 mb-6 w-full justify-between">
				<h1 className="text-lg">Actions Automations</h1>
				<button
					onClick={handleBack}
					className="btn btn-sm rounded-md"
				>
					<ArrowLeft className="w-5 h-5"/>
					<span>Back</span>
				</button>
			
			</div>
			
			{loading && (
				<div>
					<Spinner message={"Loading"}/>
				</div>
			)}
			
			{error && (
				<div>
					{error}
				</div>
			)}
			
			{!loading && !error && (
				<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
					{providers.map((action, index) => (
						<VendorCard
							key={index}
							vendor={action}
							disabled={index > 3}
						/>
					))}
				</div>
			)}
		</div>
	);
};
