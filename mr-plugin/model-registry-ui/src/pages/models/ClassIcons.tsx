import {
	Container,
	Layers,
	Menu,
	SquareCode,
	Waypoints,
	Images,
	SquareGanttChart,
	NotepadText,
	Network, BookText
} from "lucide-react";

export const CLASS_TYPE = {
	OTHERS: "others",
	GENERAL: "general",
	MODELS: "models",
	DOCKER: "docker",
	CONFIGURATION: "configuration",
	IMAGES: "images",
	REPORTS: "reports",
	PIPELINES: "pipelines",
	EXPERIMENTAL: "experimental",
	DATASETS: "datasets",
	NONE: ""
}


export const CLASS_ICONS = {
	[CLASS_TYPE.GENERAL]: Menu,
	[CLASS_TYPE.DATASETS]: Layers,
	[CLASS_TYPE.MODELS]: Waypoints,
	[CLASS_TYPE.DOCKER]: Container,
	[CLASS_TYPE.CONFIGURATION]: SquareCode,
	[CLASS_TYPE.IMAGES]: Images,
	[CLASS_TYPE.REPORTS]: SquareGanttChart,
	[CLASS_TYPE.EXPERIMENTAL]: NotepadText,
	[CLASS_TYPE.PIPELINES]: Network,
	"default": BookText,
}
