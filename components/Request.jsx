import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const Request = () => {
  const [queryParams, setQueryParams] = useState('')

  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())
  const { data, error, mutate } = useSWR(
    ['/api/locations', queryParams],
    fetcher
  )
  useEffect(() => {
    setQueryParams('')
  }, [])

  const locs = data?.map((loc, index) => {
    return (
      '&' +
      'destination' +
      (index + 1) +
      '=' +
      encodeURIComponent(loc.placeId) +
      ';' +
      loc.coordinates
    )
  })

  const locsUrl = locs?.join('')

  const baseUrl =
    'https://wps.hereapi.com/v8/findsequence2?start=Pickup;42.5543306,-82.9290298'

  const endUrl =
    '&end=Home;42.973922,-85.6787294,19&improveFor=time&departure=2023-01-20T12:30:00%2b01:00&mode=fastest;car;&apiKey=Jp-LmPJsLs7nQQFlIB-a4HpTAx4okyPMVMhhpmSgFzs'

  const fullUrl = baseUrl + locsUrl + endUrl

  return <div>{fullUrl}</div>
}

export default Request
