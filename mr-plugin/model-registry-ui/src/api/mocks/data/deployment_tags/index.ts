import entity_group from './entity_group.json';
import EnvironmentGroupData from "./env";
import ModelGroupData from "./models";
import TaskGroupData from "./tasks";

const DeploymentTags = {
	...entity_group,
	groups: [ModelGroupData, TaskGroupData, EnvironmentGroupData]
}

export default DeploymentTags;
