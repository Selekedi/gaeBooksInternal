import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingLabelInput from "../../Components/FloatingInputs/FloatingLabelInput";
import FloatingLabelPasswordInput from "../../Components/FloatingInputs/FloatingLabelPasswordInput";
import { auth } from "../../services/firebase/firebaseConfig";
import FullScreenLoader from "../../Components/Loaders/FullScreenLoader";

export default function LogIn(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/")
        } catch (error) {
            setError("You have entered the wrong credentials")
            console.error(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {loading && <FullScreenLoader/>}
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
    
                <FloatingLabelInput
                    id={"login-email"}
                    label={"Email"}
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <FloatingLabelPasswordInput
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button type={"submit"}>Log In</button>
                {error && <div style={{marginTop:"8px"}}>{error}</div>}
            </form>
        </div>
    )
}