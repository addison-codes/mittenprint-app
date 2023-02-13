import React from 'react'
import useSWR from 'swr'
// Get locations list from our temp directory (placed here manually after running routing query)
import tempData from '../temp/tempLocs'

import { Button } from 'flowbite-react'

const XLSX = require('xlsx')


const Converter = () => {
  const fetcher = (url, queryParams = '') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    ['/api/publications/locations/356104002546434115'],
    fetcher
  )


  const locations = tempData?.results[0]?.waypoints

  const changeData = locations.map( (location) => {
    const fullData = data?.filter( fullLoc => location.id === fullLoc.placeId)
    console.log(fullData)
    return(fullData?.length === 0 ? '' : fullData[0])

  }) 
  changeData.shift()
  changeData.pop()
  console.log(changeData)

  const getSheet = () => {
    let ws = XLSX.utils.json_to_sheet(changeData)
    let wb = XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(wb, ws, 'Route Order')
    XLSX.writeFile(wb, 'sequence.xlsx')
  }
  return <div>
    <Button onClick={getSheet}>Get Sheet</Button>
  </div>
}

export default Converter
