'use client';

import {UsageRow} from "@/models";
import {use} from "react";
import UsageBarChart from "@/components/UsageBarChart";
import {getDailyUsage} from "@/helpers/helpers";

export default function UsageBarChartLoader({ usagePromise }: { usagePromise: Promise<UsageRow[]>}) {
    const usage = use(usagePromise);

    return <UsageBarChart data={getDailyUsage(usage)} />;
}
