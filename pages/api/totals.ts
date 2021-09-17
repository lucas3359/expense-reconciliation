import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import SplitService from '../../services/splitService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401)
  }

  const splitService = new SplitService()
  const totals = await splitService.getTotals()

  return res.status(200).json(totals)
}
