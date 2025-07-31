import aws from './aws.json';
import gcp from './gcp.json';
import {TaggableCategory} from "../../../../../data_types";

const EnvironmentTags: TaggableCategory[] = [
	aws,
	gcp
]

export default EnvironmentTags;
