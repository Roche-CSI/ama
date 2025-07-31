import environment_group from "./env_group.json";
import EnvironmentTags from "./categories";

const EnvironmentGroupData = {
	...environment_group,
	categories: EnvironmentTags
}

export default EnvironmentGroupData;
