import Head from 'next/head'
import useSWR from 'swr'
import RouteTable from '../components/RouteTable'
import { useState } from 'react';
import Title from '../components/Title'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const [publication, setPublication] = useState()
  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())

  const { data, error, mutate } = useSWR(`/api/publications`, fetcher)

  const publications = data
  const { data: session } = useSession()

  const handleChange = (e) => {
    setPublication(e.target.value)
  }

  return (
    <div>
      <Head>
        <title>Request</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session?.user.role === undefined ? (
        <Title text={'You must be signed in to access this data'} />
      ) : (
        <section className="container mx-auto mt-6">
          <h1 className="mb-4 text-2xl text-red-800">Create a Route</h1>
          <h2 className="mb-4 text-xl">Select a Publication</h2>
          <select
            onChange={handleChange}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
          >
            {publications?.map((pub) => {
              return (
                <option key={pub.id} value={pub.id}>
                  {pub.publicationName}
                </option>
              )
            })}
          </select>
          <RouteTable publicationId={publication} />
        </section>
      )}
    </div>
  )
}
