'use client';

import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {DailyUsage} from "@/models";

export default function UsageBarChart({ data }: { data: DailyUsage[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Bar dataKey="credits_used" name="Credits used" fill="#8884d8" />
                <Tooltip formatter={(value: number) => value.toFixed(2)}  />
                <Legend/>
            </BarChart>
        </ResponsiveContainer>
    );
}
