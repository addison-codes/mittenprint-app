import { getLocationsByPublication } from '../../../utils/Fauna'
export default async function handler(req, res) {
  const { id } = req.query
  if (req.method !== 'GET') {
    return res.status(405)
  }

  try {
    const locations = await getLocationsByPublication(id)
    return res.status(200).json(locations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
}
