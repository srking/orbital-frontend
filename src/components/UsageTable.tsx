'use client';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortDirection,
    useReactTable
} from "@tanstack/react-table";
import {UsageRow} from "@/models";
import useUrlSortOptions from "@/hooks/useUrlSortOptions";
import {getDateHourMinuteFormat} from "@/helpers/helpers";

function getHeaderSortIcon(direction: SortDirection | false): string {
    switch (direction) {
        case 'asc':
            return ' 🔼';
        case 'desc':
            return ' 🔽';
        default:
            return ' 📶';
    }
}

function getHeaderSortTitle(nextSortOrder: SortDirection | false): string {
    switch (nextSortOrder) {
        case 'asc':
            return 'Sort ascending (shift-click to multi-sort)';
        case 'desc':
            return 'Sort descending (shift-click to multi-sort)';
        default:
            return 'Clear sort';
    }
}

export default function UsageTable({ data, pathname, searchParams }: { data: UsageRow[], pathname: string, searchParams: URLSearchParams }) {

    const columnHelper = createColumnHelper<UsageRow>();

    const columns = [
        columnHelper.accessor('message_id', {
            enableSorting: false,
            header: 'Message ID',
        }),
        columnHelper.accessor('timestamp', {
            enableSorting: false,
            header: 'Timestamp',
            cell: ({ row }) => getDateHourMinuteFormat(row.original.timestamp)
        }),
        columnHelper.accessor('report_name', {
            enableSorting: true,
            header: 'Report Name',
            sortDescFirst: false,
            sortUndefined: 'last',
        }),
        columnHelper.accessor('credits_used', {
            enableSorting: true,
            header: 'Credits Used',
            sortDescFirst: false,
            cell: ({ row }) => row.original.credits_used.toFixed(2),
        }),
    ];

    const [sorting, setSorting] = useUrlSortOptions({ pathname, searchParams });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableMultiSort: true,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <table className="table-fixed border-collapse w-full">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="text-left">
                                <div
                                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                    onClick={header.column.getToggleSortingHandler()}
                                    title={header.column.getCanSort() ? getHeaderSortTitle(header.column.getNextSortingOrder()) : undefined}
                                >
                                    {`${flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}${header.column.getCanSort() ? getHeaderSortIcon(header.column.getIsSorted()) : ''}`}

                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="even:bg-gray-50 odd:bg-white">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
