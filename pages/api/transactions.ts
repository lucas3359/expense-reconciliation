import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import TransactionService from '../../services/transactionService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    const transactionService = new TransactionService()

    const transactions = await transactionService.getTransactionList()

    res.status(200).json(transactions)
  } else {
    res.status(401)
  }
  res.end()
}
