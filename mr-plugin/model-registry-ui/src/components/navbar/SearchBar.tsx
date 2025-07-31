import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InstantSearch, connectSearchBox, Hits } from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: 'xyz', // Replace with your actual API key
		nodes: [
			{
				host: 'localhost',
				port: '8108',
				protocol: 'http'
			},
		],
	},
	additionalSearchParameters: {
		query_by: 'name,description,metadata'
	},
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

function debounce(func, wait) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

const CustomSearchBox = connectSearchBox(({ refine }) => {
	const [inputValue, setInputValue] = useState('');
	const [debouncedInputValue, setDebouncedInputValue] = useState('');
	const searchBoxRef = useRef(null);
	const [searchBoxHeight, setSearchBoxHeight] = useState(0);
	
	useEffect(() => {
		if (searchBoxRef.current) {
			setSearchBoxHeight(searchBoxRef.current.offsetHeight);
		}
	}, []);
	
	const debouncedSetDebouncedInputValue = useCallback(
		debounce((value) => setDebouncedInputValue(value), 300),
		[]
	);
	
	useEffect(() => {
		debouncedSetDebouncedInputValue(inputValue);
	}, [inputValue, debouncedSetDebouncedInputValue]);
	
	useEffect(() => {
		if (debouncedInputValue) {
			refine(debouncedInputValue);
		}
	}, [debouncedInputValue, refine]);
	
	const handleInputChange = (event) => {
		setInputValue(event.currentTarget.value);
	};
	
	return (
		<div className="form-control flex-1 relative" ref={searchBoxRef}>
			<label className="input input-bordered flex items-center gap-2 max-w-96">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
					<path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd"/>
				</svg>
				<input
					type="search"
					value={inputValue}
					onChange={handleInputChange}
					className="grow"
					placeholder="Models, Datasets, Deployments, Docs..."
				/>
			</label>
			{debouncedInputValue.length > 0 && (
				<div
					className="absolute w-full max-w-96 bg-base-100 shadow-lg rounded-box z-50"
					style={{ top: `${searchBoxHeight}px` }}
				>
					<Hits hitComponent={Hit} />
				</div>
			)}
		</div>
	);
});

const Hit = ({ hit }) => (
	<div className="p-2 hover:bg-base-200">
		<h3 className="font-bold">{hit.name}</h3>
		<p className="text-sm">{hit.description}</p>
	</div>
);

const SearchBar = () => {
	return (
		<InstantSearch searchClient={searchClient} indexName="models">
			<CustomSearchBox />
		</InstantSearch>
	);
};

export default SearchBar;
