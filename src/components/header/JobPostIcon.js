import React from 'react';

export const JobPostIcon = ({color, className}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <g>
                <g>
                    <path fill={`${color ? color : '#cdcdcd'}`}
                          d="M3.636 36.364h29.091V40H3.637C1.636 40 0 38.364 0 36.364V7.273h3.636zM40 3.636v25.455c0 2-1.636 3.636-3.636 3.636H10.909c-2 0-3.636-1.636-3.636-3.636V3.636c0-2 1.636-3.636 3.636-3.636h25.455C38.364 0 40 1.636 40 3.636zm-7.273 10.91h-7.272V7.272h-3.637v7.272h-7.273v3.637h7.273v7.273h3.637v-7.273h7.272z"/>
                </g>
            </g>
        </svg>
    );
};