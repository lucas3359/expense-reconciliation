import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const transactions: transactions[] = await prisma.transactions.findMany({
      include: {
        split: true,
      },
    })

    res.status(200).json(transactions)
  } else {
    res.status(401)
  }
  res.end()
}
