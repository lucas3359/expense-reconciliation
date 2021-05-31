import { split, transactions } from '@prisma/client'
import useSWR from 'swr'
import Split from './split'

const Transaction = ({ row }) => {
  const splits = row.split

  return (
    <tr>
      <td>{row.date}</td>
      <td>{row.details}</td>
      <td>{row.amount}</td>
      <Split data={splits} amount={row.amount} transaction_id={row.id} />
      {renderSplit(splits)}
    </tr>
  )
}

const renderSplit = (splits: split[]) => {
  return splits.map((split) => {
    return (
      <div>
        <div>Name: {split.user_id}</div>
        <div>Split: {split.amount}</div>
      </div>
    )
  })
}

export default Transaction
