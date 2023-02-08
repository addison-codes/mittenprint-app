import { createLocation } from '../../utils/Fauna'
export default async function handler(req, res) {
  const {
    locationName,
    address,
    city,
    state,
    zip,
    placeId,
    coordinates,
    publications,
  } = req.body
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }
  try {
    const createdLocation = await createLocation(
      locationName,
      address,
      city,
      state,
      zip,
      placeId,
      coordinates,
      publications
    )
    return res.status(200).json(createdLocation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
}
