import React from 'react';
import "./logo.css";

const Logo = ({ size = "medium" }) => {
    return (
        <div className={`logo-circle logo-circle--${size}`}>
            <img
                src="/logo.png"
                alt="TailSync Logo"
                className="logo-image"
            />
        </div>
    );
};

export default Logo;