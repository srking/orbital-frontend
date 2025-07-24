'use client';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel, SortDirection,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {UsageRow} from "@/models";
import {useState} from "react";

function getHeaderSortIcon(direction: SortDirection | false): string | null {
    switch (direction) {
        case 'asc':
            return ' 🔼';
        case 'desc':
            return ' 🔽';
        default:
            return null;
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

export default function UsageTable({ data }: { data: UsageRow[] }) {

    const columnHelper = createColumnHelper<UsageRow>();

    const columns = [
        columnHelper.accessor('messageID', {
            enableSorting: false,
            header: 'Message ID',
        }),
        columnHelper.accessor('timestamp', {
            enableSorting: false,
            header: 'Timestamp',
        }),
        columnHelper.accessor('reportName', {
            enableSorting: true,
            header: 'Report Name',
            sortDescFirst: false,
            sortUndefined: 'last',
        }),
        columnHelper.accessor('creditsUsed', {
            enableSorting: true,
            header: 'Credits Used',
            sortDescFirst: false,
        }),
    ];

    const [sorting, setSorting] = useState<SortingState>([]);

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
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                <div
                                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                    onClick={header.column.getToggleSortingHandler()}
                                    title={header.column.getCanSort() ? getHeaderSortTitle(header.column.getNextSortingOrder()) : undefined}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {getHeaderSortIcon(header.column.getIsSorted())}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
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
