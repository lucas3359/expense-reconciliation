import React, { ChangeEvent } from 'react';

const UploadFile = ()=>{ 
	const handleChange =(event : any) =>{
		const reader = new FileReader()

		const file : File = event.target.files[0]

		reader.onloadend = () => {
			console.log(reader.result)
		}

		if (file && file.size < 10000 && file.type === 'text/javascript') {
			reader.readAsText(file)
		} else {
			alert('Bad file')
		}
	}

	return (
		<div className = "ui fluid segment">
			<input type = 'file' onChange={handleChange} className="inputfile" />

		</div>
		
	)
	
}

export default UploadFile;


