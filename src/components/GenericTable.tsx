import React from 'react';
import {
    useReactTable,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    getPaginationRowModel
} from '@tanstack/react-table';

interface GenericTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T, any>[];
}

function GenericTable<T extends object>({ data, columns }: GenericTableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });


    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),


    });

    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                {table.getHeaderGroups().map((headerGroup, index) => (
                    <tr key={`${headerGroup.id}${index}`}>
                        {headerGroup.headers.map((header, index) => (
                            <th
                                onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                key={`${header.id}${index}`}
                                style={{
                                    border: '1px solid black',
                                    background: '#f2f2f2',
                                    padding: '8px',
                                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                }}
                            >

                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                    asc: ' 🔼',
                                    desc: ' 🔽',
                                }[header.column.getIsSorted() as string] ?? null}
                                {header.column.getCanFilter() ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={(header.column.getFilterValue() ?? '') as string}
                                            onChange={(e) =>
                                                header.column.setFilterValue(e.target.value)
                                            }
                                            placeholder={`Filter...`}
                                            style={{ marginTop: '5px' }}
                                        />
                                    </div>
                                ) : null}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id + 1}>
                        {row.getVisibleCells().map((cell, index) => (
                            <td
                                key={`${cell.id}${index}`}
                                style={{
                                    border: '1px solid black',
                                    padding: '8px',
                                }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <div style={{ display: 'flex', padding: '20px', width: '100%', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    ﹤
                </button>
                <span>
                    עמוד {table.getState().pagination.pageIndex + 1} מתוך{' '}
                    {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    ﹥
                </button>
            </div>
        </table>
    );
}

export default GenericTable;
