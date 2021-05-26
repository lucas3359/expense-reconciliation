import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'


const prisma = new PrismaClient()

export default async (req : NextApiRequest, res : NextApiResponse) => {
    if(req.method !=='POST'){
        res.status(405).json({})
    }
    if (req.body) {
        console.log(req.body);
        const transactions  = req.body.map((ofx : any) => {
            const dt = new Date(ofx['DTPOSTED'].substring(0,4)+"-"+ofx['DTPOSTED'].substring(4,6)+"-"+ofx['DTPOSTED'].substring(6,8))
            const t : transactions = {
                date: dt,
                amount: ofx['TRNAMT'],
                details: ofx['NAME'],
                bank_id: ofx['FITID']
            }
            return t
        })
        
        const response = await prisma.transactions.createMany({
            data: transactions,
            skipDuplicates: true
        })


    res.status(201).json(response)
  }
}