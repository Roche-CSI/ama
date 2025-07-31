import React from "react";

export const Docs: React.FC = ({riskManagement, ethicalConsiderations, feedbackAndImprovements}) => {
	return (
		<React.Fragment>
			{/* Risk Management */}
			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Risk Management</h2>
				<p><strong>Risk Assessment:</strong> {riskManagement.riskAssessment}</p>
				<p><strong>Mitigation Strategies:</strong> {riskManagement.mitigationStrategies}</p>
			</section>
			
			{/* Roles and Responsibilities */}
			
			{/* Ethical Considerations */}
			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Ethical Considerations</h2>
				<p><strong>Ethical Guidelines:</strong> {ethicalConsiderations.ethicalGuidelines}</p>
				<p><strong>Bias Mitigation:</strong> {ethicalConsiderations.biasMitigation}</p>
			</section>
			
			{/* Feedback and Continuous Improvement */}
			<section>
				<h2 className="text-xl font-semibold mb-2">Feedback and Continuous Improvement</h2>
				<p><strong>Feedback Mechanisms:</strong> {feedbackAndImprovements.feedbackMechanisms}</p>
				<p><strong>Improvement Plans:</strong> {feedbackAndImprovements.improvementPlans}</p>
			</section>
		</React.Fragment>
	)
}
