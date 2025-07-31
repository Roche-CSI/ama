import creative_commons from "./creative_commons.json";
import open_source from "./open_source.json";
import proprietary from "./proprietary.json";
import {TaggableCategory} from "../../../../../data_types";

const DatasetLicenseTags: TaggableCategory[] = [
	creative_commons,
	open_source,
	proprietary
]

export default DatasetLicenseTags;
