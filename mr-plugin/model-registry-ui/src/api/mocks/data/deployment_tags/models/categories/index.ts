import creative_commons from "./experimental.json";
import open_source from "./open_source.json";
import proprietary from "./released.json";
import {TaggableCategory} from "../../../../../data_types";

const DeployedModelTags: TaggableCategory[] = [
	creative_commons,
	open_source,
	proprietary
]

export default DeployedModelTags;
