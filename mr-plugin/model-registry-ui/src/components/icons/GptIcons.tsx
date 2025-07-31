/* eslint-disable no-mixed-spaces-and-tabs */

import React from "react";

export const CpuIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M7 10h.01M17 10h.01M10 7v.01M10 17v.01M12 12v.01M5 5h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>
	</svg>
)

export const MemoryIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M5 3v18m14-18v18M5 3h14M5 21h14m-6-6h4M9 15h4m-4-6h4M5 9h14"/>
	</svg>
);

export const GpuIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M4 7h16v10H4V7zM4 4h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/>
	</svg>
);

export const ModelCardIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M3 6h18M3 12h18M3 18h18M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
	</svg>
);

export const FilesIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M9 12h6m-6 4h6m-6-8h6M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
	</svg>
);

export const LineageIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M12 4v16m-4-4h8m-4-4h4m-8-4h4m-8 0h4m0 8H4m8 4v-4m0 0H4M16 4v4m0 8v-4"/>
	</svg>
);

export const ActionsIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
		<path strokeLinecap="round" strokeLinejoin="round"
		      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"/>
	</svg>
);


export const ExperimentIcon = ({className}: { className: string }) => (
	<ThreeBarsIcon className={className}/>
);


export const ThreeBarsIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
	</svg>
);


export const GovernanceIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M12 7V3m0 0v4m0-4h4m-4 0H8m4 6h4m-4 0h-4m0 4h4m-4 0H8m-2 4h12M6 4v4m12-4v4"/>
	</svg>
);

export const DiscussionsIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
	</svg>
);


export const MonitoringIcon = ({className}: { className: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M3 4h4v16H3V4zm6 8h4v8h-4v-8zm6-4h4v12h-4V8z"/>
	</svg>
);

export const VersionIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path d="M4 8h16v2H4zm0 4h16v2H4zm0 4h16v2H4z"/>
	</svg>
);

export const ReleaseIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v8H8V8zm4 6h2v2h-2v-2zm0-4h2v2h-2V10z"/>
	</svg>
);

export const ModelTrainingIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 20v-6M6 20v-12M18 20v-9"></path>
	</svg>
);

export const SummaryDataIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"></path>
		<path d="M16 2v6h6"></path>
		<path d="M8 13h8"></path>
		<path d="M8 17h8"></path>
	</svg>
);

export const ArtifactsIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 2L2 7l10 5 10-5L12 2z"></path>
		<path d="M2 17l10 5 10-5"></path>
		<path d="M2 12l10 5 10-5"></path>
	</svg>
);

export const MetadataIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
		<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
		<line x1="12" y1="22.08" x2="12" y2="12" />
		<circle cx="12" cy="12" r="4" />
		<path d="M12 8v4" />
		<path d="M12 16h4" />
	</svg>
);


export const ValidationChartsIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M9 11l3 3L22 4"></path>
		<path d="M21 15V8a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2z"></path>
	</svg>
);

export const SystemInfoIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
		<rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
		<line x1="6" y1="6" x2="6" y2="6"></line>
		<line x1="6" y1="18" x2="6" y2="18"></line>
	</svg>
);

// icons.tsx

export const PerformanceIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 18l6-6-6-6-6 6 6 6z"/>
		<path d="M12 6v12"/>
	</svg>
);

export const HealthIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path
			d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
	</svg>
);

export const LogsAndAlertsIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 8v4m0 4h.01"/>
		<path d="M22 15V9a10 10 0 00-20 0v6a10 10 0 0010 10 10 10 0 0010-10z"/>
	</svg>
);

export const DriftDetectionIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M3 17l5-5 4 4 7-7 5 5"/>
		<path d="M21 21H3a1 1 0 01-1-1v-7a1 1 0 011-1h18a1 1 0 011 1v7a1 1 0 01-1 1z"/>
	</svg>
);

export const AlertsIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path
			d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
	</svg>
);


export const ExternalLinkIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M17 10l2-2m0 0l-2-2m2 2H7a4 4 0 00-4 4v6a4 4 0 004 4h6"/>
		<path d="M7 14l10-10m-1 0h6v6"/>
	</svg>
);


export const YAMLFileIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-4l4 4 4-4"/>
	</svg>
);

export const JSONFileIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h10M7 15h10M7 19h10"/>
	</svg>
);

export const CodeFileIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
	</svg>
);

export const LogFileIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm3 3h12v12H6V6z"/>
	</svg>
);

export const TextFileIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
	</svg>
);

// export const FileIcon = ({ className }: { className?: string }) => (
// 	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
// 		<path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4z" />
// 	</svg>
// );
//
export const FileIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
	>
		<path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
	</svg>
);

export const BranchIcon = ({className}: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor">
		<path
			d="M6 3v12M6 3a3 3 0 100 6 3 3 0 000-6zM6 15a3 3 0 100 6 3 3 0 000-6zM18 3v6a3 3 0 01-3 3H6"/>
	</svg>
);

export const DockerIcon = ({className}: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg"
	     fill="none"
	     viewBox="0 0 24 24"
	     strokeWidth={2}
	     stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M3 3h18v18H3V3zm3 3h12v12H6V6z"/>
	</svg>
);
