import { createLocation } from '../../utils/Fauna'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

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
  if (session.user.role === 'admin') {
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
  } else {
    res.status(401)
  }
}
