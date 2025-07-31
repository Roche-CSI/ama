import './App.css'
import React from 'react';
import {ThemeProvider} from './themes';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
	return (
		<ThemeProvider>
			<Router>
				<AppRoutes />
			</Router>
		</ThemeProvider>
	);
}

export default App;

// import './App.css'
// import {ThemeProvider} from './themes';
// import {ModelClassListPage, ModelClassPage, ModelViewPage} from "./pages/models";
// import {HomePage} from "./pages/home";
// import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
// import {DatasetsListPage, DatasetViewPage} from "./pages/datasets";
// import {DocsPage} from "./pages/docs";
// import {Page403, Page404} from "./pages/404";
// import {NavBar} from "./components/navbar";
// import {DeploymentsListPage, DeploymentViewPage} from "./pages/deployments";
// import {ProjectProvider} from "./contexts/projectContext";
// import React from 'react';
// import {LoginSignupPage} from "./pages/login";
// import {UserPage} from "./pages/user";
// import {DatasetsPage} from "./pages/datasets/DatasetsPage.tsx";
// import PrWorkFlow from "./pages/pr_workflow/PrWorkFlow.tsx";
// import SearchPage from "./pages/search/SearchPage.tsx";
// import SearchResultsPage from "./pages/search/SearchResultsPage.tsx";
// import {UserProvider} from "./contexts/userContext/UserProvider.tsx";
//
// const AppContent = () => {
// 	const location = useLocation();
// 	const publicRoutes = ['/login', '/'];
// 	const isPublicRoute = publicRoutes.includes(location.pathname);
//
// 	return (
// 		<React.Fragment>
// 			{!isPublicRoute && (
// 				<div className="flex items-center justify-center shadow shadow-[#64748b20]">
// 					<div className="container"><NavBar/></div>
// 				</div>
// 			)}
//
// 			<Routes>
//
// 				<Route path="/:project_id">
// 					<Route path="models">
// 						<Route index element={<ModelClassListPage/>}/> {/* Shows list of collections */}
// 						<Route path=":collection_id">
// 							<Route index element={<ModelClassPage/>}/> {/* Shows models in a collection */}
// 							<Route path=":model_id/*" element={<ModelViewPage/>}/> {/* Shows individual model details */}
// 						</Route>
// 					</Route>
// 					<Route path="datasets">
// 						<Route index element={<DatasetsListPage/>}/>
// 						<Route path=":dataset_id" element={<DatasetViewPage/>}/>
// 					</Route>
// 					<Route path="deployments">
// 						<Route index element={<DeploymentsListPage/>}/>
// 						<Route path=":deployment_id" element={<DeploymentViewPage/>}/>
// 					</Route>
// 					<Route path="docs" element={<DocsPage/>}/>
// 					<Route path="search/*" element={<SearchPage/>}/>
// 					<Route path="search-results/*" element={<SearchResultsPage/>}/>
// 				</Route>
//
// 				<Route path="/users/*" element={<UserPage/>}/>
// 				<Route path="/login" element={<LoginSignupPage/>}/>
// 				<Route path="/" element={<HomePage/>}/>
// 				<Route path="/pr" element={<PrWorkFlow/>}/>
// 				<Route path="/forbidden" element={<Page403/>}/>
// 				<Route path="*" element={<Page404/>}/>
// 			</Routes>
// 		</React.Fragment>
// 	);
// };
//
// function App() {
// 	return (
// 		<ThemeProvider>
// 			<Router>
// 				<UserProvider>
// 					<ProjectProvider>
// 						<AppContent/>
// 					</ProjectProvider>
// 				</UserProvider>
// 			</Router>
// 		</ThemeProvider>
// 	);
// }
//
// export default App;
