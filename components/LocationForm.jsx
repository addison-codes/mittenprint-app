import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'

export default function LocationForm({ location }) {
  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())

  const { data, error, mutate } = useSWR(`/api/publications`, fetcher)

  const publications = data

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      locationName: location ? location.locationName : '',
      address: location ? location.address : '',
      city: location ? location.city : '',
      state: location ? location.state : '',
      zip: location ? location.zip : '',
      id: location ? location.id : '',
      // publications: location ? location.publications : '',
    },
  })
  const router = useRouter()

  const handleCheck = async (e) => {
    e.target.checked
      ? !location.publications
        ? (location.publications = [{ id: e.target.id, qty: 25 }])
        : location.publications.push({
            id: e.target.id,
            qty: 25,
          })
      : location.publications.splice(
          location.publications.findIndex((a) => a.id === e.target.id),
          1
        )
  }

  // const createSnippet = async (data) => {
  //   const { locationName, address, city, zip } = data
  //   try {
  //     await fetch('api/createLocation', {
  //       method: 'POST',
  //       body: JSON.stringify({ locationName, address, city, zip }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     router.reload()
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  const updateLocation = async (data) => {
    const { id, publications } = location
    const { locationName, address, city, state, zip } = data
    try {
      await fetch('/api/locations/update', {
        method: 'PUT',
        body: JSON.stringify({
          locationName,
          address,
          city,
          state,
          zip,
          id,
          publications,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(updateLocation)}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Location Name
          </label>
          <input
            {...register('locationName', { required: 'Name is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.city && (
            <p className="font-bold text-red-900">{errors.city?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            State
          </label>
          <input
            {...register('state', { required: 'State is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.state && (
            <p className="font-bold text-red-900">{errors.state?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Zip Code
          </label>
          <input
            {...register('zip', { required: 'Zip Code is required' })}
            aria-invalid={errors.location ? 'true' : 'false'}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.zip && (
            <p className="font-bold text-red-900">{errors.zip?.message}</p>
          )}
        </div>
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

              location.publications
                ? location.publications.find((e) => e.id === publication.id)
                  ? (checked = true)
                  : (checked = false)
                : (checked = false)

              return (
                <li
                  key={publication.id}
                  className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
                >
                  <div className="flex items-center pl-3">
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
                    </label>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* <select
            multiple
            {...register('publications')}
            aria-invalid={errors.location ? 'true' : 'false'}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {publications.map((publication) => (
              <option key={publication.id} value={publication.id}>
                {publication.publicationName}
              </option>
            ))}
          </select>
          {errors.publications && (
            <p className="font-bold text-red-900">
              {errors.publications?.message}
            </p>
          )} */}
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
