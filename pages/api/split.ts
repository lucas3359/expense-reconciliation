import { NextApiRequest, NextApiResponse } from 'next'
import SplitImport from '../../model/splitImport'
import { getSession } from 'next-auth/client'
import SplitService from '../../services/splitService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const body: SplitImport = JSON.parse(req.body)

    const splitService = new SplitService()

    const split = await splitService.updateSplit(body)

    res.status(201).json(split)
  } else {
    res.status(401)
  }
  res.end()
}
