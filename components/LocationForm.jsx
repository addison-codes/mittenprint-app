import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LocationForm({ location }) {
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
    const { locationName, address, city, zip } = data
    try {
      await fetch('api/createLocation', {
        method: 'POST',
        body: JSON.stringify({ locationName, address, city, name, zip }),
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
    <form onSubmit={handleSubmit(createSnippet)}>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-bold text-red-800">
          Location Name
        </label>
        <input
          {...register('locationName', { required: 'Name is required' })}
          aria-invalid={errors.location ? 'true' : 'false'}
          type="text"
          className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
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
        />
        {errors.zip && (
          <p className="font-bold text-red-900">{errors.zip?.message}</p>
        )}
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
  )
}
