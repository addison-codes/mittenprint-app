import { getLocationById } from '../../../utils/Fauna'
export default async function handler(req, res) {
  const { id } = req.query
  if (req.method !== 'GET') {
    return res.status(405)
  }

  try {
    const location = await getLocationById(id)
    return res.status(200).json(location)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
}
