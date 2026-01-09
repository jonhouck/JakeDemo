import { NextResponse } from 'next/server';
import { PrioritizationEngine } from '@/services/PrioritizationEngine';

export async function GET() {
    const engine = new PrioritizationEngine();
    const report = engine.generateReport();
    return NextResponse.json(report);
}
