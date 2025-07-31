/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import {VersionIcon} from "../../../../../components/icons";
import {DropDown} from "../../../../../components/dropdown/DropDown.tsx";
import {TagLabel} from "../../../../../components/tagview";
import {Compliance} from "./Compliance.tsx";
import {Team} from "./Team.tsx";
import {Alerts} from "./Alerts.tsx";
import {Docs} from "./Docs.tsx";

interface GovernanceTabProps {
	complianceInfo: {
		regulatoryCompliance: string;
		dataPrivacy: string;
		auditTrails: string[];
	};
	riskManagement: {
		riskAssessment: string;
		mitigationStrategies: string;
	};
	documentation: {
		governanceDocs: string[];
		reports: string[];
	};
	roles: {
		governanceTeam: { name: string; role: string; contact: string }[];
		stakeholderInvolvement: string;
	};
	auditSchedules: {
		upcomingAudits: { date: string; description: string }[];
		recentReviews: { date: string; summary: string }[];
	};
	ethicalConsiderations: {
		ethicalGuidelines: string;
		biasMitigation: string;
	};
	feedbackAndImprovements: {
		feedbackMechanisms: string;
		improvementPlans: string;
	};
}

const versions = [
	{ id: 'v1.0', name: 'v1.0' },
	{ id: 'v1.1', name: 'v1.1' },
	{ id: 'v2.0', name: 'v2.0' },
	{ id: 'experimental-1', name: 'Experimental 1' },
	{ id: 'experimental-2', name: 'Experimental 2' }
];

const GROUPS = ['team', 'compliance', 'docs', 'alerts'];

export const Governance: React.FC<GovernanceTabProps> = (props) => {
	const [selectedVersion, setSelectedVersion] = React.useState<string>(versions[0].id);
	const [selectedGroup, setSelectedGroup] = React.useState<string>(GROUPS[0]);
	
	return (
		<div className="">
		<div className="flex">
			<div className="ml-left">
				<DropDown title={"Version"}
						  options={versions}
						  onSelect={(item) => setSelectedVersion(item.id)}
						  IconComponent={VersionIcon}
						  className={"v-center text-sm font-light bg-gray-100"}
				/>
			</div>
		</div>
			<div className="flex">
				<div className="gap-x-8 space-y-2 space-x-1 mb-6">
					{
						GROUPS.map((name, index) => {
							return <TagLabel key={index}
							                 name={name}
							                 selected={name === selectedGroup}
							                 onClick={setSelectedGroup}/>
						})
					}
				</div>
			</div>
			{TabView(selectedGroup, props)}
		</div>
	);
};

const TabView: React.FC = (name, props) => {
	switch (name) {
		case 'compliance':
			return <Compliance complianceInfo={props.complianceInfo} auditSchedules={props.auditSchedules} documentation={props.documentation}/>;
		case 'team':
			return <Team roles={props.roles}/>;
		case 'alerts':
			return <Alerts/>;
		case 'docs':
			return <Docs riskManagement={props.riskManagement} ethicalConsiderations={props.ethicalConsiderations} feedbackAndImprovements={props.feedbackAndImprovements}/>;
		default:
			return null;
	}
}
