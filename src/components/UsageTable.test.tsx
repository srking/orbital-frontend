import {render, screen} from "@testing-library/react";
import {userEvent} from "@testing-library/user-event";
import {expect, test} from "@jest/globals";
import UsageTable from "@/components/UsageTable";
import {UsageRow} from "@/models";

test('displays correct table headers', async () => {
    render(<UsageTable data={[]} pathname="/" searchParams={new URLSearchParams()} />)

    expect(screen.getByText('Message ID')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Report Name 📶')).toBeInTheDocument();
    expect(screen.getByText('Credits Used 📶')).toBeInTheDocument();
});

test('displays row when report name is provided', async () => {
    const data: UsageRow[] = [{
        message_id: 1001,
        timestamp: '2024-04-29T02:08:00Z',
        report_name: 'Tenant Obligations Report',
        credits_used: 79.0
    }]

    render(<UsageTable data={data} pathname="/" searchParams={new URLSearchParams()} />);

    expect(screen.getByText(data[0].message_id)).toBeInTheDocument();
    expect(screen.getByText('29-04-2024 02:08')).toBeInTheDocument();
    expect(screen.getByText(data[0].report_name as string)).toBeInTheDocument();
    expect(screen.getByText('79.00')).toBeInTheDocument();
});

test('displays row when report name is not provided', async () => {
    const data: UsageRow[] = [{
        message_id: 1002,
        timestamp: '2024-04-29T03:25:00Z',
        credits_used: 5.2
    }]

    render(<UsageTable data={data} pathname="/" searchParams={new URLSearchParams()}  />);

    expect(screen.getByText(data[0].message_id)).toBeInTheDocument();
    expect(screen.getByText('29-04-2024 03:25')).toBeInTheDocument();
    expect(screen.getByText('5.20')).toBeInTheDocument();
});

const reportSortData: UsageRow[] = [{
    message_id: 1001,
    timestamp: '2024-04-29T02:08:00Z',
    report_name: 'B Report',
    credits_used: 2.0
}, {
    message_id: 1002,
    timestamp: '2024-04-29T03:08:00Z',
    report_name: 'A Report',
    credits_used: 2.0
}, {
    message_id: 1002,
    timestamp: '2024-04-29T03:08:00Z',
    report_name: 'C Report',
    credits_used: 1.0
}];

test('uses provided sort order initially', async () => {
    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams()} />);

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('sorts report names ascending on first click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams()} />);

    await user.click(screen.getByText('Report Name 📶'))

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('sorts report names descending on second click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams()} />);

    await user.click(screen.getByText('Report Name 📶'));

    await user.click(screen.getByText('Report Name 🔼'));

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});

test('uses provided sort order on third click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams()} />);

    await user.click(screen.getByText('Report Name 📶'));

    await user.click(screen.getByText('Report Name 🔼'));

    await user.click(screen.getByText('Report Name 🔽'));

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('multi-sort when shift clicked',  async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams()} />);

    await user.click(screen.getByText('Credits Used 📶'));

    expect(screen.getByText('C Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('A Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    await user.keyboard('[ShiftLeft>]');
    await user.click(screen.getByText('Report Name 📶'));

    expect(screen.getByText('C Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('A Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});

test('uses sort options provided from URL',  async () => {
    render(<UsageTable data={reportSortData} pathname="/" searchParams={new URLSearchParams('sort=credits_used&order=asc&sort=report_name&order=asc')} />);

    expect(screen.getByText('C Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('A Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});

test('updates URL when sort changed', async () => {
    const historySpy = jest.spyOn(history, 'replaceState');
    const pathname = '/sample'

    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} pathname={pathname} searchParams={new URLSearchParams()} />);

    await user.click(screen.getByText('Credits Used 📶'));

    expect(historySpy).toHaveBeenCalledWith(null, '', '/sample?sort=credits_used&order=asc');

    await user.keyboard('[ShiftLeft>]');
    await user.click(screen.getByText('Report Name 📶'));

    expect(historySpy).toHaveBeenLastCalledWith(null, '', '/sample?sort=credits_used&order=asc&sort=report_name&order=asc');
});
