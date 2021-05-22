const transactions = [
    {Desc :'Koha Sushi Auckland Nz' , TRNAMT:28, DTPOSTED:'20210502'},
    {Desc :'Piknic Cafe Auckland Nz' , TRNAMT:-28.80, DTPOSTED:'20210424'},
    {Desc :'Countdown Sunnynook N Shore City Nz' , TRNAMT:42.02, DTPOSTED:'20210502'}
   ];

export default (req, res) => {
    res.status(200).json(transactions);
  }
  