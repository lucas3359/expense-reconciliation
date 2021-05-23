import { NextApiRequest, NextApiResponse } from 'next';
import Transaction from '../model/transaction';

const transactions = new Array<Transaction>(
    {details :'Koha Sushi Auckland Nz' , amount:28, date:'20210502'},
    {details :'Piknic Cafe Auckland Nz' , amount:-28.80, date:'20210424'},
    {details :'Countdown Sunnynook N Shore City Nz' , amount:42.02, date:'20210502'}
   );

export default (req : NextApiRequest, res : NextApiResponse) => {
    res.status(200).json(transactions);
  }
  