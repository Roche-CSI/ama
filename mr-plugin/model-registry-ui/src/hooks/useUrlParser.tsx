import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to parse URLs of the format:
 * /:projectId/:resourceType/:classId?/*
 * where * represents any additional path components
 */
export const useUrlParser = () => {
	const location = useLocation();
	
	return useMemo(() => {
		// Remove leading slash and split path into segments
		const pathSegments = location.pathname
			.replace(/^\//, '')
			.split('/')
			.filter(Boolean);
		
		// Destructure the first three segments, collect the rest into extras
		const [projectId, resourceType, classId, ...extras] = pathSegments;
		
		// Parse query parameters
		const searchParams = new URLSearchParams(location.search);
		const queryParams = Object.fromEntries(searchParams.entries());
		
		// Basic validation checks
		const hasRequiredSegments = Boolean(projectId && resourceType);
		const isValidResourceType = ['models', 'datasets', 'deployments'].includes(resourceType || '');
		
		return {
			projectId: projectId || null,
			resourceType: resourceType || null,
			classId: classId || undefined, // explicitly undefined when not present
			extras: extras || [], // additional path components
			queryParams,
			// Validation helpers
			isValid: hasRequiredSegments && isValidResourceType,
			isResourceType: (type: unknown) => resourceType === type,
			// URL level indicators
			isCollectionLevel: Boolean(projectId && resourceType && !classId),
			isInstanceLevel: Boolean(projectId && resourceType && classId),
			// Original URL parts
			raw: {
				pathname: location.pathname,
				search: location.search,
				hash: location.hash
			}
		};
	}, [location]);
};

// Usage example:
/*
const MyComponent = () => {
  const {
    projectId,
    resourceType,
    classId,
    extras,
    queryParams,
    isValid,
    isResourceType
  } = useUrlParser();

  if (!isValid) {
    return <div>Invalid URL structure</div>;
  }

  return (
    <div>
      <p>Project ID: {projectId}</p>
      <p>Resource Type: {resourceType}</p>
      {classId && <p>Class ID: {classId}</p>}
      {extras.length > 0 && (
        <p>Additional path components: {extras.join('/')}</p>
      )}
      <p>Query Parameters: {JSON.stringify(queryParams)}</p>
    </div>
  );
};

// Examples:
// URL: /project-123/models
// extras = []

// URL: /project-123/models/class-456
// extras = []

// URL: /project-123/models/class-456/settings/advanced
// extras = ['settings', 'advanced']

// URL: /project-123/models/settings
// classId = 'settings'
// extras = []
*/
