import {getDailyUsage, getDateHourMinuteFormat, getDateOnlyFormat} from "@/helpers/helpers";
import {DailyUsage} from "@/models";

test('getDateOnlyFormat returns the provided date in the correct format', async () => {
    const actual = getDateOnlyFormat('2025-07-25T11:32:10.239Z');

    const expected = '25-07-2025';
    expect(actual).toEqual(expected);
});

test('getDateHourMinuteFormat  returns the provided date & time in the correct format', async () => {
    const actual = getDateHourMinuteFormat('2025-07-25T01:32:10.239Z');

    const expected = '25-07-2025 01:32';
    expect(actual).toEqual(expected);
});

test('getDailyUsage returns correct result for empty array', () => {
    const actual = getDailyUsage([]);

    const expected: DailyUsage[] = [];
    expect(actual).toEqual(expected);
});

test('getDailyUsage returns data for multiple dates', () => {
    const usage = [{
        message_id: 101,
        timestamp: '2025-07-25T23:59:59.999Z',
        credits_used: 12.0
    }, {
        message_id: 102,
        timestamp: '2025-07-26T00:00:00.000Z',
        credits_used: 34.0
    }];

    const actual = getDailyUsage(usage);

    const expected = [{
        date: '25-07-2025',
        credits_used: 12.0
    }, {
        date: '26-07-2025',
        credits_used: 34.0
    }];
    expect(actual).toEqual(expected);
});

test('getDailyUsage groups credits used for one date', () => {
    const usage = [{
        message_id: 101,
        timestamp: '2025-07-27T00:00:00.000Z',
        credits_used: 12.0
    }, {
        message_id: 102,
        timestamp: '2025-07-27T00:00:00.000Z',
        credits_used: 34.0
    }];

    const actual = getDailyUsage(usage);

    const expected = [{
        date: '27-07-2025',
        credits_used: 46.0
    }];
    expect(actual).toEqual(expected);
});
