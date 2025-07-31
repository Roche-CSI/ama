/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {CreateDatasetRepoForm} from './CreateDatasetRepoForm.tsx';
import {CodeBlock} from "react-code-blocks";
import {
	ArtifactsIcon,
	ExperimentIcon,
	ThreeBarsIcon
} from "../../components/icons";

const CLI_COMMAND: string = `# Command Line Instructions
cd <path-to-directory>
fox project activate <project-name>
fox dataset init -c <collection-name>
fox add <files>
fox alias add <dataset-name>
fox upload`;

const PYTHON_COMMAND: string = `from fox import dataset
dataset.init(<"collection-name">, <"path-to-directory">)
dataset.add(<"*">)
dataset.commit(<"my-model-v1">)
dataset.tags.add(<"experiment-v1.0.0">)
dataset.upload()`;

const CodeIcon = ({className}: { className: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg"
	     fill="none"
	     viewBox="0 0 24 24"
	     strokeWidth={1.5} stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>
	</svg>
);

const TerminalIcon = ({className}: { className: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg"
	     fill="none" viewBox="0 0 24 24"
	     strokeWidth={1.5}
	     stroke="currentColor"
	     className={className}>
		<path strokeLinecap="round"
		      strokeLinejoin="round"
		      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
	</svg>
);

export const CreateDatasetPage: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
				<ArtifactsIcon className="size-5 mr-1"/>
				<span className="ml-2">Create A New Dataset Collection</span>
			</h1>
			<div className="flex flex-col lg:flex-row">
				{/* Left Side: Form */}
				<div className="lg:w-3/5 pr-0 lg:pr-6 mb-6 lg:mb-0 flex flex-col">
					<div className="bg-white border border-base-200 rounded-md flex-grow">
						<div className="px-4 py-3 border-b border-base-200">
							<h2 className="text-lg font-medium text-neutral flex items-center">
								<ThreeBarsIcon className="size-5"/>
								<span className="ml-2">Dataset Details</span>
							</h2>
						</div>
						<div className="p-4">
							<CreateDatasetRepoForm/>
						</div>
					</div>
				</div>
				
				{/* Right Side: Code Snippets */}
				<div className="lg:w-2/5 lg:pl-6 flex flex-col">
					<div className="bg-white border border-gray-200 rounded-md flex-grow">
						<div className="px-4 py-3 border-b border-gray-200">
							<h2 className="text-lg font-medium text-neutral flex items-center">
								<ThreeBarsIcon className="size-5"/>
								<span className="ml-2">Quick Start Guide</span>
							</h2>
						</div>
						<div className="p-4">
							<div className="mb-6">
								<h3 className="text-md font-medium text-neutral-500 mb-2 flex items-center">
									<TerminalIcon className="size-5"/>
									<span className="ml-2">Using Fox CLI</span>
								</h3>
								<div className="bg-gray-50 rounded-md border border-base-200 py-2 text-xs">
									<CodeBlock
										text={CLI_COMMAND}
										language="bash"
										showLineNumbers={false}/>
								</div>
							</div>
							
							<div>
								<h3 className="text-md font-medium text-neutral-500 mb-2 flex items-center">
									<CodeIcon className="size-5"/>
									<span className="ml-2">Using Fox Python API</span>
								</h3>
								<div className="bg-gray-50 rounded-md border border-base-200 py-2 text-xs">
									<CodeBlock
										text={PYTHON_COMMAND}
										language="python"
										showLineNumbers={false}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
