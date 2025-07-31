import language_group from "./language_group.json";
import DatasetLanguageTags from "./categories";

const LanguageGroupData = {
	...language_group,
	categories: DatasetLanguageTags
}

export default LanguageGroupData;
