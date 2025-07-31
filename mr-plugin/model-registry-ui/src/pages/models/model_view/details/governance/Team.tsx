import React from "react";

export const Team: React.FC = ({roles}) => {
	return (
		<section className="mb-6">
			<h2 className="text-xl font-semibold mb-2">Roles and Responsibilities</h2>
			<div>
				<strong>Governance Team:</strong>
				<ul>
					{roles.governanceTeam.map((member, index) => (
						<li key={index}>
							<strong>{member.name}</strong> - {member.role} - <a
							href={`mailto:${member.contact}`}>{member.contact}</a>
						</li>
					))}
				</ul>
			</div>
			<p><strong>Stakeholder Involvement:</strong> {roles.stakeholderInvolvement}</p>
		</section>
	)
}
