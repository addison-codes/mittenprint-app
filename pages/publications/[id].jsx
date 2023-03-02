import Head from 'next/head'
import Table from '../../components/Table'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useState } from 'react'
import Title from '../../components/Title'
import Button from '../../components/Button'

const Publication = () => {
  const router = useRouter()
  const { id } = router.query

  const [queryParams, setQueryParams] = useState('')

  const fetcher = (url, queryParams = '?limit=100') =>
    fetch(`${url}${queryParams}`).then((res) => res.json())

  const { data, error, mutate } = useSWR(`/api/publications/${id}`, fetcher)

  return (
    <div>
      <Head>
        <title>{data?.data?.publicationName}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 pt-6 mx-auto">
        <Title text={data?.data?.publicationName} />
        <Button label="Add Location" link={`/new-location?publication=${id}`} />
        <Table id={id} />
      </main>

      <footer></footer>
    </div>
  )
}

export default Publication
