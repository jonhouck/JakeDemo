import { MockDataGenerator } from "@/services/MockDataGenerator";
import { OsintService } from "@/services/OsintService";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  // Initialize mock data on the server side (idempotent)
  MockDataGenerator.initializeData();

  // Trigger OSINT fetch in background
  const osintService = new OsintService();
  osintService.fetchCisaKevData().catch(console.error);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <h1 className="text-xl font-bold tracking-tight">CVE Remediation <span className="text-zinc-400 font-normal">PoC</span></h1>
        </div>
      </header>
      <main className="flex justify-center">
        <Dashboard />
      </main>
    </div>
  );
}
