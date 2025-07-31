import {AssetClass, AssetClassInterface} from "./assetClass.ts";

// export interface Parameters {
// 	num_layers: number;
// 	hidden_size: number;
// 	num_attention_heads: number;
// 	intermediate_size: number;
// }
//
// export interface TrainingData {
// 	dataset: string;
// 	size: string;
// 	epochs: number;
// 	batch_size: number;
// 	learning_rate: number;
// }
//
// export interface EvaluationMetrics {
// 	accuracy: number;
// 	f1_score: number;
// 	precision: number;
// 	recall: number;
// }
//
// // Attributes class to handle the attributes object
// export class Attributes {
// 	license: string;
// 	author: string;
// 	type: string;
// 	language: string;
// 	tasks: string[];
// 	architecture: string;
// 	parameters: Parameters;
// 	trainingData: TrainingData;
// 	evaluationMetrics: EvaluationMetrics;
// 	exampleInputs: string[];
// 	exampleOutputs: string[];
//
// 	constructor(attributesData: Record<string, any>) {
// 		this.license = attributesData.license || '';
// 		this.author = attributesData.author || '';
// 		this.type = attributesData.type || '';
// 		this.language = attributesData.language || '';
// 		this.tasks = attributesData.tasks || [];
// 		this.architecture = attributesData.architecture || '';
// 		this.parameters = attributesData.parameters || {};
// 		this.trainingData = attributesData.training_data || {};
// 		this.evaluationMetrics = attributesData.evaluation_metrics || {};
// 		this.exampleInputs = attributesData.example_inputs || [];
// 		this.exampleOutputs = attributesData.example_outputs || [];
// 	}
// }

export class ModelClass extends AssetClass {
	
	// castToAttributes(data: Record<string, any>): any {
	// 	return new Attributes(data);
	// }
	
	public static getTaskList(objects: AssetClassInterface[]): string[] {
		return Array.from(new Set(
			objects.flatMap(object => object.attributes.tasks)
				.filter((task): task is string => (task != null && task !== ''))
		));
	}
	
	public static getDatasetList(objects: AssetClassInterface[]): string[] {
		// remove null values and duplicates
		return Array.from(new Set(
			objects.flatMap(object => object.attributes?.training_data?.dataset)
				.filter((dataset): dataset is string => (dataset != null && dataset !== ''))
		));
	}
	
	public static getLicenseList(objects: AssetClassInterface[]): string[] {
		return Array.from(new Set(
			objects.map(object => object.attributes.license)
				.filter((license): license is string => (license != null && license !== ''))
		));
	}
	
	public static getLanguageList(objects: AssetClassInterface[]): string[] {
		return Array.from(new Set(
			objects.map(object => object.attributes.language)
				.filter((language): language is string => (language != null && language !== ''))
		));
	}
	
	public static filterByTask(objects: AssetClassInterface[], tasks: string[]): AssetClassInterface[] {
		return objects.filter(object => (object.attributes.tasks || []).some((task: string) => tasks.includes(task)));
	}
	
	public static filterByDataset(objects: AssetClassInterface[], datasets: string[]): AssetClassInterface[] {
		return objects.filter(object => datasets.includes(object.attributes?.training_data?.dataset));
	}
	
	public static filterByLicense(objects: AssetClassInterface[], licenses: string[]): AssetClassInterface[] {
		return objects.filter(object => licenses.includes(object.attributes.license));
	}
	
	public static filterByLanguage(objects: AssetClassInterface[], languages: string[]): AssetClassInterface[] {
		return objects.filter(object => languages.includes(object.attributes.language));
	}
	
}
