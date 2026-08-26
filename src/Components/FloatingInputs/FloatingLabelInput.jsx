import React, { useState } from 'react';
import './FloatingLabelInput.css';

function FloatingLabelInput({ label, id, type = 'text', value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="form-group">
      <input
        type={type}
        id={id}
        className="form-input"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== '')}
        placeholder=" " // needed for :placeholder-shown
      />
      <label
        htmlFor={id}
        className={`form-label ${isFocused || value !== "" ? 'float' : ''}`}
      >
        {label}
      </label>
    </div>
  );
}

export default FloatingLabelInput;
