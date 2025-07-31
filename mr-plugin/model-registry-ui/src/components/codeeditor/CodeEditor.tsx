import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./editor.css";

interface Props {
	language: string;
	value: unknown;
	onChange?: (arg: string) => void;
	readonly?: boolean;
	height?: number;
	className?: string;
	setLineNumber?: () => boolean;
	lineNumbers?: boolean;
	minimap?: boolean;
}

const defaultHeight = 600;
const lineHeight = 19;
const minHeight = 190; // 10 lines

export const CodeEditor: React.FC<Props> = (props: Props) => {
	const [editorHeight, setEditorHeight] = useState<number>(defaultHeight);
	const [formattedValue, setFormattedValue] = useState<string>('');
	
	const prettifyJSON = (value: unknown): string => {
		if (props.language === 'json') {
			try {
				// Handle string or object input
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;
				return JSON.stringify(parsed, null, 2);
			} catch (e) {
				console.warn('Failed to parse JSON:', e);
				return value as string;
			}
		}
		return value as string;
	};
	
	const calculateHeight = (content: string) => {
		const lineCount = (content?.match(/\n/g)?.length || 0) + 1;
		const calculatedHeight = Math.max(minHeight, lineCount * lineHeight);
		const viewportHeight = window.innerHeight;
		const maxHeight = viewportHeight * 0.8;
		return Math.min(calculatedHeight, maxHeight);
	};
	
	useEffect(() => {
		const prettyValue = prettifyJSON(props.value);
		setFormattedValue(prettyValue);
		
		if (prettyValue) {
			const newHeight = calculateHeight(prettyValue);
			setEditorHeight(newHeight);
		}
	}, [props.value]);
	
	const onChange = (value: string | undefined, monaco: any) => {
		if (value) {
			const newHeight = calculateHeight(value);
			setEditorHeight(newHeight);
		}
		props.onChange && props.onChange(value || '');
	};
	
	function handleHTMLEditorDidMount(editor: any, monaco: any) {
		props.setLineNumber && props.setLineNumber(editor.getModel().getLineCount());
		
		const prettyValue = prettifyJSON(props.value);
		if (prettyValue) {
			const newHeight = calculateHeight(prettyValue);
			setEditorHeight(newHeight);
		}
	}
	
	return (
		<Editor
			className={props.className || ""}
			height={`${props.height || editorHeight}px`}
			language={props.language}
			theme={"xcode_default"}
			onMount={handleHTMLEditorDidMount}
			value={formattedValue}
			onChange={onChange}
			options={{
				minimap: {
					enabled: typeof props.minimap !== 'undefined' ? props.minimap : false
				},
				lineNumbers: (typeof props.lineNumbers !== 'undefined' && !props.lineNumbers) ? "off" : "on",
				selectOnLineNumbers: true,
				readOnly: Boolean(props.readonly),
				scrollbar: {},
				colors: {
					'editor.lineHighlightBackground': '#00000000',
					'editor.lineHighlightBorder': '#00000000'
				},
				wordWrap: 'on',
				overviewRulerLanes: 0,
				formatOnPaste: true,  // Enable format on paste
				formatOnType: true,   // Enable format as you type
			}}
		/>
	);
};
