import useSWR from 'swr';
import Transaction from './model/transaction';

export default function List () {
    const fetcher = (...args : any[]) => fetch(...args).then(res => res.json());

    const {data, error} = useSWR('/api/transactions', fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>loading...</div>

    const renderedList = () => {
        const rows : Transaction[] = data;

        return rows.map(row => {
            return (<tr>
                <td>{row.date}</td>
                <td>{row.details}</td>
                <td>{row.amount}</td>
                </tr>
                )
       });
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
    );
}