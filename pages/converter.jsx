import Head from 'next/head'
import Converter from '../components/Converter'

export default function Home() {

  return (
    <div>
      <Head>
        <title>Request</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="container mx-auto mt-6">
        <h1 className="mb-4 text-2xl text-red-800">Create a Route</h1>
        <Converter />
      </section>
    </div>
  )
}
