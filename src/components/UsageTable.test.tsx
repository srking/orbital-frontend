import {render, screen} from "@testing-library/react";
import {userEvent} from "@testing-library/user-event";
import {expect, test} from "@jest/globals";
import UsageTable from "@/components/UsageTable";
import {UsageRow} from "@/models";

test('displays correct table headers', async () => {
    render(<UsageTable data={[]} />)

    expect(screen.getByText('Message ID')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Report Name')).toBeInTheDocument();
    expect(screen.getByText('Credits Used')).toBeInTheDocument();
});

test('displays row when report name is provided', async () => {
    const data: UsageRow[] = [{
        messageID: 1001,
        timestamp: '29-04-2024 02:08',
        reportName: 'Tenant Obligations Report',
        creditsUsed: 79.0
    }]

    render(<UsageTable data={data} />);

    expect(screen.getByText(data[0].messageID)).toBeInTheDocument();
    expect(screen.getByText(data[0].timestamp)).toBeInTheDocument();
    expect(screen.getByText(data[0].reportName as string)).toBeInTheDocument();
    expect(screen.getByText(data[0].creditsUsed)).toBeInTheDocument();
});

test('displays row when report name is not provided', async () => {
    const data: UsageRow[] = [{
        messageID: 1002,
        timestamp: '29-04-2024 03:25',
        creditsUsed: 5.2
    }]

    render(<UsageTable data={data} />);

    expect(screen.getByText(data[0].messageID)).toBeInTheDocument();
    expect(screen.getByText(data[0].timestamp)).toBeInTheDocument();
    expect(screen.getByText(data[0].creditsUsed)).toBeInTheDocument();
});

const reportSortData: UsageRow[] = [{
    messageID: 1001,
    timestamp: '29-04-2024 02:08',
    reportName: 'B Report',
    creditsUsed: 2.0
}, {
    messageID: 1002,
    timestamp: '29-04-2024 03:08',
    reportName: 'A Report',
    creditsUsed: 2.0
}, {
    messageID: 1002,
    timestamp: '29-04-2024 03:08',
    reportName: 'C Report',
    creditsUsed: 1.0
}];

test('uses provided sort order initially', async () => {
    render(<UsageTable data={reportSortData} />);

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('sorts report names ascending on first click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} />);

    await user.click(screen.getByText('Report Name'))

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('sorts report names descending on second click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} />);

    await user.click(screen.getByText('Report Name'));

    await user.click(screen.getByText('Report Name 🔼'));

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});

test('uses provided sort order on third click', async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} />);

    await user.click(screen.getByText('Report Name'));

    await user.click(screen.getByText('Report Name 🔼'));

    await user.click(screen.getByText('Report Name 🔽'));

    expect(screen.getByText('A Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('C Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('multi-sort when shift clicked',  async () => {
    const user = userEvent.setup();

    render(<UsageTable data={reportSortData} />);

    await user.click(screen.getByText('Credits Used'));

    expect(screen.getByText('C Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('A Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    await user.keyboard('[ShiftLeft>]');
    await user.click(screen.getByText('Report Name'));

    expect(screen.getByText('C Report').compareDocumentPosition(screen.getByText('B Report'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('B Report').compareDocumentPosition(screen.getByText('A Report'))).toBe(Node.DOCUMENT_POSITION_PRECEDING);
});
