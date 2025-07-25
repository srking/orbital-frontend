import UsageTableLoader from "@/app/UsageTableLoader";
import {Suspense} from "react";
import UsageBarChartLoader from "@/app/UsageBarChartLoader";
import getUsage from "@/data/getUsage";

export default function Home() {
  const usage = getUsage();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-7xl">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <div className="h-96 w-full">
          <Suspense fallback={<div className="border-1 border-gray-400 rounded-md w-full h-full flex items-center justify-center"><p>Loading chart data ...</p></div>}>
            <UsageBarChartLoader usagePromise={usage} />
          </Suspense>
        </div>
        <div className="min-h-32 w-full border-1 border-gray-400 rounded-md p-4">
          <Suspense fallback={<div className="w-full h-32 flex items-center justify-center"><p>Loading table data ...</p></div>}>
            <UsageTableLoader usagePromise={usage} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
