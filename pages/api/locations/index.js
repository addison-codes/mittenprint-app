import { getLocations } from '../../../utils/Fauna'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (session.user.role === 'admin') {
    if (req.method !== 'GET') {
      return res.status(405)
    }
  
    try {
      const locations = await getLocations()
      return res.status(200).json(locations)
    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Something went wrong.' })
    }
  } else {
    res.status(401)
  }
}
