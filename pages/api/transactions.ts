import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'


const prisma = new PrismaClient()

export default async (req : NextApiRequest, res : NextApiResponse) => {
    const transactions : transactions[] = await prisma.transactions.findMany()

    res.status(200).json(transactions)
  }
  