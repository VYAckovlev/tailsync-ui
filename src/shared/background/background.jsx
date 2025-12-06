import React from 'react'
import './background.css'

const Background = ({ children, centered = true }) => {
    return (
        <div className={`app-background ${centered ? 'centered' : 'stretch'}`}>
            {children}
        </div>
    );
};

export default Background;