import React, {useMemo} from 'react'
import DebouncedInput from './DebouncedInput'

export const DefaultFilter = ({ column, table}) => {
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
        className="border rounded shadow w-36"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows: { length }, id },
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
