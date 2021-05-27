import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'
import TransactionImport from '../model/transactionImport'


const prisma = new PrismaClient()

const checkacnt = async (accountId : string)=>{
    console.log('Finding: ', accountId)

    let acc = await prisma.accounts.findUnique({
        where:{ account_number: accountId}
    })

    if (! acc) {
        acc = await prisma.accounts.create({
            data:{
                account_number: accountId,
            }
         })      
    }  
    
    return acc.id
}

export default async (req : NextApiRequest, res : NextApiResponse) => {    
    if(req.method !=='POST'){
        res.status(405).json({})
    }

    const body : TransactionImport = JSON.parse(req.body);
    
    if (body) {
        const accountId = await checkacnt(body.accountNumber)

        const transactions  = body.transactions.map((ofx : any) => {
            const dt = new Date(ofx['DTPOSTED'].substring(0,4)+"-"+ofx['DTPOSTED'].substring(4,6)+"-"+ofx['DTPOSTED'].substring(6,8))
            const t : transactions = {
                date: dt,
                amount: ofx['TRNAMT'],
                details: [ofx['NAME'], ofx['MEMO']].join(' '),
                bank_id: ofx['FITID'],
                account: accountId

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