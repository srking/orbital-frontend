export type UsageRow = {
    message_id: number;
    timestamp: string;
    report_name?: string;
    credits_used: number;
}

export type DailyUsage = {
    date: string;
    credits_used: number;
}
