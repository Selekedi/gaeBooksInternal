import React from "react";
import { Link } from "react-router-dom";
import "./FabLink.css";

export default function FabLink({ to, icon = "+", label = "Add" }) {
  return (
    <Link to={to} className="fab-link" title={label}>
      <span className="fab-icon">{icon}</span>
    </Link>
  );
}
