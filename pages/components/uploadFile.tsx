import React, { ChangeEvent } from 'react'
import ofx from 'node-ofx-parser'
import TransactionImport from '../model/transactionImport'

const UploadFile = ()=>{ 
	const handleChange =(event : any) =>{
		const reader = new FileReader()

		const file : File = event.target.files[0]

		reader.onloadend = () => {
			parseFile(reader.result)
		}

		console.log(file.name)
		if (file && file.size < 10000 && file.name.endsWith(".ofx")) {
			reader.readAsText(file)
		} else {
			alert('Bad file')
		}
	}

	const parseFile = async (file : string | ArrayBuffer) => {
		
		let data = ofx.parse(file)
		console.log(data)
		const creditCardPrefix = data.OFX.CREDITCARDMSGSRSV1?.CCSTMTTRNRS?.CCSTMTRS
		const bankPrefix = data.OFX.BANKMSGSRSV1?.STMTTRNRS?.STMTRS

		const datatxn = creditCardPrefix ? creditCardPrefix.BANKTRANLIST.STMTTRN : bankPrefix.BANKTRANLIST.STMTTRN
		const dataaccid= creditCardPrefix ? creditCardPrefix.CCACCTFROM.ACCTID : bankPrefix.BANKACCTFROM.ACCTID 
		const datadate = creditCardPrefix ? creditCardPrefix.BANKTRANLIST :  bankPrefix.BANKTRANLIST
		
		
		const body : TransactionImport = {
			startDate: datadate?.DTSTART,
			endDate: datadate?.DTEND,
			transactions: datatxn,
			accountNumber: dataaccid
			
		}

		console.log(data)
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: JSON.stringify(body)
		})

		console.log('response', response)
	}

	return (
		<div className = "ui fluid segment">
			<input type = 'file' onChange={handleChange} className="inputfile" />

		</div>
		
	)
	
}

export default UploadFile;


