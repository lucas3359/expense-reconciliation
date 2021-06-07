import { transactions, users } from '@prisma/client'
import useSWR from 'swr'
import Transaction from '../components/Transaction'
import { useSession } from 'next-auth/client'
import React from 'react'
import Layout from '../components/Layout'

export default function List() {
  const { data: transactionData, error: transactionError } = useSWR('/api/transactions')
  const { data: userData, error: userError } = useSWR('/api/user')

  const [session, loading] = useSession()

  if (transactionError || userError) return <div>Failed to load</div>
  if (!transactionData || !userData) return <div>loading...</div>

  const renderedList = () => {
    const rows: transactions[] = transactionData
    const users: users[] = userData

    return rows.map((row) => {
      return <Transaction key={row.id} row={row} users={users} />
    })
  }
  if (!session) {
    return (
      <Layout>
        <div>Not signed in</div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <table id='table' className='w-full table-auto'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='py-3'>Date</th>
              <th className='py-3'>Description</th>
              <th className='py-3 text-right'>Amount</th>
              <th className='py-3'></th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>{renderedList()}</tbody>
        </table>
      </Layout>
    )
  }
}
