import language_group from "./language_group.json";
import ModelLanguageTags from "./categories";

const LanguageGroupData = {
	...language_group,
	categories: ModelLanguageTags
}

export default LanguageGroupData;
