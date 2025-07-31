import { useSearch } from "./useSearch";
import { TaggableGroup } from "../api/data_types";

interface TagFilter<T,> {
	(group: TaggableGroup, data: T[]): T[];
}

export const useTaggedData = <T,>(data: T[], tagFilter: TagFilter<T>) => {
	return useSearch({data: data, filterFunction: tagFilter});
};
