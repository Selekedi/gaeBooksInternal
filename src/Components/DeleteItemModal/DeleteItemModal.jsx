import { useState } from "react"
import { deleteTransactionById } from "../../Server/Server"
import "./DeleteItemModal.css"

export default function DeleteItemModal({itemId,onClose}){
    const [error,setError] = useState("")
    const handleDelete = async () => {
        setError("")
        try {
            await deleteTransactionById(itemId)
            onClose()
        } catch (error) {
            setError("couldnt delete item, contact support")
        }
    }
    return (
        <div className="delete-modal-container">
            <div className="modal-container">
                <p>are you sure you want to delete this item?</p>
                <div className="actions">
                    <button onClick={handleDelete}>yes, delete</button>
                    <button onClick={onClose}>no, dont delete</button>
                </div>
                {error && <div>{error}</div>}
            </div>
        </div>
    )
}