import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, split } from '@prisma/client'
import SplitImport from '../../model/splitImport'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const checkAccount = async (body: SplitImport) => {
  if (!body.transaction_id || !body.user_id) {
    console.error('body is empty', body)
    return null
  }

  let acc: split
  let check = await prisma.split.findFirst({
    // @ts-ignore
    where: {
      AND: [
        // @ts-ignore
        { transaction_id: body.transaction_id },
        { user_id: body.user_id },
      ],
    },
    orderBy: {
      transaction_id: 'asc',
    },
  })

  if (check && check.transaction_id === body.transaction_id && check.user_id === body.user_id) {
    acc = await prisma.split.update({
      where: {
        // @ts-ignore
        id: check.id,
      },
      data: {
        amount: body.amount,
      },
    })
  } else {
    acc = await prisma.split.create({
      data: {
        transaction_id: body.transaction_id,
        user_id: body.user_id,
        amount: body.amount,
      },
    })
  }

  return acc
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const body: SplitImport = JSON.parse(req.body)

    const acc = checkAccount(body)

    res.status(201).json(acc)
  } else {
    res.status(401)
  }
  res.end()
}
