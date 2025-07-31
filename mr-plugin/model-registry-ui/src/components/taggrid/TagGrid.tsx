/* eslint-disable no-mixed-spaces-and-tabs */
import React, {ChangeEvent, useState} from 'react';
import {ResetIcon, XIcon} from "../icons";
import {TaggableCategory, Tag} from "../../api/data_types";
import {useSearch} from "../../hooks";


interface TagGridProps {
	groupName: string;
	data: TaggableCategory[];
	onSelectedTagsChange?: (categories: TaggableCategory[]) => void;
}

interface Category extends TaggableCategory {
	filtered?: Tag[];
	selected?: Record<string, Tag>;
}

export const TagGrid = ({
	                        groupName,
	                        data,
	                        onSelectedTagsChange,
                        }: TagGridProps) => {
	
	const [selectedCategories, setSelectedCategories] = useState<Record<string, Category>>({});
	
	const handleTagSelection = (category: Category) => {
		// Add or update category with selected tags
		const updatedCategories: Record<string, Category> = {...selectedCategories};
		updatedCategories[category.id] = category;
		
		// filter all categories that have selected tags
		const filteredData = Object.values(updatedCategories).filter(category => {
			return category.selected && Object.keys(category.selected).length > 0;
		});
		onSelectedTagsChange && onSelectedTagsChange(filteredData);
		setSelectedCategories(updatedCategories);
	};
	
	const {items, handleSearch, resetSearch} = useSearch<TaggableCategory,string>({
		data: data || [],
		filterFunction: filterTags,
	});
	
	const handleReset = () => {
		const updatedCategories: Record<string, Category> = {...selectedCategories};
		Object.values(updatedCategories).forEach(category => {
			category.selected = {};
		});
		resetSearch();
		setSelectedCategories(updatedCategories);
		onSelectedTagsChange && onSelectedTagsChange([]);
	}
	
	return (
		<React.Fragment>
			<TagFilterBar placeholder={`Filter ${groupName.toLowerCase()} by name`}
			              handleSearch={handleSearch}
			              resetSearch={handleReset}/>
			{items.map((category: TaggableCategory, index: number) => (
				<CategoryCard
					key={index}
					category={category}
					onTagSelectedChange={handleTagSelection}
				/>
			))}
		</React.Fragment>
	);
};


// Define the props interface
interface TagCardProps {
	category: Category;
	onTagSelectedChange?: (category: Category) => void;
}

// Define the TagCard component
const CategoryCard: React.FC<TagCardProps> = ({category, onTagSelectedChange}) => {
	// Initialize the state with a dictionary where each tag is set to false
	
	// Handle tag click to add or remove tag from selected tags
	const handleTagClick = (tag: Tag) => {
		if (!category.selected) {
			category.selected = {};
		}
		if (tag.name in category.selected) {
			delete category.selected[tag.id];
		} else {
			category.selected[tag.id] = tag;
		}
		// Notify parent component about the change
		onTagSelectedChange && onTagSelectedChange(category);
	}
	
	const tags = category.filtered || category.tags;
	
	return (
		<React.Fragment>
			<h5 className="font-medium text-neutral-400 mt-4 mb-2 text-xs">
				{category.name}
			</h5>
			<div className="gap-x-8 gap-y-4 space-y-2">
				{
					tags.map((tag, index) => {
						const selected = category.selected ? tag.id in category.selected : false;
						return (
							<button
								key={index}
								className={`btn btn-xs rounded-md mr-1 font-medium ${selected ? 'bg-secondary text-base-100 hover:bg-primary' : 'text-base-content hover:bg-base-300'}`}
								onClick={() => handleTagClick(tag)}
							>
								<span>{tag.name}</span>
								{/*{selected && <XIcon className="h-4 w-4"/>}*/}
							</button>
						);
					})}
			</div>
		</React.Fragment>
	);
};

// interface for TagFilterBar
interface TagFilterBarProps {
	placeholder: string;
	handleSearch: (search: string) => void;
	resetSearch?: () => void;
}

const TagFilterBar = ({ placeholder, handleSearch, resetSearch }: TagFilterBarProps) => {
	const [inputValue, setInputValue] = useState('');
	
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		handleSearch(value);
	};
	
	const handleReset = () => {
		setInputValue('');
		if (resetSearch) resetSearch();
		handleSearch(''); // Clear the search results as well
	};
	
	return (
		<div className="flex gap-1 mt-4">
		<div className="flex gap-1 mt-4">
			<label className=" input input-bordered flex items-center gap-2 h-8 grow flex-1 px-2 w-9/12">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="h-4 w-4 opacity-70">
					<path
						fillRule="evenodd"
						d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
						clipRule="evenodd" />
				</svg>
				<input type="text" className="grow" placeholder={placeholder} value={inputValue}
				onChange={handleInputChange}/>
			</label>
			{
				inputValue &&
				<button className="btn btn-square btn-ghost btn-sm"
					onClick={handleReset}>
					<ResetIcon className={"size-6"} />
				</button>
			}
		</div></div>
	);
};

// Function to filter models based on user input

const filterTags = (query: string, data: Category[]): Category[] => {
	// Convert the query to lowercase for case-insensitive matching
	const lowerQuery = query.toLowerCase();
	
	// Filtered categories
	const filteredData: Category[] = [];
	
	data.forEach((category: Category) => {
		// Filter tags based on query
		const filteredTags = category.tags.filter(tag =>
			tag.name.toLowerCase().includes(lowerQuery)
		);
		
		// Update the category with filtered tags if any
		if (filteredTags.length > 0) {
			filteredData.push({
				...category,
				filtered: filteredTags
			});
		}
	});
	
	return filteredData;
};

