import useSWR from 'swr'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { getPublicationById } from '/utils/Fauna'
import { IdToName } from '/utils/IdToName'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  enableMultiRowSelection,
  onChangeFn,
} from '@tanstack/react-table'
import IndeterminateCheckbox from './IndeterminateCheckbox'
import Button from './Button'

const Table = ({ range, id, publication }) => {
  const [sorting, setSorting] = useState([])
  const [queryParams, setQueryParams] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    [
      publication
        ? '/api/publications'
        : id
        ? `/api/publications/locations/${id}`
        : '/api/locations',
      queryParams,
    ],
    fetcher
  )

  useEffect(() => {
    if (range == 'global') {
      setQueryParams('')
    }
  }, [])

  const columns = useMemo(() =>
    publication
      ? [
          {
            id: 'select',
            header: ({ table }) => (
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            ),
            cell: ({ row }) => (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            ),
          },
          {
            accessorKey: `${publication ? 'publicationName' : 'locationName'}`,
            header: () => 'Name',
            // cell: (info) => info.renderValue(),
            cell: ({ row }) => (
              <Link
                href={`${
                  publication
                    ? `/publications/${row.original.id}`
                    : `/locations/${row.original.id}`
                }`}
              >
                {publication
                  ? row.original.publicationName
                  : row.original.locationName}
              </Link>
            ),
          },
        ]
      : [
          {
            id: 'select',
            header: ({ table }) => (
              <IndeterminateCheckbox
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            ),
            cell: ({ row }) => (
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            ),
          },
          {
            accessorKey: `${publication ? 'publicationName' : 'locationName'}`,
            header: () => 'Name',
            // cell: (info) => info.renderValue(),
            cell: ({ row }) => (
              <Link
                href={`${
                  publication
                    ? `/publications/${row.original.id}`
                    : `/locations/${row.original.id}`
                }`}
              >
                {publication
                  ? row.original.publicationName
                  : row.original.locationName}
              </Link>
            ),
          },
          {
            accessorKey: 'address',
            header: () => 'Address',
            cell: (info) => info.renderValue(),
          },
          {
            accessorKey: 'city',
            header: () => 'City',
            cell: (info) => info.renderValue(),
          },
          {
            accessorKey: 'zip',
            header: () => 'Zip Code',
            cell: (info) => info.renderValue(),
          },
          {
            accessorKey: 'publications',
            header: () => 'Publications',
            cell: ({ row }) => {
              return row.original.publications.map((e) => {
                const list = ''
                console.log(IdToName(e.id))
                list += IdToName(e.id) + ' '
                console.log(list)
                return (
                  <span
                    key={list}
                    className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                  >
                    {list}
                  </span>
                )
              })
            },
          },
        ]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableMultiRowSelection,
    initialState: { pagination: { pageSize: 30 } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    debugTable: true,
  })
  if (error)
    return (
      <div className="h-screen m-8 text-4xl text-center text-red-200">
        Failed to load data: {error.message}
      </div>
    )
  if (!data)
    return (
      <div className="h-screen m-8 text-4xl text-center text-green-200">
        <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
          <circle
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            cx="50"
            cy="50"
            r="44"
            style={{ opacity: 0.5 }}
          />
          <circle
            fill="#fff"
            stroke="#e74c3c"
            strokeWidth="3"
            cx="8"
            cy="54"
            r="6"
          />
        </svg>
        Loading...
      </div>
    )

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/90 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="bg-white border-b dark:bg-gray-800/95 dark:border-gray-700"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-2 my-4">
        <button
          className="p-1 border rounded"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="p-1 border rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="p-1 border rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="p-1 border rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[30, 50, 100, 200].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        {Object.keys(rowSelection).length} of{' '}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
      {/* <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={() => {
          const selected = table.getSelectedRowModel().flatRows
          selected.map((selection) => {
            console.log(selected)
          })
        }}
      >
        Log Selected
      </button> */}
    </div>
  )
}

export default Table
