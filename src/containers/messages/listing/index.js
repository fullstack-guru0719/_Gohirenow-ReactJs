import React, { Component,useEffect } from 'react';

const Listing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

    });
    return (
        <tbody>
            <tr>
                <td>Full time dev 40hr/week asp.net c#</td>
                <td>56 of 100</td>
                <td>Active</td>
                <td>2 days ago</td>
                <td>
                    <div className="Edit-mode">
                        <i className="fa fa-pencil" />
                        <i className="fa fa-eye" />
                    </div>
                </td>
            </tr>
            <tr>
                <td>Full time dev 40hr/week asp.net c#</td>
                <td>56 of 100</td>
                <td>Active</td>
                <td>2 days ago</td>
                <td>
                    <div className="Edit-mode">
                        <i className="fa fa-pencil" />
                        <i className="fa fa-eye" />
                    </div>
                </td>
            </tr>

        </tbody>
    )
}
export default Listing;