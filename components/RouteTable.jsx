import useSWR from 'swr'
import Link from 'next/link'
import { useState, useMemo, useEffect, useReducer } from 'react'
import { getPublicationById } from '/utils/Fauna'
import { IdToName } from '/utils/IdToName'
import DebouncedInput from './DebouncedInput'

import { Select } from 'flowbite-react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  PaginationState,
  getPaginationRowModel,
  enableMultiRowSelection,
  onChangeFn,
  getFilteredRowModel,
  getPreFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  FilterFn,
  FilterFns,
} from '@tanstack/react-table'
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

import IndeterminateCheckbox from './IndeterminateCheckbox'
import Button from './Button'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}


const Table = ({ range, id, publication }) => {
  const [sorting, setSorting] = useState([])
  const [queryParams, setQueryParams] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const [columnFilters, setColumnFilters] = useState(
    []
  )


  const rerender = useReducer(() => ({}), {})[1]


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
  }, [range])

  const columns = useMemo(
    () =>
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
              accessorKey: `${
                publication ? 'publicationName' : 'locationName'
              }`,
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
              accessorKey: `${
                publication ? 'publicationName' : 'locationName'
              }`,
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
              filterFn: 'fuzzy',
              filter: "includes"
            },
            {
              accessorKey: 'address',
              header: () => 'Address',
              cell: (info) => info.renderValue(),
              enableColumnFilter: false,
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
              Filter: SelectColumnFilter,
              filter: "includes",
              cell: ({ row }) => {
                return row.original.publications.map((e) => {
                  const list = ''
                  list += IdToName(e.id) + ' '
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
          ],
    [publication]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      rowSelection,
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiRowSelection,
    initialState: { pagination: { pageSize: 30 } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPreFilteredRowModel: getPreFilteredRowModel,
    debugTable: true,
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'locationName') {
      if (table.getState().sorting[0]?.id !== 'locationName') {
        table.setSorting([{ id: 'locationName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id, table])


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
                      <>
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
                          <div>
                      {header.column.getCanFilter() ? (
                            <DefaultFilter column={header.column} table={table} />
                        ) : null}
                          </div>
                      </>
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

      <div className="pt-2 text-gray-900 font-small whitespace-nowrap dark:text-white">
        {Object.keys(rowSelection).length} of{' '}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>

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
        <Select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[30, 50, 100, 200].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}
              className="text-gray-900 font-small whitespace-nowrap dark:text-white"
            >
              Show {pageSize}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

const DefaultFilter = ({ column, table}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues(), column, firstValue]
  )

    console.log(sortedUniqueValues)

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border rounded shadow"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border rounded shadow"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : typeof firstValue === 'object' ? (
    <div>
    <div className="flex space-x-2">
<SelectColumnFilter column={column} table={table} />
</div>
</div>
    ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}



const SelectColumnFilter = ({ column,
  column: { filterValue, setFilter, preFilteredRows, id },
 }) => {
   // Use preFilteredRows to calculate the options
 const options = useMemo(() => {
  const options = new Set();
  preFilteredRows?.forEach((row) => {
    options.add(row.values[id]); 
  });
  return [...options.values()]; 
}, [id, preFilteredRows]);

// UI for Multi-Select box
return (
  <select
    value={filterValue}
    onChange={(e) => {
      setFilter(e.target.value || undefined);
    }}
  >
    <option value="">All</option>
    {options.map((option, i) => (
      <option key={i} value={option}>
        {option}
      </option>
    ))}
  </select>
);
}


export default Table
