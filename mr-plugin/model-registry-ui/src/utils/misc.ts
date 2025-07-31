/**
 * Removes empty strings, null, and undefined values from various data structures.
 * - For objects: Removes properties with empty/null/undefined values
 * - For arrays: Removes empty/null/undefined elements
 * - For nested structures: Recursively cleans all levels
 */

// Type guard to check if value is a plain object
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object'
		&& value !== null
		&& !Array.isArray(value)
		&& Object.prototype.toString.call(value) === '[object Object]';
};

// Type guard for empty values
const isEmpty = (value: unknown): boolean => {
	return value === null
		|| value === undefined
		|| value === ''
		|| (Array.isArray(value) && value.length === 0)
		|| (isPlainObject(value) && Object.keys(value).length === 0);
};

export function cleanValues<T>(input: T): T {
	// Handle null/undefined input
	if (input === null || input === undefined) {
		return input;
	}
	
	// Handle arrays
	if (Array.isArray(input)) {
		return input
			.filter(item => !isEmpty(item))
			.map(item => cleanValues(item)) as T;
	}
	
	// Handle objects
	if (isPlainObject(input)) {
		const result: Record<string, unknown> = {};
		
		for (const [key, value] of Object.entries(input)) {
			if (!isEmpty(value)) {
				result[key] = isPlainObject(value) || Array.isArray(value)
					? cleanValues(value)
					: value;
			}
		}
		
		return result as T;
	}
	
	// Return primitive values as is
	return input;
}
