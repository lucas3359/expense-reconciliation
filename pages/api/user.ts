import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, users } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const users: users[] = await prisma.users.findMany()

    res.status(200).json(users)
  } else {
    res.status(401)
  }
  res.end()
}
