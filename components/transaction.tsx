import { split, transactions, users } from '@prisma/client'
import React, { useState } from 'react'
import Icon from './Icon'
import Split from './Split'

const Transaction = ({ row, users }: { row: transactions; users: users[] }) => {
  const [showSplit, setShowSplit] = useState(false)

  //@ts-ignore Types don't include relations
  const splits: split[] = row.split

  // For some reason date actually comes through as a string
  const renderDate = (dateIsString: Date) => {
    const date = new Date(dateIsString)
    if (date) {
      return `${date.getDate()}/${date.getMonth() + 1}`
    } else {
      return
    }
  }

  const renderSplit = () => {
    if (!showSplit) return

    return (
      <tr className='border-b border-gray-100 bg-white' key={`${row.id}-tr-split`}>
        <Split
          key={`${row.id}-split`}
          data={splits}
          amount={Number(row.amount)}
          transaction_id={row.id}
          users={users}
        />
      </tr>
    )
  }

  const splitButton = () => {
    const upIcon = <Icon icon='up' className='w-6 h-6' />
    const tickIcon = <Icon icon='tick' className='w-6 h-6' />

    if (splits.length > 0) {
      return (
        <button
          onClick={() => setShowSplit(!showSplit)}
          className='bg-green-300 w-16 hover:bg-green-100 focus:border-green-600 border-green-300 px-5'>
          {showSplit ? upIcon : tickIcon}
        </button>
      )
    } else {
      return (
        <button onClick={() => setShowSplit(!showSplit)} className={`w-16 ${showSplit ? 'px-5' : 'px-3'}`}>
          {showSplit ? upIcon : 'Split'}
        </button>
      )
    }
  }

  return (
    <>
      <tr className='border-b border-gray-100 bg-white hover:bg-gray-100' key={`row-${row.id}`}>
        <td className='p-2 text-gray-600'>{`${renderDate(row.date)}`}</td>
        <td className='p-2'>{row.details}</td>
        <td className={`p-2 text-right font-semibold ${Number(row.amount) < 0 ? 'text-gray-600' : 'text-green-400'}`}>
          {row.amount ? Number(row.amount).toFixed(2) : ''}
        </td>
        <td className='p-2 text-center'>{splitButton()}</td>
      </tr>
      {renderSplit()}
    </>
  )
}

export default Transaction
