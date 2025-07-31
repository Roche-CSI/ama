import { useSearch } from "./useSearch";

interface StringFilter<T> {
	(value: string, data: T[]): T[];
}

export const useFilteredData = <T, >(data: T[], filter: StringFilter<T>) => {
	return useSearch({
		data: data || [],
		filterFunction: filter,
	});
};
