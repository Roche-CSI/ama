import React from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { ModelClassListPage } from "./ModelClassListPage.tsx";
import { ModelViewPage } from "./model_view/ModelViewPage.tsx";
import { CreateModelPage } from "./CreateModelPage.tsx";

export const ModelsPage: React.FC = () => {
	const location = useLocation();
	const pathSegments = location.pathname.split('/').filter(Boolean);
	const view = pathSegments.length > 1 ? pathSegments.slice(1).join("/") : "";
	return (
		<Routes>
			<Route index element={<ModelClassListPage />} />
			<Route path="new" element={<CreateModelPage />} />
			<Route path=":modelId/*" element={<ModelViewPage />} />
		</Routes>
	);
};
