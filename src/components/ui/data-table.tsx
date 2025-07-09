"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import clsx from "clsx"
import { Skeleton } from "./skeleton"

interface DataTableProps<TData, TValue> {
    loading?: boolean,
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    classNames?: {
        tableHeaderRow?: React.HTMLAttributes<HTMLTableRowElement>["className"],
        tableHead?: React.HTMLAttributes<HTMLTableCellElement>["className"],
        tableRow?: React.HTMLAttributes<HTMLTableRowElement>["className"],
        tableCell?: React.HTMLAttributes<HTMLTableCellElement>["className"],
    }
}

export function DataTable<TData, TValue>({
    loading = false,
    columns,
    data,
    classNames
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}
                            className={clsx(classNames?.['tableHeaderRow'])}
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}
                                        className={clsx(classNames?.['tableHead'])}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                className={clsx(classNames?.['tableRow'])}
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}
                                        className={clsx(classNames?.['tableCell'])}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        loading ? table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}
                                className={clsx(classNames?.['tableHeaderRow'])}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableCell key={header.id}
                                            className={clsx(classNames?.['tableHead'])}
                                        >
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
