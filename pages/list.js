import useSWR from 'swr';

export default function List () {
    const fetcher = (...args) => fetch(...args).then(res => res.json());

    const {data, error} = useSWR('/api/transactions', fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>loading...</div>

    const renderedList = () => {
        return data.map(row => {
            return (<tr>
                <td>{row.DTPOSTED}</td>
                <td>{row.Desc}</td>
                <td>{row.TRNAMT}</td>
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