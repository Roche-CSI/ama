export {Governance} from './Governance';

export const modelGovernanceData = {
	complianceInfo: {
		regulatoryCompliance: "Compliant with GDPR and CCPA.",
		dataPrivacy: "Data is anonymized and encrypted.",
		auditTrails: ["Audit on 2024-01-15", "Compliance check on 2024-03-20"],
	},
	riskManagement: {
		riskAssessment: "Low risk of data bias detected.",
		mitigationStrategies: "Regular updates and validation checks.",
	},
	documentation: {
		governanceDocs: ["https://example.com/gov-docs"],
		reports: ["https://example.com/report-2024"],
	},
	roles: {
		governanceTeam: [
			{ name: "Alice Smith", role: "Lead Data Scientist", contact: "alice@example.com" },
			{ name: "Bob Johnson", role: "Compliance Officer", contact: "bob@example.com" },
		],
		stakeholderInvolvement: "Engaged with data engineers and business analysts.",
	},
	auditSchedules: {
		upcomingAudits: [
			{ date: "2024-06-15", description: "Quarterly compliance audit" },
		],
		recentReviews: [
			{ date: "2024-01-10", summary: "Annual review completed with no major issues." },
		],
	},
	ethicalConsiderations: {
		ethicalGuidelines: "Adheres to company ethical standards.",
		biasMitigation: "Bias detection algorithms are in place.",
	},
	feedbackAndImprovements: {
		feedbackMechanisms: "Feedback collected via internal survey.",
		improvementPlans: "Planning to enhance model transparency.",
	},
};
