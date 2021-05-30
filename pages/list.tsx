import { transactions } from '@prisma/client'
import useSWR from 'swr'
import Transaction from '../components/transaction'

export default function List () {
    const {data, error} = useSWR('/api/transactions')

    if (error) return <div>Failed to load</div>
    if (!data) return <div>loading...</div>

    const renderedList = () => {
        const rows : transactions[] = data

        return rows.map(row => {
            return (<Transaction row = {row} />
                )
       })
    }

    return(
        <div className="ui container">

            <h1>Transaction List</h1>

            <table id='table' className = "ui celled table">
            <thead>
                <th>Date</th>
                <th>Desc</th>
                <th>$</th>
            </thead>
            <tbody>
                {renderedList()}
            </tbody>
            </table>

        </div>
    )
}