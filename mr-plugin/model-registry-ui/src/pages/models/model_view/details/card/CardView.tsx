import React, { useEffect, useState } from 'react';
import { stringToDate } from "../../../../../utils/date_utils";
import { AssetDetailApi } from "../../../../../api/AssetDetailApi";
import {MarkdownRenderer} from "./MarkDownRenderer.tsx";
import {ModelAttributes} from "./ModelAttributes.tsx";
import {AssetInterface} from "../../../../../api/data_types/assetInterface.ts";

// Moved unused imports and constants to bottom for reference
/*
import { useLocation } from 'react-router-dom';
import { ModelApi, useData } from "../../../../../api";
import { ModelInterface, TaggableGroup } from "../../../../../api/data_types";
import { ModelMetaSection } from "./ModelMetaSection";

const GROUPS = ['tasks', 'datasets', 'libraries', 'languages', 'licenses', 'others'];
const versions = [
    { id: 'v1.0', name: 'v1.0' },
    { id: 'v1.1', name: 'v1.1' },
    { id: 'v2.0', name: 'v2.0' },
    { id: 'experimental-1', name: 'Experimental 1' },
    { id: 'experimental-2', name: 'Experimental 2' }
];
*/

export const CardView: React.FC<{asset: AssetInterface}> = ({asset}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [card, setCard] = useState<AssetInterface['details']['card'] | null>(
		asset?.details?.card || null
	);
	
	useEffect(() => {
		const fetchCardDetails = async () => {
			if (!asset.details?.card) {
				setLoading(true);
				try {
					const res = await AssetDetailApi.fetchById(asset.id);
					setCard(res.card);
				} catch (err) {
					setError(err instanceof Error ? err : new Error('Failed to fetch card details'));
				} finally {
					setLoading(false);
				}
			}
		};
		fetchCardDetails();
	}, [asset?.id, asset?.details?.card]); // Fixed dependency array
	
	// const renderTagView = () => {
	// 	return <p>No tags available.</p>;
	// };
	
	const renderModelDetails = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center h-full">
					<p className="text-gray-500 text-lg">Loading model data...</p>
				</div>
			);
		}
		
		if (error) {
			return (
				<div className="flex justify-center items-center h-full">
					<p className="text-red-500 text-lg">Error loading model data: {error.message}</p>
				</div>
			);
		}
		
		if (card) {
			return (
				<div className="bg-white p-6 space-y-6 border border-base-300 rounded-lg">
					{/*<div className="border-b pb-4 mb-4">*/}
					{/*	<h2 className="text-2xl font-bold text-gray-700 flex items-center">*/}
					{/*		<span className="mr-2">📋</span> Model Card: {asset.title}*/}
					{/*	</h2>*/}
					{/*	<p className="text-gray-500 text-sm">*/}
					{/*		Created: {stringToDate(asset.created_at).toLocaleDateString()}*/}
					{/*		{' | Last Updated: '}{stringToDate(asset.modified_at).toLocaleDateString()}*/}
					{/*	</p>*/}
					{/*</div>*/}
					
					<MarkdownRenderer>
						{card}
					</MarkdownRenderer>
				</div>
			);
		}
		
		return (
			<div className="flex justify-center items-center h-full">
				<p className="text-gray-400 italic">Model data not found.</p>
			</div>
		);
	};
	
	return (
		<div className="relative">
			<div className="flex">
				<div className="left basis-3/4 gap-2 self-start mr-2 text-sm leading-6 model-card">
					{renderModelDetails()}
				</div>
				<div className="right basis-1/4 pl-4">
					<ModelAttributes asset={asset}/>
				</div>
			</div>
		</div>
	);
};
