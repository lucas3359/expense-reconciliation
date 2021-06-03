import { transactions } from '@prisma/client'
import useSWR from 'swr'
import Transaction from '../components/transaction'
import { useSession } from 'next-auth/client'
import React from 'react'
import Layout from '../components/Layout'

export default function List() {
  const { data, error } = useSWR('/api/transactions')

  const [session, loading] = useSession()

  if (error) return <div>Failed to load</div>
  if (!data) return <div>loading...</div>

  const renderedList = () => {
    const rows: transactions[] = data

    return rows.map((row) => {
      return <Transaction row={row} />
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
        <h1>Transaction List</h1>

        <table id='table' className='ui celled table'>
          <thead>
            <th>Date</th>
            <th>Desc</th>
            <th>$</th>
          </thead>
          <tbody>{renderedList()}</tbody>
        </table>
      </Layout>
    )
  }
}
