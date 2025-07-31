import { ApiFetcher } from "./ApiFetcher.ts";
import { ProjectInterface } from "./data_types";
import { END_POINTS } from "./Urls";

export class ProjectApi extends ApiFetcher {
	protected static endpoint = END_POINTS.PROJECT;

	public static async fetchAll(): Promise<ProjectInterface[]> {
		return super.fetchAll();
	}

	public static async fetchById(id: string): Promise<ProjectInterface> {
		return super.fetchById(id);
	}
}
