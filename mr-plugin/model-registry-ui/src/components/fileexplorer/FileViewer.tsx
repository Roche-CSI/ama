/* eslint-disable no-mixed-spaces-and-tabs */
import {CodeEditor} from "../codeeditor/CodeEditor.tsx";

interface FileViewerProps {
	text: string;
	language: string;
	height?: number;
}


export const FileViewer = ({text, language, height}: FileViewerProps) => {
	return (
		<CodeEditor value={text}
		            language={language}
		            height={height}
		            className="border border-[#64748b40] py-4 rounded-md"/>
	)
}
