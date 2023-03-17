import Head from 'next/head'
import Converter from '../components/Converter'
import Request from '../components/Request'
import useSWR from 'swr'
import RouteTable from '../components/RouteTable'

export default function Home() {
  const fetcher = (url, queryParams = '?limit=100') =>
  fetch(`${url}${queryParams}`).then((res) => res.json())

const { data, error, mutate } = useSWR(`/api/publications`, fetcher)

const publications = data


  return (
    <div>
      <Head>
        <title>Request</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="container mx-auto mt-6">
        <h1 className="mb-4 text-2xl text-red-800">Create a Route</h1>
        {/* <RouteTable /> */}
        <Request />
        {/* <Converter /> */}
      </section>
    </div>
  )
}
