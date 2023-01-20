const faunadb = require('faunadb')
const faunaClient = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNA_SECRET,
  domain: 'db.us.fauna.com',
})
const q = faunadb.query

const getLocations = async () => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('locations'))),
      q.Lambda('ref', q.Get(q.Var('ref')))
    )
  )
  const locations = data.map((location) => {
    location.id = location.ref.id
    delete location.ref
    return location.data
  })
  console.log('test', locations)
  return locations
}

const createLocation = async (
  locationName,
  address,
  city,
  state,
  zip,
  placeId,
  coordinates
) => {
  return await faunaClient.query(
    q.Create(q.Collection('locations'), {
      data: {
        locationName,
        address,
        city,
        state: 'MI',
        zip,
        placeId,
        coordinates,
        active: true,
      },
    })
  )
}

module.exports = {
  getLocations,
  createLocation,
}
