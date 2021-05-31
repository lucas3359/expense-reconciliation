import React, { useState,ChangeEvent } from 'react'
import SplitImport from '../model/splitImport'



const Split = ({data,amount,transaction_id})=>{

const [percent, setPercent] = useState(0.3);
const [amount1, setAmount1] = useState(amount*percent);
const [amount2, setAmount2] = useState(amount*(1-percent));

const splitOptions = [{value: 0.3, description: '30%'},
                      {value: 0.5, description: '50%'},
                      {value: 0.7, description: '70%'},
                      {value: -1, description: 'Custom'}]

const setAmount = (event,acc) => {
    
    if(Number(event.target.value) && acc===1){
        setPercent(-1)
        setAmount1(event.target.value)
        setAmount2(amount-event.target.value)
    }
    else if(Number(event.target.value) && acc===2){
        setPercent(-1)
        setAmount2(event.target.value)
        setAmount1(amount-event.target.value)
    }
    
}

const splitAmount = (event)=>{
    setPercent(Number(event.target.value))
    setAmount1(amount*Number(event.target.value))
    setAmount2(Math.round(amount*(1-Number(event.target.value))))
  
}




const parseSplit = async () => {
    const body1 : SplitImport = {
        transaction_id: transaction_id,
        user_id: 2,
        amount: amount1
        
    }

    const body2 : SplitImport = {
        transaction_id: transaction_id,
        user_id: 1,
        amount: amount2
        
    }

const response1 = await fetch('/api/split', {
    method: 'POST',
    body: JSON.stringify(body1)
    
})

const response2 = await fetch('/api/split', {
    method: 'POST',
    body: JSON.stringify(body2)
    
}
)}


    if (data.length !== 0){
        return (<td><div><button className = "ui secondary button">Splited</button></div></td>)}
        else{
            const renderSplitOptions = splitOptions.map(option => {
                return <option value={option.value}>{option.description}</option>
            })
        return (
        <td>
            <div>
                <button className = "ui primary button" onClick = {parseSplit} >split</button>
                <select className = 'ui dropdown' value = {percent} onChange ={splitAmount}>
                {renderSplitOptions}

                </select>
                <div className = 'ui right labeled input'>
                    <label  className ='ui label' > Lucas </label>
                    
                    <input type = 'text' placeholder = "Amount" value = {amount1} onChange = {(e)=>{
                        setAmount(e,1)
                    }}/>
                </div>
                <div className = 'ui right labeled input'>
                    <label  className ='ui label' > Thomas </label>
                    <input type = 'text' placeholder = "Amount" value = {amount2} onChange = {(e)=>{
                        setAmount(e,2)
                    }}/>
                </div>
            </div>
        </td>)}
        
}

export default Split;

//