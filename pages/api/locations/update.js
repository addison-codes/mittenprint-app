import { getLocationById, updateLocation } from '../../../utils/Fauna'
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }

  const {
    locationName,
    address,
    city,
    state,
    zip,
    placeId,
    id,
    coordinates,
    publications,
  } = req.body
  const existingRecord = await getLocationById(id)
  // console.log(existingRecord)
  if (!existingRecord || existingRecord.id !== id) {
    res.statusCode = 404
    return res.json({ msg: 'Record not found' })
  }

  try {
    const updated = await updateLocation(
      id,
      locationName,
      address,
      city,
      state,
      zip,
      placeId,
      coordinates,
      publications
    )
    console.log(updated)
    return res.status(200).json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
}
