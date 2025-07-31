import license_group from "./model_group.json";
import DeployedModelTags from "./categories";

const ModelGroupData = {
	...license_group,
	categories: DeployedModelTags
}

export default ModelGroupData;
