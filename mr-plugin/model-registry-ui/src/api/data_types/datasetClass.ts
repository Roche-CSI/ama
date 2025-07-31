import {AssetClass, AssetClassInterface} from "./assetClass";


export class DatasetClass extends AssetClass {
	
	public static getFormatList(objects: AssetClassInterface[]): string[] {
		objects.forEach(object => console.log(object.attributes));
		
		return Array.from(new Set(
			objects.map(object => object.attributes.format)
				.filter((format): format is string => (format != null && format !== ''))
		));
	}
	
	public static getLicenseList(objects: AssetClassInterface[]): string[] {
		return Array.from(new Set(
			objects.map(object => object.attributes.license)
				.filter((license): license is string => (license != null && license !== ''))
		));
	}
	
	public static filterByFormat(objects: AssetClassInterface[], formats: string[]): AssetClassInterface[] {
		return objects.filter(object => formats.includes(object.attributes.format));
	}
	
	public static filterByLicense(objects: AssetClassInterface[], licenses: string[]): AssetClassInterface[] {
		return objects.filter(object => licenses.includes(object.attributes.license));
	}
}
