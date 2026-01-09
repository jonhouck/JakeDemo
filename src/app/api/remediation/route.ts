import { NextResponse } from 'next/server';
import { PrioritizationEngine } from '@/services/PrioritizationEngine';
import { MockDataGenerator } from '@/services/MockDataGenerator';

export async function GET() {
    MockDataGenerator.initializeData();
    const engine = new PrioritizationEngine();
    const report = engine.generateReport();
    return NextResponse.json(report);
}
