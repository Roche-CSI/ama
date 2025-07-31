import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
	CreateModelPage,
	ModelClassListPage,
	ModelClassPage,
	ModelViewPage
} from "../pages/models";
import {
	DatasetsListPage,
	DatasetViewPage
} from "../pages/datasets";
import { DocsPage } from "../pages/docs";
import { Page403 } from "../pages/404";
import {
	DeploymentsListPage,
	DeploymentViewPage
} from "../pages/deployments";
import { UserPage } from "../pages/user";
import PrWorkFlow from "../pages/pr_workflow/PrWorkFlow.tsx";
import SearchPage from "../pages/search/SearchPage.tsx";
import SearchResultsPage from "../pages/search/SearchResultsPage.tsx";

const ProtectedRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/:project_id">
				<Route path="models">
					<Route index element={<ModelClassListPage />} />
					<Route path="new" element={<CreateModelPage/>} />
					<Route path=":collection_id">
						<Route index element={<ModelClassPage />} />
						<Route path=":model_id/*" element={<ModelViewPage />} />
					</Route>
				</Route>
				<Route path="datasets">
					<Route index element={<DatasetsListPage />} />
					<Route path=":dataset_id" element={<DatasetViewPage />} />
				</Route>
				<Route path="deployments">
					<Route index element={<DeploymentsListPage />} />
					<Route path=":deployment_id" element={<DeploymentViewPage />} />
				</Route>
				<Route path="docs" element={<DocsPage />} />
				<Route path="search/*" element={<SearchPage />} />
				<Route path="search-results/*" element={<SearchResultsPage />} />
			</Route>
			
			<Route path="/users/*" element={<UserPage />} />
			<Route path="/pr" element={<PrWorkFlow />} />
			<Route path="/forbidden" element={<Page403 />} />
		</Routes>
	);
};

export default ProtectedRoutes;
