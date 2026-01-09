import React from 'react';
import { DashboardStats as DashboardStatsType } from '@/types/models';

interface DashboardStatsProps {
    stats: DashboardStatsType | null;
    loading: boolean;
}

const StatCard = ({ title, value, highlight = false, subtext }: { title: string, value: string | number, highlight?: boolean, subtext?: string }) => (
    <div className={`p-6 rounded-lg shadow-sm border ${highlight ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'}`}>
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{title}</h3>
        <div className={`mt-2 text-3xl font-bold ${highlight ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>
            {value}
        </div>
        {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Assets"
                value={stats.total_assets}
            />
            <StatCard
                title="Critical Assets"
                value={stats.critical_assets}
                subtext="Score 8-10"
            />
            <StatCard
                title="High Risk Vulns"
                value={stats.total_vulnerabilities} // Note: API might need granular split, using total for now or mapped correctly
            />
            <StatCard
                title="Exploited CVEs"
                value={stats.exploited_cves}
                highlight={stats.exploited_cves > 0}
                subtext="Known Exploited (CISA KEV)"
            />
        </div>
    );
};
