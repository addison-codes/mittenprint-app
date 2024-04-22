import React, { useState } from 'react'
import useSWR from 'swr'
// Get locations list from our temp directory (placed here manually after running routing query)
import tempData from '../temp/tempLocs'

import { Button } from 'flowbite-react'
import Uploader from './Uploader'

const XLSX = require('xlsx')

const Converter = () => {
  const [files, setFiles] = useState('')
  const fetcher = (url, queryParams = '') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())
  const { data, error, mutate } = useSWR(['/api/locations'], fetcher)
      let wb = XLSX.utils.book_new()


  // const handleChange = e => {
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(e.target.files[0], "UTF-8");
  //   fileReader.onload = e => {
  //     console.log("e.target.result", e.target.result);
  //     setFiles(e.target.result);
  //   };
  // };

  // TODO: Remove need for temp data

  // Commented out code for deployment to work - should return a blank xlsx file

  // console.log(tempData)
  // const locations = files[0]?.stops

  // console.log(locations)

  tempData.map((route, index) => {
    const locations = route?.stops

    // const array = [routeData]

    const routeData = {}
    if (locations) {
      const last = locations?.slice(-1)
      const first = locations[0]
      routeData.distance = Math.round(last[0].odometer * 0.000621371192)

      const start = new Date(first.eta)
      const end = new Date(last[0].eta)
      const time = new Date(end.getTime() - start.getTime())

      const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, time)),
        // Pull out parts of interest
        parts = [d.getUTCHours(), d.getUTCMinutes()],
        // Zero-pad
        formattedTime = parts.map((s) => String(s).padStart(2, '0')).join(':')

      routeData.travelTime = formattedTime
      const changeData = locations.map((location) => {
        // console.log('pre', location.odometer)
        const nameBreak = location.location.split('||')
        location.id = nameBreak[1]
        const fullData = data?.filter((fullLoc) => location.id === fullLoc.id)
        if (fullData) {
          // fullData[0].push({odometer: location.odometer})
          // console.log('full', fullData[0])
          return fullData[0]
        }
      })
      changeData.shift()
      changeData.pop()

      const mutatedData = changeData?.map((location) => {
        if (location) {
          location.fullAddr = encodeURIComponent(
            location.locationName + ' ' + location.address + ' ' + location.city
          )
          location.displayAddr = `= HYPERLINK("https://www.google.com/maps/dir/?api=1&destination=${location.fullAddr}","${location.address}")`
          location.publications.forEach((pub) => {
            pub.id === '365729015296688208'
              ? (location.lfgqty = pub.qty)
              : pub.id === '356106284452282435'
              ? (location.brwqty = pub.qty)
              : pub.id === '356104002546434115'
              ? (location.grnqty = pub.qty)
              : pub.id === '359102399771574358'
              ? (location.usqty = pub.qty)
              : pub.id === '358571074413133911'
              ? (location.mnqty = pub.qty)
              : pub.id === '354760964552261715'
              ? (location.lpqty = pub.qty)
              : pub.id === '375711781537972297'
              ? (location.shrqty = pub.qty)
              : pub.id === '354757604067508307'
              ? (location.revqty = pub.qty)
              : ''
          })
          return location
        }
      })
      mutatedData.push(routeData)
      console.log(mutatedData)

      // Comment this out to make the page load

      if (mutatedData) {
        let ws = XLSX.utils.json_to_sheet(mutatedData)
        XLSX.utils.book_append_sheet(wb, ws, mutatedData[0].address)
      }
    }
 
  })
  const getSheet = () => {

    XLSX.writeFile(wb, 'sequence.xlsx')
  }
  return (
    <div>
      {/* <Uploader handleChange={handleChange} /> */}

      <Button onClick={getSheet}>Get Sheet for</Button>
    </div>
  )
}

export default Converter
