import { createPublication } from '../../utils/Fauna'
export default async function handler(req, res) {
  const { publicationName } = req.body
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }
  try {
    const createdLocation = await createPublication(publicationName)
    return res.status(200).json(createdLocation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
}
