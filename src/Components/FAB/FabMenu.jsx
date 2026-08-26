import React, { useState } from "react";
import "./FabMenu.css";

export default function FabMenu({items}) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <div className="fab-container">
      <button className={`fab-button ${open ? "open" : ""}`} onClick={toggleMenu}>
        +
      </button>

      <div className={`fab-options ${open ? "open" : ""}`}>
        {items.map((item, index) => (
        <button
          key={index}
          className={`fab-action ${open ? "visible" : ""}`}
          style={{
            bottom: `${(index + 1) * 60 + 16}px`, // consistent spacing
          }}
          onClick={() => {
            item.onClick();
            setOpen(false);
          }}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
      </div>
    </div>
  );
}
