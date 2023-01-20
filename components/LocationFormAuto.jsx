import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId,
} from 'react-places-autocomplete'

export default function LocationFormAuto() {
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  })
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [name, setName] = useState('')
  const [inputs, setInputs] = useState([])
  const [placeId, setPlaceId] = useState([])

  useEffect(() => {
    setInputs(document.querySelectorAll('input'))
  }, [])

  const handleSelect = async (value, placeId, suggestion) => {
    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])
    const [place] = await geocodeByPlaceId(placeId)
    console.log(place)
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

    inputs.forEach((e) => e.dispatchEvent(new Event('click')))
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
  const router = useRouter()

  const createSnippet = async (data) => {
    const { locationName, address, city, zip, coordinates, placeId } = data
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

  // const updateSnippet = async (data) => {
  //     const { locationName, address, city, name, zip } = data;
  //     const id = snippet.id;
  //     try {
  //         await fetch('api/updateSnippet', {
  //             method: 'PUT',
  //             body: JSON.stringify({ locationName, address, city, name, zip, id}),
  //             headers: {
  //                 'Content-Type': 'application/json'
  //             },
  //         })
  //         router.push('/');
  //     } catch (err) {
  //         console.error(err);
  //     }
  // };

  return (
    <div>
      <form onSubmit={handleSubmit(createSnippet)}>
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
                <p>Latitude: {coordinates.lat}</p>
                <p>Longitude: {coordinates.lng}</p>

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
                      <div {...getSuggestionItemProps(suggestion, { style })}>
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
            {...register('locationName', { required: 'Name is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={name ?? 'Waiting'}
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
            {...register('address', { required: 'Address is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={address ?? 'Waiting'}
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
            {...register('city', { required: 'City is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={city ?? 'Waiting'}
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
            {...register('zip', { required: 'Zip Code is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
            value={zip ?? 'Waiting'}
          />
          {errors.zip && (
            <p className="font-bold text-red-900">{errors.zip?.message}</p>
          )}
        </div>
        <div className="mb-4">
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
