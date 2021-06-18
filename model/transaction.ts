type Transaction = {
  id: number
  date: string
  amount: number
  details: string
  accountId: number
  importId: number
  splits: []
}

export default Transaction
