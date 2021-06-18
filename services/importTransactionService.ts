import { PrismaClient, transaction } from '@prisma/client'
import ofx from 'node-ofx-parser'
import TransactionImport from '../model/transactionImport'

class ImportTransactionService {
  private readonly prisma: PrismaClient

  public constructor() {
    this.prisma = new PrismaClient()
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

  public async import(body: TransactionImport) {
    const accountId = await this.findOrCreateAccountId(body.accountNumber)
    const importId = await this.createNewImportId()

    const transactions: transaction[] = body.transactions.map((ofx: any) => {
      //@ts-ignore id is created by prisma
      const transaction: transaction = {
        date: this.dateTrans(ofx['DTPOSTzED']),
        amount: ofx['TRNAMT'],
        details: [ofx['NAME'], ofx['MEMO']].join(' '),
        bank_id: ofx['FITID'],
        account_id: accountId,
        import_id: importId,
      }
      return transaction
    })

    return await this.prisma.transaction.createMany({
      data: body.transactions,
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

  private async createNewImportId(): Promise<number> {
    //await this.prisma.import.create
    return null
  }

  private dateTrans(date: string) {
    return new Date(date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8))
  }
}

export default ImportTransactionService
