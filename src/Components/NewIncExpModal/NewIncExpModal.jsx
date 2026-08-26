import { useEffect, useState } from "react"
import { addTransaction } from "../../Server/Server"

export default function NewIncExpModal({type, clientId,onClose}){
    const [name, setName] = useState("")
    const [lineItem, setLineItem] = useState("")
    const [amount, setAmount] = useState("")
    const [date,setDate] = useState(new Date().toISOString().split("T")[0])
    const [error,setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const details = {
            name:name,
            lineItem,
            amount,
            date
        }
        console.log(clientId)
        try {
            await addTransaction({clientId,type,details})

        } catch (error) {
            console.error(error)
            setError(error.message)
        }finally {
            onClose()
        }
    }
    return (
        <div className="new-income-expense-modal">
            <div className="modal">
                <h2>New {type}</h2>
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Line Items</label>
                        <textarea 
                            cols={30} 
                            rows={3}
                            value={lineItem}
                            onChange={(e) => setLineItem(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input 
                            type="number" 
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input value={date} onChange={(e) => setDate(e.target.value)} type="date"/>
                    </div>

                    <button
                        onClick={e => handleSubmit(e)}
                    >Add New {type}</button>
                    {error && <div>{error}</div>}
                </form>
            </div>
        </div>
    )
}