const faunadb = require('faunadb')
const faunaClient = new faunadb.Client({
  secret: process.env.NEXT_PUBLIC_FAUNA_SECRET,
  domain: 'db.us.fauna.com',
})
const q = faunadb.query

const getLocations = async () => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('locations')), { size: 5000 }),
      q.Lambda('ref', q.Get(q.Var('ref')))
    )
  )
  const locations = data.map((location) => {
    location.id = location.ref.id
    location.data.id = location.id
    delete location.ref
    return location.data
  })
  return locations
}

const getLocationsByPublication = async (id) => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Match(q.Index('locationsByPublication'), id), { size: 5000 }),
      q.Lambda('ref', q.Get(q.Var('ref')))
    )
  )
  const locations = data.map((location) => {
    location.id = location.ref.id
    location.data.id = location.id
    delete location.ref
    return location.data
  })
  return locations
}

const getPublications = async () => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('publications'))),
      q.Lambda('ref', q.Get(q.Var('ref')))
    )
  )
  const publications = data.map((publication) => {
    publication.id = publication.ref.id
    publication.data.id = publication.id
    delete publication.ref
    return publication.data
  })
  return publications
}

const getPublicationById = async (id) => {
  const publication = await faunaClient.query(
    q.Get(q.Ref(q.Collection('publications'), id))
  )
  publication.id = publication.ref.id
  delete publication.ref
  return publication
}

const getLocationById = async (id) => {
  const location = await faunaClient.query(
    q.Get(q.Ref(q.Collection('locations'), id))
  )
  location.id = location.ref.id
  delete location.ref
  return location
}

const createLocation = async (
  locationName,
  address,
  city,
  state,
  zip,
  placeId,
  coordinates,
  publications,
  county
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
        publications,
        county
      }
    })
  )
}

const updateLocation = async (
  id,
  locationName,
  address,
  city,
  state,
  zip,
  placeId,
  coordinates,
  publications
) => {
  return await faunaClient.query(
    q.Update(q.Ref(q.Collection('locations'), id), {
      data: {
        locationName,
        address,
        city,
        state,
        zip,
        placeId,
        coordinates,
        publications,
      },
    })
  )
}

const createPublication = async (publicationName) => {
  return await faunaClient.query(
    q.Create(q.Collection('publications'), {
      data: {
        publicationName,
        active: true,
      },
    })
  )
}

module.exports = {
  getLocations,
  getPublications,
  getPublicationById,
  getLocationById,
  updateLocation,
  createLocation,
  createPublication,
  getLocationsByPublication,
}
