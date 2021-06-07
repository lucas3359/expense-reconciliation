import React, { ChangeEvent, useEffect, useState } from 'react'
import ofx from 'node-ofx-parser'
import TransactionImport from '../model/transactionImport'
import Card from './Card'
import Icon from './Icon'

const UploadFile = () => {
  const [badFile, setBadFile] = useState(false)

  useEffect(() => {
    let timeout
    if (badFile === true) {
      timeout = setTimeout(() => {
        setBadFile(false)
      }, 4000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [badFile])

  const handleChange = (event: any) => {
    const reader = new FileReader()

    const file: File = event.target.files[0]

    reader.onloadend = () => {
      parseFile(reader.result)
    }

    if (file && file.size < 10000 && file.name.endsWith('.ofx')) {
      reader.readAsText(file)
    } else {
      setBadFile(true)
    }
  }

  const parseFile = async (file: string | ArrayBuffer) => {
    let data = ofx.parse(file)

    const creditCardPrefix = data.OFX.CREDITCARDMSGSRSV1?.CCSTMTTRNRS?.CCSTMTRS
    const bankPrefix = data.OFX.BANKMSGSRSV1?.STMTTRNRS?.STMTRS

    const datatxn = creditCardPrefix ? creditCardPrefix.BANKTRANLIST.STMTTRN : bankPrefix.BANKTRANLIST.STMTTRN
    const dataaccid = creditCardPrefix ? creditCardPrefix.CCACCTFROM.ACCTID : bankPrefix.BANKACCTFROM.ACCTID
    const datadate = creditCardPrefix ? creditCardPrefix.BANKTRANLIST : bankPrefix.BANKTRANLIST

    const body: TransactionImport = {
      startDate: datadate?.DTSTART,
      endDate: datadate?.DTEND,
      transactions: datatxn,
      accountNumber: dataaccid,
    }

    await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  const uploadBar = (
    <label className='w-full h-full cursor-pointer'>
      <Icon icon='upload' classes='w-20 mx-auto' />
      <input type='file' className='hidden' onChange={handleChange} />
      <p className='text-center font-semibold'>Upload transactions file</p>
    </label>
  )

  const badFileBar = (
    <div className='text-red-400'>
      <Icon icon='cross' classes='w-20 mx-auto animate-bounce' />
      <p className='text-center font-bold'>Was not able to upload file</p>
    </div>
  )

  return <Card link={true}>{badFile ? badFileBar : uploadBar}</Card>
}

export default UploadFile
