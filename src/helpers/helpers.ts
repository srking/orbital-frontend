import {DailyUsage, UsageRow} from "@/models";
import moment from "moment";

export function getDateOnlyFormat(timestamp: string): string {
    return moment(timestamp).utc().format('DD-MM-YYYY');
}

export function getDateHourMinuteFormat(date: string) {
    return moment(date).utc().format('DD-MM-YYYY HH:mm');
}

type DailyUsageMap = {
    [date: string]: number;
}

export function getDailyUsage(usage: UsageRow[]): DailyUsage[] {
    const dailyUsageMap = usage.reduce<DailyUsageMap>((result, { timestamp, credits_used }) => {
        const date =  getDateOnlyFormat(timestamp);
        const currentTotalForDate = result[date] || 0;

        return {
            ...result,
            [date]: currentTotalForDate + credits_used,
        };
    }, {});

    return Array.from(Object.entries(dailyUsageMap), ([date, credits_used]) => ({
        date,
        credits_used,
    }));
}
