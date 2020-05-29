import React from 'react';
import packageJson from './package.alias.json';

export default function  Version() {
    
    return (
        <React.Fragment>
        <span><strong>{packageJson.version}</strong>{process.env.REACT_APP_CURRENT_GIT_SHA}</span>
        </React.Fragment>
    );
}