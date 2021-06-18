import { PrismaClient, split } from '@prisma/client'
import Split from '../model/split'
import SplitImport from '../model/splitImport'

class SplitService {
  private readonly prisma: PrismaClient

  public constructor() {
    this.prisma = new PrismaClient()
  }

  public async updateSplit(body: SplitImport): Promise<Split> {
    if (!body.transaction_id || !body.user_id) {
      console.error('body is empty', body)
      return null
    }

    const split = await this.createOrUpdateSplit(body)

    return this.convertPrismaToSplit(split)
  }

  private convertPrismaToSplit(prismaSplit: split): Split {
    return {
      id: prismaSplit.id,
      userId: prismaSplit.user_id,
      amount: Number(prismaSplit.amount),
      reviewed: prismaSplit.reviewed,
    }
  }

  private async createOrUpdateSplit(body: SplitImport): Promise<split> {
    let acc: split
    let check = await this.prisma.split.findFirst({
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
      acc = await this.prisma.split.update({
        where: {
          // @ts-ignore
          id: check.id,
        },
        data: {
          amount: body.amount,
        },
      })
    } else {
      acc = await this.prisma.split.create({
        data: {
          transaction_id: body.transaction_id,
          user_id: body.user_id,
          amount: body.amount,
        },
      })
    }

    return acc
  }
}

export default SplitService
