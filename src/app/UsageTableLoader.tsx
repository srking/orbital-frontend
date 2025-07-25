'use client';

import {UsageRow} from "@/models";
import {use} from "react";
import UsageTable from "@/components/UsageTable";
import {usePathname, useSearchParams} from "next/navigation";

export default function UsageTableLoader({ usagePromise }: { usagePromise: Promise<UsageRow[]>}) {
    const data = use(usagePromise);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return <UsageTable data={data} pathname={pathname} searchParams={searchParams} />;
}
