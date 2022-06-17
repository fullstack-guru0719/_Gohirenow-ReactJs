import React from 'react';

export const DashboardIcon = ({color, className}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
            <g>
                <g>
                    <path fill={`${color ? color : '#cdcdcd'}`}
                          d="M21.111 0H38v12.667H21.111zM0 0h16.889v21.111H0zm0 25.333h16.889V38H0zm21.111-8.444H38V38H21.111z"/>
                </g>
            </g>
        </svg>
    );
};