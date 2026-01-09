import { NextResponse } from 'next/server';
import { MockDataStore } from '@/services/MockDataStore';

export async function GET() {
    const store = MockDataStore.getInstance();
    const stats = store.getDashboardStats();
    return NextResponse.json(stats);
}
