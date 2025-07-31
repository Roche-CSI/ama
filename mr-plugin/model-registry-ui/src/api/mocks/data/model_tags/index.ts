import entity_group from './entity_group.json';
import TaskGroupData from "./tasks";
import DatasetGroupData from "./datasets";
import LibrariesGroupData from "./libraries";
import LanguageGroupData from "./languages";
import LicenseGroupData from "./licenses";

const ModelTags = {
	...entity_group,
	groups: [TaskGroupData, DatasetGroupData, LibrariesGroupData, LanguageGroupData, LicenseGroupData]
}

export default ModelTags;
