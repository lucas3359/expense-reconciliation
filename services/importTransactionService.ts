import { PrismaClient, transaction } from '@prisma/client'
import ofx from 'node-ofx-parser'
import TransactionImport from '../model/transactionImport'
import DbService from './dbService'

class ImportTransactionService {
  private readonly prisma: PrismaClient

  public constructor() {
    const dbService = new DbService()
    this.prisma = dbService.getPrismaClient()
  }

  public parseOfxBody(file: string): TransactionImport {
    let data = ofx.parse(file)

    const creditCardPrefix = data.OFX.CREDITCARDMSGSRSV1?.CCSTMTTRNRS?.CCSTMTRS
    const bankPrefix = data.OFX.BANKMSGSRSV1?.STMTTRNRS?.STMTRS

    const datatxn = creditCardPrefix ? creditCardPrefix.BANKTRANLIST.STMTTRN : bankPrefix.BANKTRANLIST.STMTTRN
    const dataaccid = creditCardPrefix ? creditCardPrefix.CCACCTFROM.ACCTID : bankPrefix.BANKACCTFROM.ACCTID
    const datadate = creditCardPrefix ? creditCardPrefix.BANKTRANLIST : bankPrefix.BANKTRANLIST

    const body: TransactionImport = {
      startDate: datadate?.DTSTART,
      endDate: datadate?.DTEND,
      transactions: datatxn,
      accountNumber: dataaccid,
    }
    return body
  }

  public async importTransactions(body: TransactionImport) {
    const accountId = await this.findOrCreateAccountId(body.accountNumber)
    const importId = await this.createNewImportId(body.startDate, body.endDate, accountId)

    const transactions: transaction[] = body.transactions.map((ofx: any) => {
      //@ts-ignore id is created by prisma
      const transaction: transaction = {
        date: this.convertOfxDateToDatabase(ofx['DTPOSTED']),
        amount: Math.round(ofx['TRNAMT'] * 100),
        details: [ofx['NAME'], ofx['MEMO']].join(' '),
        bank_id: ofx['FITID'],
        account_id: accountId,
        import_id: importId,
      }
      return transaction
    })

    return await this.prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true,
    })
  }

  private async findOrCreateAccountId(accountId: string): Promise<number> {
    let account = await this.prisma.account.findUnique({
      where: { account_number: accountId },
    })

    if (!account) {
      account = await this.prisma.account.create({
        data: {
          account_number: accountId,
        },
      })
    }

    return account.id
  }

  private async createNewImportId(startDate: string, endDate: string, accountId: number): Promise<number> {
    const bankImport = await this.prisma.bank_import.create({
      data: {
        start_date: this.convertOfxDateToDatabase(startDate),
        end_date: this.convertOfxDateToDatabase(endDate),
        account_id: accountId,
      },
    })
    return bankImport.id
  }

  private convertOfxDateToDatabase(date: string) {
    return new Date(date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8))
  }
}

export default ImportTransactionService
