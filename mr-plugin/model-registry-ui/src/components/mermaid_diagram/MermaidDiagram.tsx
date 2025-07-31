import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
	definition: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition }) => {
	const diagramRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		mermaid.initialize({
			startOnLoad: true,
			theme: 'default',
			securityLevel: 'loose',
		});
		
		const renderDiagram = async () => {
			if (diagramRef.current) {
				diagramRef.current.innerHTML = '';
				try {
					const { svg } = await mermaid.render('mermaid-diagram', definition);
					diagramRef.current.innerHTML = svg;
				} catch (error) {
					console.error('Error rendering Mermaid diagram:', error);
					diagramRef.current.innerHTML = 'Error rendering diagram';
				}
			}
		};
		
		renderDiagram();
	}, [definition]);
	
	return <div ref={diagramRef} className="mermaid-diagram" />;
};
