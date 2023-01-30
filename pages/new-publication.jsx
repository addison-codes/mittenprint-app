import Head from 'next/head'
import PublicationForm from '../components/PublicationForm'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Add New Publication</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg p-8 mx-auto my-8 bg-white border-b shadow-md sm:rounded-lg dark:bg-gray-800/95 dark:border-gray-700">
        <h1 className="mb-4 text-2xl text-red-800">New Publication</h1>
        <PublicationForm />
      </main>
    </div>
  )
}
