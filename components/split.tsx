import { split, users } from '@prisma/client'
import React, { useState } from 'react'
import SplitImport from '../model/splitImport'

const Split = ({
  data,
  amount,
  transaction_id,
  users,
}: {
  data: any
  amount: number
  transaction_id: number
  users: users[]
}) => {
  const [percent, setPercent] = useState(0.3)
  const [amounts, setAmounts] = useState(splitAmounts(percent * amount, users[0].id))

  const splitOptions = [
    { value: 0.3, description: '30%' },
    { value: 0.5, description: '50%' },
    { value: 0.7, description: '70%' },
    { value: -1, description: 'Custom' },
  ]

  function splitAmounts(value: number, account_id: number): number[] {
    const userCount = users.length
    const newAmounts = amounts ? amounts : []
    newAmounts[account_id] = value

    users.map((user) => {
      if (user.id !== account_id) {
        newAmounts[user.id] = (amount - value) / Math.min(userCount - 1, 1)
      }
    })

    return newAmounts
  }

  const setAmountChange = (event: React.ChangeEvent<HTMLInputElement>, account_id: number) => {
    const value = Number(event.target.value)
    setAmount(value, account_id)
    setPercent(-1)
  }

  const setAmount = (value: number, account_id: number) => {
    if (!value) return

    const newAmounts = splitAmounts(value, account_id)

    setAmounts(newAmounts)
  }

  const splitAmount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    var percentage = Number(event.target.value)
    setPercent(percentage)
    setAmount(percentage * amount, users[0].id)
  }

  const parseSplit = async () => {
    users.map(async (user) => {
      const body: SplitImport = {
        transaction_id: transaction_id,
        user_id: user.id,
        amount: amounts[user.id],
      }

      await fetch('/api/split', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    })
  }

  const renderUserDropdown = () => {
    return users.map((user) => {
      return (
        <span key={`${transaction_id}-split-${user.id}-input`}>
          <label className='italic'>{user.name}</label>
          <input
            className='w-16 text-center'
            type='text'
            placeholder='Amount'
            value={(Math.round(amounts[user.id] * 100) / 100).toFixed(2)}
            onChange={(e) => {
              setAmountChange(e, user.id)
            }}
          />
        </span>
      )
    })
  }

  const renderAlreadySplit = (splits: split[]) => {
    return splits.map((split: split) => {
      return (
        <span key={`span-${transaction_id}-${split.id}`} className='text-center'>
          <span className='font-normal'>{users?.find((user) => user.id == split.user_id)?.name}: </span>
          <em>{(Math.round(Number(split.amount) * 100) / 100).toFixed(2)}</em>&nbsp;
        </span>
      )
    })
  }

  if (data.length !== 0) {
    return (
      <td className='p-2' colSpan={4}>
        Already split: {renderAlreadySplit(data)}
      </td>
    )
  } else {
    const renderSplitOptions = splitOptions.map((option) => {
      return (
        <option key={`option-${transaction_id}-${option.value}`} value={option.value}>
          {option.description}
        </option>
      )
    })
    return (
      <>
        <td className='p-2' colSpan={3} key={`${transaction_id}-split-td`}>
          <div>
            <select className='mr-2' value={percent} onChange={splitAmount}>
              {renderSplitOptions}
            </select>
            {renderUserDropdown()}
          </div>
        </td>
        <td className='p-2'>
          {' '}
          <button
            className='p-1 bg-green-300 w-16 border-green-300 hover:bg-green-100 focus:border-green-300'
            onClick={parseSplit}>
            Split
          </button>
        </td>
      </>
    )
  }
}

export default Split
