import useSWR from 'swr'
const fetcher = (url, queryParams = '?limit=100') =>
  fetch(`${url}${queryParams}`).then((res) => res.json())

const IdToName = (id) => {
  const { data, error } = useSWR('/api/publications', fetcher)

  return data?.reduce((results, publication) => {
    if (publication.id === id) results.push(publication.publicationName)
    return results
  }, [])
}

module.exports = { IdToName }
