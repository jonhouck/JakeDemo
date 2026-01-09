import React from 'react';
import { RemediationItem } from '@/types/models';

interface RemediationTableProps {
    items: RemediationItem[];
    apiLoading: boolean;
    onViewDetails: (item: RemediationItem) => void;
}

export const RemediationTable: React.FC<RemediationTableProps> = ({ items, apiLoading, onViewDetails }) => {
    const [filterText, setFilterText] = React.useState('');
    const [showExploitedOnly, setShowExploitedOnly] = React.useState(false);
    const [sortConfig, setSortConfig] = React.useState<{ key: keyof RemediationItem | 'cvss_score', direction: 'asc' | 'desc' }>({ key: 'risk_score', direction: 'desc' });

    const filteredItems = React.useMemo(() => {
        return items.filter(item => {
            const matchesSearch =
                item.hostname.toLowerCase().includes(filterText.toLowerCase()) ||
                item.ip_address.includes(filterText) ||
                item.cve_id.toLowerCase().includes(filterText.toLowerCase());

            const matchesExploited = showExploitedOnly ? item.threat_info.is_exploited_in_wild : true;

            return matchesSearch && matchesExploited;
        });
    }, [items, filterText, showExploitedOnly]);

    const sortedItems = React.useMemo(() => {
        const sorted = [...filteredItems];
        sorted.sort((a, b) => {
            let aValue: any = a[sortConfig.key as keyof RemediationItem];
            let bValue: any = b[sortConfig.key as keyof RemediationItem];

            // Handle nested properties if needed (e.g. cvss_score)
            if (sortConfig.key === 'cvss_score') {
                aValue = a.threat_info.cvss_score;
                bValue = b.threat_info.cvss_score;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredItems, sortConfig]);

    const handleSort = (key: keyof RemediationItem | 'cvss_score') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) return <span className="ml-1 text-zinc-300">↕</span>;
        return <span className="ml-1 text-blue-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    if (apiLoading) {
        return <div className="p-8 text-center text-zinc-500">Loading remediation data...</div>;
    }

    if (items.length === 0) {
        return <div className="p-8 text-center text-zinc-500">No remediation items found. System secure?</div>;
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <input
                        type="text"
                        placeholder="Search Hostname, IP, or CVE..."
                        className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-zinc-400">🔍</div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-700 dark:text-zinc-300">
                        <input
                            type="checkbox"
                            checked={showExploitedOnly}
                            onChange={(e) => setShowExploitedOnly(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <span className="font-medium">⚠️ Show Exploited Only</span>
                    </label>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300">
                        <tr>
                            <th className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 select-none" onClick={() => handleSort('priority_rank')}>
                                <div className="flex items-center">Rank <SortIcon columnKey="priority_rank" /></div>
                            </th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 select-none" onClick={() => handleSort('risk_score')}>
                                <div className="flex items-center">Risk Score <SortIcon columnKey="risk_score" /></div>
                            </th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 select-none" onClick={() => handleSort('hostname')}>
                                <div className="flex items-center">Asset <SortIcon columnKey="hostname" /></div>
                            </th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 select-none" onClick={() => handleSort('cve_id')}>
                                <div className="flex items-center">CVE ID <SortIcon columnKey="cve_id" /></div>
                            </th>
                            <th className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 select-none" onClick={() => handleSort('cvss_score')}>
                                <div className="flex items-center">Severity <SortIcon columnKey="cvss_score" /></div>
                            </th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.length > 0 ? (
                            sortedItems.map((item) => (
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                                    No items match your filter criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
