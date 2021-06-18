import { PrismaClient, transaction, split } from '@prisma/client'
import PageOptions from '../model/pageOptions'
import Transaction from '../model/transaction'

class TransactionService {
  private readonly prisma: PrismaClient

  public constructor() {
    this.prisma = new PrismaClient()
  }

  public async getTransactionList(pageOptions?: PageOptions): Promise<Transaction[]> {
    const transactions: transaction[] = await this.prisma.transaction.findMany({
      include: {
        split: true,
      },
    })

    return transactions.map((prismaTransaction) => {
      return {
        id: prismaTransaction.id,
        date: `${prismaTransaction.date.getDate()}/${prismaTransaction.date.getMonth() + 1}`,
        amount: Number(prismaTransaction.amount),
        details: prismaTransaction.details,
        accountId: prismaTransaction.account_id,
        importId: prismaTransaction.import_id,
        //@ts-ignore Types don't include relations
        splits: prismaTransaction.split.map((split: split) => {
          return {
            id: split.id,
            userId: split.user_id,
            amount: Number(split.amount),
            reviewed: split.reviewed,
          }
        }),
      }
    })
  }
}

export default TransactionService
