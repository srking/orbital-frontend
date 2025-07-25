import axios from "axios";
import {UsageRow} from "@/models";

export default function getUsage(): Promise<UsageRow[]> {
    return axios({
        method: 'GET',
        url: `${process.env.USAGE_API_URL}/usage`
    }).then((response) => {
        return response.data.usage;
    });
}
