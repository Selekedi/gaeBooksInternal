import React, { useState } from "react";
import FloatingLabelInput from "./FloatingLabelInput";

export default function FloatingLabelPasswordInput({ id, value, onChange }){
    const [showPassword, setShowPassword] =useState(false)
    const togglePasswordVisibility = () => setShowPassword(prev => !prev)
    const type = showPassword ? "text" : "password"

    return (
        <div style={{display:'flex',gap:'8px', alignItems:'center'}}>
            <FloatingLabelInput
                id={id}
                value={value}
                onChange={onChange}
                type={type}
                label={"Password"}
            />
            <label style={{ marginLeft: '1rem' }}>
                <input
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
                />
                Show Password
            </label>
        </div>
    )
}