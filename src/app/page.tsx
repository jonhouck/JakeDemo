import { MockDataGenerator } from "@/services/MockDataGenerator";
import { MockDataStore } from "@/services/MockDataStore";

export default function Home() {
  // Initialize mock data (idempotent)
  MockDataGenerator.initializeData();
  const store = MockDataStore.getInstance();
  const assets = store.getAssets();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold">CVE Remediation PoC</h1>
        <div className="mt-8">
          <p>Mock Data Initialization Complete.</p>
          <p>Assets Generated: <strong>{assets.length}</strong></p>
        </div>
      </main>
    </div>
  );
}
