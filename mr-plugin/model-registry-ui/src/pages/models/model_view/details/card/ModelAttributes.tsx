/* eslint-disable no-mixed-spaces-and-tabs */
import React, {useMemo, useState} from "react";
import Taggable from "../../../../search/taggable.ts";
import {GenericTagList} from "../../../../search/GenericTagList.tsx";
import {ClipboardList, Database, Languages, Shield} from "lucide-react";

const GROUPS = [
	{name: 'tasks', label: 'Tasks', icon: ClipboardList},  // Better represents a task list
	{name: 'datasets', label: 'Datasets', icon: Database}, // More appropriate for data collections
	{name: 'licenses', label: 'Licenses', icon: Shield},   // Common icon for licensing/protection
	{name: 'languages', label: 'Languages', icon: Languages}, // Specific icon for languages
];

export const ModelAttributes = ({asset}) => {
	
	const [activeGroupName, setActiveGroupName] = useState<string>("tasks");
	const [selectedGroup, setSelectedGroup] = useState(null);
	
	// remover null from tasks, datasets, languages, licenses
	const tasks = asset.attributes?.tasks || [];
	const datasets = asset.attributes?.training_data?.dataset ? [asset.attributes?.training_data?.dataset] : [];
	const languages = asset.attributes?.language ? [asset.attributes?.language] : [];
	const licenses = asset.attributes?.license ? [asset.attributes?.license] : [];
	
	console.log("tasks: ", tasks, " datasets: ", datasets, " languages: ", languages, " licenses: ", licenses);
	
	const tagGroups = useMemo(() => ({
		"tasks": Taggable.defaultTagGroup({
			name: 'tasks',
			label: 'Tasks',
			category: Taggable.defaultTagCategory({
				name: 'tasks',
				tags: tasks
			})
		}),
		"datasets": Taggable.defaultTagGroup({
			name: 'datasets',
			label: 'Datasets',
			category: Taggable.defaultTagCategory({
				name: 'datasets',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: datasets,
			}),
		}),
		"languages": Taggable.defaultTagGroup({
			name: 'languages',
			label: 'Languages',
			category: Taggable.defaultTagCategory({
				name: 'languages',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: languages,
			}),
		}),
		"licenses": Taggable.defaultTagGroup({
			name: 'licenses',
			label: 'Licenses',
			category: Taggable.defaultTagCategory({
				name: 'licenses',
				// class_type and project_id ar filters passsed so we need to exclude them from highlights
				tags: licenses,
			}),
		}),
	}), []);
	
	const tagView = () => {
		// doing a hack here to make sure tagGroups are updated with selection data, for some reason the tagGroups are not updated
		// works fine in the SearchResultsPage.tsx
		// todo: fix this
		if (selectedGroup) {
			tagGroups[selectedGroup.name] = selectedGroup;
		}
		const groupData = tagGroups[activeGroupName];
		// console.log("groupData: ", groupData);
		return (
			<GenericTagList groups={GROUPS}
			                activeGroupName={activeGroupName}
			                groupData={groupData}
			                onSelectedGroupChange={setActiveGroupName}
			                readonly={true}/>
		)
	}
	
	if (!asset.attributes) {
		return <div className="w-full">No attributes found</div>;
	}
	
	return (
		<div className="w-full">
			{tagView()}
		</div>
	);
	
}
