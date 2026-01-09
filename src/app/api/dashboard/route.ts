import { NextResponse } from 'next/server';
import { MockDataStore } from '@/services/MockDataStore';
import { MockDataGenerator } from '@/services/MockDataGenerator';

export async function GET() {
    MockDataGenerator.initializeData();
    const store = MockDataStore.getInstance();
    const stats = store.getDashboardStats();
    return NextResponse.json(stats);
}
