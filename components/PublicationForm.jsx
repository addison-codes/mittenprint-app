import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function PublicationForm() {
  const [value, setValue] = useState([])

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

  const createPublication = async (data) => {
    const { publicationName } = data
    try {
      await fetch('api/createPublication', {
        method: 'POST',
        body: JSON.stringify({ publicationName }),
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
      <form onSubmit={handleSubmit(createPublication)}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-bold text-red-800">
            Publication Name
          </label>
          <input
            {...register('publicationName', { required: 'Name is required' })}
            aria-invalid={errors.publication ? 'true' : 'false'}
            type="text"
            className="w-full px-3 py-2 text-gray-700 bg-white border rounded outline-none"
          />
          {errors.publicationName && (
            <p className="font-bold text-red-900">
              {errors.publicationName?.message}
            </p>
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
    </div>
  )
}
