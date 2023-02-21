import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId,
} from 'react-places-autocomplete'
import useSWR from 'swr'

export default function LocationFormAuto() {
  const router = useRouter()

  const assignedPublications = [
    {
      id: router.query.publication,
      qty: 25,
    },
  ]
// TODO: Consolidate state
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  })
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [name, setName] = useState('')
  const [placeId, setPlaceId] = useState([])
  const [assignedPubs, setAssignedPubs] = useState([]) 

  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())

  const { data, error, mutate } = useSWR(`/api/publications`, fetcher)

  console.log(data)

  const publications = data


  router.query.publication && assignedPubs.length === 0 ? (
    setAssignedPubs([
    {
      id: router.query.publication,
      qty: 25
    },
    ...assignedPubs
  ]) ): ''

  console.log(assignedPubs)


  const handleSelect = async (value, placeId, suggestion) => {
    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])
    const [place] = await geocodeByPlaceId(placeId)
    const name = suggestion?.formattedSuggestion?.mainText
    const { long_name: postalCode = '' } =
      place.address_components.find((c) => c.types.includes('postal_code')) ||
      {}
    const { short_name: city = '' } =
      place.address_components.find((c) => c.types.includes('political')) || {}
    const { short_name: streetNumber = '' } =
      place.address_components.find((c) => c.types.includes('street_number')) ||
      {}
    const { short_name: street = '' } =
      place.address_components.find((c) => c.types.includes('route')) || {}
    const address = streetNumber + ' ' + street
    setName(name)
    setAddress(address)
    setZip(postalCode)
    setCoordinates(latLng)
    setCity(city) 
    setLocation(value)
    setPlaceId(placeId)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   locationName: location ? location.data.locationName : '',
    //   address: location ? location.data.address : '',
    //   city: location ? location.data.city : '',
    //   name: location ? location.data.name : '',
    //   zip: location ? location.data.zip : '',
    // },
  })

  const createLocation = async (data) => {
    // const { locationName, address, city, zip, coordinates, placeId } = data
    const publications = assignedPubs
    console.log(publications)
    const locationName = name
    try {
      await fetch('api/createLocation', {
        method: 'POST',
        body: JSON.stringify({
          locationName,
          address,
          city,
          zip,
          coordinates,
          placeId,
          publications,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      router.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCheck = async (e) => {
    e.target.checked
      ? setAssignedPubs([
        { id: e.target.id,
        qty: 25
      },
      ...assignedPubs
      ])
      : 
      setAssignedPubs(
        assignedPubs.filter(a => {
          a.id !== e.target.id})
      )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(createLocation)}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Location Search
          </label>
          <PlacesAutocomplete
            value={location}
            onChange={setLocation}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
                  {...getInputProps({
                    placeholder: 'Type address',
                    autoFocus: true,
                  })}
                />

                <div>
                  {loading ? <div>...loading</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? '#41b6e6' : '#000',
                    }
                    return (
                      <div
                        key={suggestion.description}
                        {...getSuggestionItemProps(suggestion, { style })}
                      >
                        {suggestion.description}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Location Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            defaultValue={name ?? 'Waiting'}
          />
          {errors.locationName && (
            <p className="font-bold text-red-900">
              {errors.locationName?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Address
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            defaultValue={address ?? 'Waiting'}
          />
          {errors.address && (
            <p className="font-bold text-red-900">{errors.address?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            City
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            defaultValue={city ?? 'Waiting'}
          />
          {errors.city && (
            <p className="font-bold text-red-900">{errors.city?.message}</p>
          )}
        </div>
        {/* <div className="mb-4">
        <label className="block mb-1 text-sm font-bold text-red-800">
          State
        </label>
        <input
          {...register('state', { required: 'State is required' })}
          aria-invalid={errors.location ? 'true' : 'false'}
          type="text"
          className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
        />
        {errors.state && (
          <p className="font-bold text-red-900">{errors.state?.message}</p>
        )}
      </div> */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Zip Code
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            defaultValue={zip ?? 'Waiting'}
          />
          {errors.zip && (
            <p className="font-bold text-red-900">{errors.zip?.message}</p>
          )}
        </div>
        {/* <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Place ID
          </label>
          <input
            {...register('placeId', { required: 'Zip Code is required' })}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={placeId ?? 'Waiting'}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Coordinates
          </label>
          <input
            {...register('coordinates', { required: 'Zip Code is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={coordinates.lat + ',' + coordinates.lng ?? 'Waiting'}
          />
        </div> */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Publications
          </label>
          <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {/* Map through all publications to see if their id matches this location's assigned publications */}
            {publications?.map((publication) => {
              let checked = false
              {
                /* If the location has publications assigned we check the id against the current publication, if it is a match we set checked = true  */
              }

              const match = assignedPubs.find(({id}) => id === publication.id)

              assignedPubs
                ? match
                  ? (checked = true)
                  : (checked = false)
                : ''

              return (
                <li
                  key={publication.id}
                  className="flex w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                >
                  <div className="flex items-center pl-3">
                  {/* TODO: make checkbox readonly if there are query params for publication */}
                    <input
                      id={publication.id}
                      defaultChecked={checked}
                      type="checkbox"
                      value={publication}
                      onChange={handleCheck}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={publication.id}
                      className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {publication.publicationName}
                      {/* {console.log(assignedPubs.find(a => ))} */}
                    </label>
                    <label
                      className="w-full py-3 mr-2 text-sm font-medium text-right text-gray-900 dark:text-gray-300"
                    >
                      Qty
                    </label>
                    <input className='bg-gray-50 mr-1  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={e => {
                      const updatedPubs = assignedPubs.map(assignedPub => {
                      if (assignedPub.id === publication.id) { return {...assignedPub, qty: parseInt(e.target.value)}}
                      return assignedPub
                    })
                    setAssignedPubs(updatedPubs)}}  defaultValue={match?.qty} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <button
          className="px-4 py-2 mr-2 font-bold text-white bg-red-800 rounded hover:bg-red-900 focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save
        </button>
        <Link href="/">
          <a className="inline-block px-4 py-2 mt-3 font-bold text-white bg-red-800 rounded hover:bg-red-900 focus:outline-none focus:shadow-outline">
            Cancel
          </a>
        </Link>
      </form>
    </div>
  )
}
