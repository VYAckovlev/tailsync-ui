import React from 'react'
import './background.css'

const Background = ({ children }) => {
    return (
        <div className="app-background">
            {children}
        </div>
    );
};

export default Background;