import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import Button from './Button'

// import tempData from "../temp/tempRoute.json"

const Request = () => {
  const [queryParams, setQueryParams] = useState('')

  const fetcher = (url, queryParams = '?limit=600') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    // ['/api/publications/locations/359102399771574358', queryParams],
    ['/tempRoute.json', queryParams],
    fetcher
  )

  useEffect(() => {
    setQueryParams('')
  }, [])

  const locations = []

  const services = []

  console.log(data)

  // data?.forEach(location => {
  //   locations.push({
  //     "name": location.locationName + '||' + location.id,
  //     "coordinates": [
  //       Number(location.coordinates.lng), Number(location.coordinates.lat)
  //     ]
  //   })
  //   services.push({
  //     "name": location.placeId,
  //     "location": location.locationName + '||' + location.id
  //   })
  // })

  data?.forEach(location => {
    locations.push({
      "name": location.original.locationName + '||' + location.original.id,
      "coordinates": [
        Number(location.original.coordinates.lng), Number(location.original.coordinates.lat)
      ]
    })
    services.push({
      "name": location.original.placeId,
      "location": location.original.locationName + '||' + location.original.id
    })
  })

  locations.push({
    "name": "Home",
    "coordinates": [
      -82.9277949,
      42.5545696
    ]
  })

  console.log('loc', locations)
  console.log('srv', services)

  // const locs = data?.map((loc, index) => {
  //   return (
  //     '&' +
  //     'destination' +
  //     (index + 1) +
  //     '=' +
  //     encodeURIComponent(loc.placeId) +
  //     ';' +
  //     loc.coordinates.lat +
  //     ',' +
  //     loc.coordinates.lng
  //   )
  // })

  // const locsUrl = locs?.join('')

  // const baseUrl =
  //   'https://wps.hereapi.com/v8/findsequence2?start=Pickup;42.5543306,-82.9290298'

  // const endUrl =
  //   '&end=Home;42.973922,-85.6787294,19&improveFor=time&departure=2023-01-20T12:30:00%2b01:00&mode=fastest;car;&apiKey=Jp-LmPJsLs7nQQFlIB-a4HpTAx4okyPMVMhhpmSgFzs'

  // const fullUrl = baseUrl + locsUrl + endUrl

  return (
    <div>
      {locations.map(location => {
        return <p key={location.name}>{location.name}</p>
      })}
      {/* <Button label="Submit" /> */}
    </div>
  )
}

export default Request
