import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'
import TransactionImport from '../../model/transactionImport'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

const checkAccount = async (accountId: string) => {
  let acc = await prisma.accounts.findUnique({
    where: { account_number: accountId },
  })

  if (!acc) {
    acc = await prisma.accounts.create({
      data: {
        account_number: accountId,
      },
    })
  }

  return acc.id
}

const dateTrans = (date: string) => {
  return new Date(
    date.substring(0, 4) +
      '-' +
      date.substring(4, 6) +
      '-' +
      date.substring(6, 8)
  )
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (session) {
    if (req.method !== 'POST') {
      res.status(405).json({})
    }

    const body: TransactionImport = JSON.parse(req.body)

    if (body) {
      const accountId = await checkAccount(body.accountNumber)

      const transactions = body.transactions.map((ofx: any) => {
        //@ts-ignore
        const t: transactions = {
          date: dateTrans(ofx['DTPOSTED']),
          amount: ofx['TRNAMT'],
          details: [ofx['NAME'], ofx['MEMO']].join(' '),
          bank_id: ofx['FITID'],
          account: accountId,
        }
        return t
      })

      const response = await prisma.transactions.createMany({
        data: transactions,
        skipDuplicates: true,
      })

      res.status(201).json(response)
    }
  } else {
    res.status(401)
  }

  res.end()
}
