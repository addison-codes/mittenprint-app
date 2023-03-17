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
    ['/api/publications/locations/359102399771574358'],
    fetcher
  )

  // TODO: Remove need for temp data

  // Commented out code for deployment to work - should return a blank xlsx file

// console.log(tempData)
  const locations = tempData[2]?.stops
  // console.log(locations)

  const changeData = locations.map( (location) => {
    // console.log(location)
    const nameBreak = location.location.split('||')
    // console.log(nameBreak)
    location.name = `<a href="${nameBreak[0]}`
    location.id = nameBreak[1]
    const fullData = data?.filter( fullLoc => location.id === fullLoc.id)
    if (fullData) {
      return(fullData[0])

    }
  }) 
  changeData.shift()
  changeData.pop()
  const mutatedData = changeData?.map(location => {
    if (location){
      location.address = `= HYPERLINK("https://google.com/maps/place/?q=place_id:${location.placeId}","Navigate")`
      location.publications.forEach(pub => {
        pub.id === "359102399771574358" ? (location.mn = pub.id, location.mnqty = pub.qty) : pub.id === "356106284452282435" ? (location.scqty = pub.qty) : ''
      });
      return location

    }
  })
  console.log(mutatedData)

  const getSheet = () => {
    let ws = XLSX.utils.json_to_sheet(mutatedData)
    let wb = XLSX.utils.book_new()
  
    XLSX.utils.book_append_sheet(wb, ws, 'Route Order')
    XLSX.writeFile(wb, 'sequence.xlsx')
  }
  return <div>
    <Button onClick={getSheet}>Get Sheet</Button>
  </div>
}

export default Converter
