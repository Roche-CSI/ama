import React from 'react';
import {
	Users,
	FileCheck,
	Activity,
	AlertTriangle,
	Scale,
	Database,
	FileText,
	AlertOctagon,
	Server, ArrowRight, CircleCheckBig, Calendar, Check, GitBranch, AlertCircle, Clock
} from 'lucide-react';

export const Governance = () => {
	const governanceData = {
		ethical: {
			riskLevel: 'Medium',
			biasAssessment: {status: "Completed", date: "2024-03-01"},
			fairnessMetrics: {
				demographicParity: 0.92,
				equalOpportunity: 0.89
			},
			ethicalConsiderations: [
				'No PII data processing',
				'Validated for age and gender bias',
				'Environmental impact assessed'
			]
		},
		compliance: {
			status: 'Approved',
			frameworks: ['GDPR', 'CCPA', 'ISO 27001'],
			lastAudit: '2024-02-20',
			nextAuditDue: '2024-08-20',
			dataResidency: ['US-East', 'EU-West']
		},
		accountability: {
			owner: 'ML Platform Team',
			stakeholders: ['Data Science', 'Legal', 'Privacy Office'],
			reviewers: ['John Doe', 'Jane Smith'],
			approvalChain: ['Technical Review', 'Ethics Board', 'Legal Review']
		},
		monitoring: {
			driftAlerts: 'Enabled',
			performanceThresholds: {
				accuracy: '> 0.85',
				latency: '< 100ms'
			},
			lastIncident: '2024-01-15',
			incidentResolutionTime: '4h'
		},
		dataGovernance: {
			sources: ['Internal CRM', 'Public Dataset XYZ'],
			qualityMetrics: {
				completeness: '98%',
				accuracy: '95%',
				consistency: '97%'
			},
			privacyLevel: 'Level 2 - Restricted',
			retentionPeriod: '24 months',
			lastValidation: '2024-03-01'
		},
		documentation: {
			modelCard: 'v2.1 Updated',
			methodology: 'Ensemble Learning',
			useCase: 'Customer Churn Prediction',
			limitations: [
				'Not suitable for real-time processing',
				'Limited to English language input'
			],
			versions: [
				{ version: '2.1.0', date: '2024-03-01', changes: 'Performance improvements' },
				{ version: '2.0.0', date: '2024-01-15', changes: 'Major architecture update' }
			]
		},
		riskManagement: {
			overallRisk: 'Medium',
			securityScore: 85,
			mitigations: [
				'Automated testing pipeline',
				'Regular security scans',
				'Redundant deployment'
			],
			contingencyPlan: 'Version rollback procedure in place',
			lastRiskAssessment: '2024-02-28'
		},
		deployment: {
			status: 'Production - Active',
			deployments: [
				{ version: '2.1.0', date: '2024-03-05', status: 'Active' },
				{ version: '2.0.0', date: '2024-01-20', status: 'Archived' }
			],
			abTests: [
				{ id: 'TEST-123', status: 'Completed', improvement: '+2.5%' }
			],
			sla: {
				availability: '99.9%',
				responseTime: '< 200ms',
				throughput: '1000 req/s'
			}
		}
	};
	
	const Badge = ({ type, children }) => {
		const styles = {
			success: 'bg-green-100 text-green-800 border border-green-200 text-xs',
			warning: 'bg-orange-100 text-orange-800 border border-orange-200 text-xs',
			info: 'bg-blue-100 text-blue-800 border border-blue-200 text-xs',
			error: 'bg-red-100 text-red-800 border border-red-200 text-xs',
			neutral: 'bg-gray-100 text-gray-800 border border-gray-200 text-xs'
		};
		
		return (
			<span className={`${styles[type]} px-3 py-1 rounded-full font-medium shadow-sm`}>
        {children}
      </span>
		);
	};
	
	const StatusItem = ({ label, icon, status, date }) => (
		<div className="flex space-x-2 items-center">
			<span className="border border-gray-300 rounded-md text-sm px-2">{label}</span>
			<ArrowRight className="size-4"/>
			{icon}
			<span className="text-sm text-green-400">{status}</span>
			{date && (
				<>
					<Calendar className="size-4 text-gray-500"/>
					<span className="text-sm text-gray-500">{date}</span>
				</>
			)}
		</div>
	);
	
	return (
		<div className="space-y-6 mb-6">
			<div className="text-lg font-semibold">Governance</div>
			<div className="bg-white">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Ethical Assessment */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<Scale className="h-4 w-4"/>
								Ethical Assessment
							</h3>
							<div className="flex space-x-4 items-center">
								<span>Risk:</span>
								<Badge type="warning">{governanceData.ethical.riskLevel}</Badge>
							</div>
						</div>
						<div className="p-4">
							<div className="space-y-4">
								<div className="flex space-x-2 items-center">
									<span className="border border-gray-300 rounded-md text-sm px-2">Bias Assessment</span>
									<ArrowRight className="size-4"/>
									<CircleCheckBig className="size-4 text-green-500"/>
									<span className="text-sm text-green-400">{governanceData.ethical.biasAssessment.status}</span>
									<Calendar className="size-4 text-gray-500"/>
									<span className="text-sm text-gray-500">{governanceData.ethical.biasAssessment.date}</span>
								</div>
								<div className="mt-4 bg-blue-50 p-4 rounded-md">
									Fairness Metrics: Demographic Parity {governanceData.ethical.fairnessMetrics.demographicParity}
								</div>
							</div>
						</div>
					</div>
					
					{/* Compliance */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<FileCheck className="h-4 w-4"/>
								Compliance Status
							</h3>
							<Badge type="success">{governanceData.compliance.status}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Last Audit"
								icon={<Check className="size-4 text-green-500"/>}
								status="Completed"
								date={governanceData.compliance.lastAudit}
							/>
							<div className="bg-blue-50 p-4 rounded-md">
								<div className="text-sm font-medium mb-2">Active Frameworks</div>
								<div className="flex flex-wrap gap-2">
									{governanceData.compliance.frameworks.map((framework) => (
										<Badge key={framework} type="info">{framework}</Badge>
									))}
								</div>
							</div>
						</div>
					</div>
					
					{/* Data Governance */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<Database className="h-4 w-4"/>
								Data Governance
							</h3>
							<Badge type="warning">{governanceData.dataGovernance.privacyLevel}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Last Validation"
								icon={<Check className="size-4 text-green-500"/>}
								status="Validated"
								date={governanceData.dataGovernance.lastValidation}
							/>
							<div className="grid grid-cols-2 gap-4">
								{Object.entries(governanceData.dataGovernance.qualityMetrics).map(([key, value]) => (
									<div key={key} className="bg-blue-50 p-3 rounded-md">
										<div className="text-sm font-medium mb-1 capitalize">{key}</div>
										<Badge type="success">{value}</Badge>
									</div>
								))}
							</div>
						</div>
					</div>
					
					{/* Documentation */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<FileText className="h-4 w-4"/>
								Documentation
							</h3>
							<Badge type="info">{governanceData.documentation.modelCard}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Latest Version"
								icon={<GitBranch className="size-4 text-blue-500"/>}
								status={governanceData.documentation.versions[0].version}
								date={governanceData.documentation.versions[0].date}
							/>
							<div className="bg-blue-50 p-4 rounded-md">
								<div className="text-sm font-medium mb-2">Known Limitations</div>
								<ul className="list-disc pl-4 space-y-1">
									{governanceData.documentation.limitations.map((limitation, index) => (
										<li key={index} className="text-sm">{limitation}</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					
					{/* Risk Management */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<AlertOctagon className="h-4 w-4"/>
								Risk Management
							</h3>
							<div className="flex items-center gap-2">
								<Badge type="warning">{governanceData.riskManagement.overallRisk}</Badge>
								<Badge type="info">{governanceData.riskManagement.securityScore}/100</Badge>
							</div>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Risk Assessment"
								icon={<AlertCircle className="size-4 text-orange-500"/>}
								status="Reviewed"
								date={governanceData.riskManagement.lastRiskAssessment}
							/>
							<div className="bg-yellow-50 p-4 rounded-md">
								<div className="text-sm font-medium mb-2">Active Mitigations</div>
								<ul className="list-disc pl-4 space-y-1">
									{governanceData.riskManagement.mitigations.map((mitigation, index) => (
										<li key={index} className="text-sm">{mitigation}</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					
					{/* Deployment Controls */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<Server className="h-4 w-4"/>
								Deployment Controls
							</h3>
							<Badge type="success">{governanceData.deployment.status}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Latest Deployment"
								icon={<Check className="size-4 text-green-500"/>}
								status={governanceData.deployment.deployments[0].version}
								date={governanceData.deployment.deployments[0].date}
							/>
							<div className="grid grid-cols-2 gap-4">
								{Object.entries(governanceData.deployment.sla).map(([key, value]) => (
									<div key={key} className="bg-green-50 p-3 rounded-md">
										<div className="text-sm font-medium mb-1 capitalize">{key}</div>
										<Badge type="info">{value}</Badge>
									</div>
								))}
							</div>
						</div>
					</div>
					
					{/* Monitoring */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<Activity className="h-4 w-4"/>
								Monitoring
							</h3>
							<Badge type="success">{governanceData.monitoring.driftAlerts}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Last Incident"
								icon={<AlertTriangle className="size-4 text-red-500"/>}
								status="Resolved"
								date={governanceData.monitoring.lastIncident}
							/>
							<div className="bg-red-50 p-4 rounded-md">
								<div className="flex items-center gap-2">
									<Clock className="size-4 text-red-500"/>
									<span className="text-sm font-medium">Resolution Time: {governanceData.monitoring.incidentResolutionTime}</span>
								</div>
								<div className="mt-2 text-sm">
									Performance Threshold: {governanceData.monitoring.performanceThresholds.accuracy}
								</div>
							</div>
						</div>
					</div>
					
					{/* Accountability */}
					<div className="bg-white rounded-lg border shadow-sm">
						<div className="p-4 border-b flex justify-between">
							<h3 className="text-md font-semibold flex items-center gap-2">
								<Users className="h-4 w-4"/>
								Accountability
							</h3>
							<Badge type="info">{governanceData.accountability.owner}</Badge>
						</div>
						<div className="p-4 space-y-4">
							<StatusItem
								label="Approval Chain"
								icon={<Check className="size-4 text-green-500"/>}
								status="Configured"
							/>
							<div className="bg-gray-50 p-4 rounded-md">
								<div className="text-sm font-medium mb-2">Key Stakeholders</div>
								<div className="flex flex-wrap gap-2">
									{governanceData.accountability.stakeholders.map((stakeholder) => (
										<Badge key={stakeholder} type="neutral">{stakeholder}</Badge>
									))}
								</div>
							</div>
						</div>
					</div>
				
				</div>
			</div>
		</div>
	);
};

export default Governance;
