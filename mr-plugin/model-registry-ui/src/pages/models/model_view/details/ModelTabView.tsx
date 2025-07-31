/* eslint-disable no-mixed-spaces-and-tabs */
import { ModelInterface } from "../../../../api/data_types";
import React, { useMemo } from "react";
import { CardView } from "./card/CardView.tsx";
import { FilesView } from "./files/FilesView.tsx";
import { Lineage } from "./lineage";
import { ActionsView } from "./actions";
import { Experiments } from "./experiments/Experiments.tsx";
import { Governance, modelGovernanceData } from "./governance";
import { Discussions } from "./Discussions.tsx";
import { Monitoring } from "./monitoring";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { MetaView } from "./meta";


interface ModelDetailSectionProps {
	model: ModelInterface;
	tab: string;
}

export const ModelTabView: React.FC<ModelDetailSectionProps> = ({ model, tab }: ModelDetailSectionProps) => {
	console.log("ModelTabView", model, tab);
	return (
		<React.Fragment>
			<Routes>
				<Route index element={<CardView asset={model} />} />
				<Route path="card/*" element={<CardView asset={model} />} />
				<Route path="files/*" element={<FilesView asset={model} />} />
				<Route path="meta/*" element={<MetaView asset={model} />} />
				<Route path="lineage/*" element={<Lineage model={model} />} />
				<Route path="actions/*" element={<ActionsView model={model} />} />
				<Route path="experiments/*" element={<Experiments model={model} />} />
				<Route path="monitoring/*" element={<Monitoring model={model} />} />
				<Route path="governance/*" element={<Governance model={model}
					complianceInfo={modelGovernanceData.complianceInfo}
					riskManagement={modelGovernanceData.riskManagement}
					documentation={modelGovernanceData.documentation}
					roles={modelGovernanceData.roles}
					auditSchedules={modelGovernanceData.auditSchedules}
					ethicalConsiderations={modelGovernanceData.ethicalConsiderations}
					feedbackAndImprovements={modelGovernanceData.feedbackAndImprovements} />} />
				<Route path="discussions/*" element={<Discussions model={model} />} />
			</Routes>
			<Outlet />
		</React.Fragment>
	)
}
