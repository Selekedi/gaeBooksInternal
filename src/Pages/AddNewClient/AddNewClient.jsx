import { useState } from "react"
import { addClient } from "../../Server/Server"

export default function AddNewClient(){
    const [name,setName] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const clientId = await addClient(name)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="add-new-client">
            <h1>Add New Client</h1>
            <form>
                <div className="form-group">
                    <label>Client Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>
        </div>
    )
}