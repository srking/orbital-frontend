import {expect, test} from "@jest/globals";
import getUsage from "@/data/getUsage";
import axios from "axios";

jest.mock('axios');

const mockedAxios = (axios as unknown as jest.Mock);

test('passes correct parameters to fetch data', async () => {
    mockedAxios.mockImplementation(() => (
        Promise.resolve({ data: {} })
    ));

    getUsage();

    expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${process.env.USAGE_API_URL}/usage`,
    });
});

test('returns data from the data properly', async () => {
    const data = {
        usage: [{
            message_id: 101,
            timestamp: '2025-07-25T11:32:10.239Z',
            report_name: 'Sample Report',
            credits_used: 123.0
        }]
    }
    mockedAxios.mockImplementation(() => (
        Promise.resolve({ data })
    ));

    const actual = await getUsage();

    expect(actual).toEqual(data.usage);
});
