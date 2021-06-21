import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import ImportTransactionService from '../../services/importTransactionService'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const importTransactionService = new ImportTransactionService()

  if (session) {
    if (req.method !== 'POST') {
      res.status(405).json({})
    }

    const body = importTransactionService.parseOfxBody(req.body)

    await importTransactionService.importTransactions(body)

    res.status(201).json({ result: 'Imported' })
  } else {
    res.status(401)
  }

  res.end()
}
