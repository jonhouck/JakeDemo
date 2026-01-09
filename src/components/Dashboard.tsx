"use client";

import React, { useEffect, useState } from 'react';
import { DashboardStats } from './DashboardStats';
import { RemediationTable } from './RemediationTable';
import { VulnerabilityDetail } from './VulnerabilityDetail';
import { DashboardStats as DashboardStatsType, RemediationItem } from '@/types/models';
import { ReportService } from '@/services/ReportService';

export const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStatsType | null>(null);
    const [remediationItems, setRemediationItems] = useState<RemediationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<RemediationItem | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch stats
            const statsRes = await fetch('/api/dashboard');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            // Fetch remediation list
            const remRes = await fetch('/api/remediation');
            if (remRes.ok) {
                const remData = await remRes.json();
                setRemediationItems(remData);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 30 seconds to update if background OSINT tasks complete
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleExport = (format: 'json' | 'markdown') => {
        if (remediationItems.length === 0) {
            alert('No data to export.');
            return;
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `cve-report-${dateStr}.${format === 'json' ? 'json' : 'md'}`;

        let blob: Blob;
        if (format === 'json') {
            blob = ReportService.generateJson(remediationItems);
        } else {
            blob = ReportService.generateMarkdown(remediationItems);
        }

        ReportService.downloadFile(blob, filename);
    };

    return (
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 dark:text-zinc-400">Security Posture Overview</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchData}
                        className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Refresh Data
                    </button>
                    <div className="flex shadow-sm rounded-md" role="group">
                        <button
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-r border-blue-700 rounded-l-md hover:bg-blue-700 transition-colors"
                            onClick={() => handleExport('json')}
                        >
                            Export JSON
                        </button>
                        <button
                            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border-l rounded-r-md hover:bg-blue-700 transition-colors"
                            onClick={() => handleExport('markdown')}
                        >
                            MD
                        </button>
                    </div>
                </div>
            </div>

            <DashboardStats stats={stats} loading={loading} />

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    Prioritized Remediation Actions
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
                        {remediationItems.length} items
                    </span>
                </h2>
                <RemediationTable
                    items={remediationItems}
                    apiLoading={loading}
                    onViewDetails={setSelectedItem}
                />
            </div>

            <VulnerabilityDetail
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};
