import React from "react";

export const Compliance: React.FC = ({complianceInfo, documentation, auditSchedules}) => {
	return (
		<React.Fragment>
			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Compliance and Regulatory Information</h2>
				<p><strong>Regulatory Compliance:</strong> {complianceInfo.regulatoryCompliance}</p>
				<p><strong>Data Privacy:</strong> {complianceInfo.dataPrivacy}</p>
				<div>
					<strong>Audit Trails:</strong>
					<ul>
						{complianceInfo.auditTrails.map((trail, index) => (
							<li key={index}>{trail}</li>
						))}
					</ul>
				</div>
			</section>
			
			{/* Documentation and Reporting */}
			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Documentation and Reporting</h2>
				<div>
					<strong>Governance Documentation:</strong>
					<ul>
						{documentation.governanceDocs.map((doc, index) => (
							<li key={index}><a href={doc} target="_blank" rel="noopener noreferrer">{doc}</a></li>
						))}
					</ul>
				</div>
				<div>
					<strong>Reports:</strong>
					<ul>
						{documentation.reports.map((report, index) => (
							<li key={index}><a href={report} target="_blank" rel="noopener noreferrer">{report}</a></li>
						))}
					</ul>
				</div>
			</section>
			{/* Audit and Review Schedules */}
			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Audit and Review Schedules</h2>
				<div>
					<strong>Upcoming Audits:</strong>
					<ul>
						{auditSchedules.upcomingAudits.map((audit, index) => (
							<li key={index}><strong>{audit.date}</strong>: {audit.description}</li>
						))}
					</ul>
				</div>
				<div>
					<strong>Recent Reviews:</strong>
					<ul>
						{auditSchedules.recentReviews.map((review, index) => (
							<li key={index}><strong>{review.date}</strong>: {review.summary}</li>
						))}
					</ul>
				</div>
			</section>
		</React.Fragment>
	)
}
