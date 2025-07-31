import entity_group from './entity_group.json';
import MainGroupData from "./main";
import LibrariesGroupData from "./libraries";
import LanguageGroupData from "./languages";
import LicenseGroupData from "./licenses";

const DatasetTags = {
	...entity_group,
	groups: [MainGroupData, LibrariesGroupData, LanguageGroupData, LicenseGroupData]
}

export default DatasetTags;
