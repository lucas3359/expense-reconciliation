import { PrismaClient, split } from '@prisma/client'
import Split from '../model/split'
import Total from '../model/total'
import Totals from '../model/totals'
import UpdateSplit from '../model/updateSplit'
import DbService from './dbService'

class SplitService {
  private readonly prisma: PrismaClient

  public constructor() {
    const dbService = new DbService()
    this.prisma = dbService.getPrismaClient()
  }

  public async getTotals(): Promise<Totals> {
    var totals = await this.getUserTotals()

    return {
      notReconciledTotal: 0,
      totals: totals,
    }
  }

  public async updateSplit(body: UpdateSplit): Promise<Split[]> {
    if (!body.transactionId || body.splits.length === 0) {
      console.error('body is empty', body)
      return null
    }

    const updatedSplits = []

    body.splits.map(async (split) => {
      const updatedSplit = await this.createOrUpdateSplit(split, body.transactionId)
      updatedSplits.push(this.convertPrismaToSplit(updatedSplit))
    })

    return updatedSplits
  }

  private convertPrismaToSplit(prismaSplit: split): Split {
    return {
      id: prismaSplit.id,
      userId: prismaSplit.user_id,
      amount: Number(prismaSplit.amount),
      reviewed: prismaSplit.reviewed,
    }
  }

  private async createOrUpdateSplit(body: Split, transactionId: number): Promise<split> {
    let split: split
    let existing = await this.prisma.split.findFirst({
      where: {
        AND: [{ transaction_id: transactionId }, { user_id: body.userId }],
      },
      orderBy: {
        transaction_id: 'asc',
      },
    })

    if (existing && existing.transaction_id === transactionId && existing.user_id === body.userId) {
      split = await this.prisma.split.update({
        where: {
          id: existing.id,
        },
        data: {
          amount: body.amount,
        },
      })
    } else {
      split = await this.prisma.split.create({
        data: {
          transaction_id: transactionId,
          user_id: body.userId,
          amount: body.amount,
        },
      })
    }

    return split
  }

  private async getUserTotals(): Promise<Total[]> {
    const groupTotals = await this.prisma.split.groupBy({
      by: ['user_id'],
      _sum: {
        amount: true,
      },
    })

    const convertedTotals = groupTotals.map((total) => {
      return {
        userId: total.user_id,
        amount: total._sum.amount,
      }
    })

    return convertedTotals
  }
}

export default SplitService
