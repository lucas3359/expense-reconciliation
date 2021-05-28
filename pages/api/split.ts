import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, transactions } from '@prisma/client'
import SplitImport from '../model/splitImport'

const prisma = new PrismaClient()





// const checkAccount2= async (body : SplitImport) =>{

//         const acc = await prisma.split.upsert({
            
//             where:{
//                  // @ts-ignore
//                 transaction_id: body.transaction_id,
//                 user_id:body.user_id},
//                 update:{amount:body.amount},
//                 create: {
//                     transaction_id: body.transaction_id,
//                 user_id:body.user_id,
//                 amount:body.amount
//                 }

            
//          })

// }



const checkAccount= async (body : SplitImport) =>{
    if (!body.transaction_id || !body.user_id) {
        console.error('body is empty', body)
        return null
    }

    let acc : SplitImport 
    let check = await prisma.split.findFirst({
        // @ts-ignore
        where:{  
            AND: [// @ts-ignore
             { transaction_id: body.transaction_id},
             { user_id:body.user_id}
            ]},
        orderBy: {
            transaction_id: 'asc'
        }
    })

    console.log('transaction_id: ' + body.transaction_id + ' & ' + 'user_id' + body.user_id)
    console.log(check);

    if (check && check.transaction_id === body.transaction_id && check.user_id === body.user_id) {
        acc = await prisma.split.update({
            where :{  // @ts-ignore
               id: check.id
            },
       data:{
           amount:body.amount,
           
       }
      })
    } else {
         acc = await prisma.split.create({
            data:{
                transaction_id: body.transaction_id,
                user_id:body.user_id,
                amount:body.amount,
                
            }
         })}
    
         return acc
}




export default async (req : NextApiRequest, res : NextApiResponse) => {    
    const body : SplitImport = JSON.parse(req.body)

    const acc = checkAccount(body)
    
    res.status(201).json(acc)
}

