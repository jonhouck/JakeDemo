import React from 'react';
import { RemediationItem } from '@/types/models';

interface RemediationTableProps {
    items: RemediationItem[];
    apiLoading: boolean;
    onViewDetails: (item: RemediationItem) => void;
}

export const RemediationTable: React.FC<RemediationTableProps> = ({ items, apiLoading, onViewDetails }) => {
    if (apiLoading) {
        return <div className="p-8 text-center text-zinc-500">Loading remediation data...</div>;
    }

    if (items.length === 0) {
        return <div className="p-8 text-center text-zinc-500">No remediation items found. System secure?</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300">
                    <tr>
                        <th className="px-6 py-3">Rank</th>
                        <th className="px-6 py-3">Risk Score</th>
                        <th className="px-6 py-3">Asset</th>
                        <th className="px-6 py-3">CVE ID</th>
                        <th className="px-6 py-3">Severity</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={`${item.asset_id}-${item.cve_id}`} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                #{item.priority_rank}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.risk_score > 80
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                    }`}>
                                    {item.risk_score.toFixed(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-zinc-900 dark:text-white">{item.hostname}</div>
                                <div className="text-xs text-zinc-500">{item.ip_address}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">
                                {item.cve_id}
                            </td>
                            <td className="px-6 py-4">
                                {item.threat_info.cvss_score.toFixed(1)}
                            </td>
                            <td className="px-6 py-4">
                                {item.threat_info.is_exploited_in_wild ? (
                                    <span className="text-red-600 font-bold flex items-center gap-1">
                                        ⚠️ Exploited
                                    </span>
                                ) : (
                                    <span className="text-zinc-500">
                                        Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => onViewDetails(item)}
                                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
