import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import {DatasetsListPage} from "./DatasetsListPage.tsx";
import {CreateDatasetPage} from "./CreateDatasetPage.tsx";
import {DatasetViewPage} from "./DatasetViewPage.tsx";

export const DatasetsPage = () => {
	return (
		<Routes>
			<Route index element={<DatasetsListPage />} />
			<Route path="new" element={<CreateDatasetPage />} />
			<Route path=":datasetId/*" element={<DatasetViewPage />} />
		</Routes>
	);
};
