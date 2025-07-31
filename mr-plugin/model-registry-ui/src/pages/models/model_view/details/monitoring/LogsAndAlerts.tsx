// LogsAndAlerts.tsx
import React from 'react';

const logs = [
	{ timestamp: '2024-08-01 12:00', message: 'Model training started.' },
	{ timestamp: '2024-08-01 12:30', message: 'Training epoch 1 completed.' },
	{ timestamp: '2024-08-01 13:00', message: 'Training epoch 2 completed.' },
	{ timestamp: '2024-08-01 14:00', message: 'Model evaluation started.' },
	{ timestamp: '2024-08-01 14:30', message: 'Model evaluation completed with warnings.' }
];

const alerts = [
	{ timestamp: '2024-08-01 13:15', severity: 'Warning', message: 'Model accuracy dropped below threshold.' },
	{ timestamp: '2024-08-01 14:10', severity: 'Critical', message: 'Inference latency exceeded acceptable limits.' }
];

export const LogsAndAlerts: React.FC = () => {
	return (
		<div className="space-y-4">
			{/* Error Logs */}
			<h2 className="text-md font-semibold mt-4 pt-2">Error Logs</h2>
			<div className="rounded-lg p-4 border">
				<ul className="space-y-2 text-sm">
					{logs.map((log, index) => (
						<li key={index} className="p-1 border-b border-gray-200">
							<span className="font-semibold">{log.timestamp}:</span> {log.message}
						</li>
					))}
				</ul>
			</div>

			{/* Alerts */}
			<h2 className="text-md font-semibold mt-4 pt-2">Alerts</h2>
			<div className="rounded-lg p-4 border">
				<ul className="space-y-2 text-sm">
					{alerts.map((alert, index) => (
						<li key={index} className={`p-1 border-b border-gray-200 ${alert.severity === 'Critical' ? 'text-red-600' : 'text-yellow-600'}`}>
							<span className="font-semibold">{alert.timestamp} [{alert.severity}]:</span> {alert.message}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

