import { transactions } from "@prisma/client";

type TransactionImport = {
    accountNumber: string,
    startDate: string,
    endDate: string,
    transactions: any[]
}

export default TransactionImport;