import React,{useState, useEffect} from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';

const Error404 = ({auth: {isAuthenticated, user }}) => {
    useEffect(()=>{
        window.scroll(0,0);
    })

    return (
    <div id="error">
        <MetaTags>
            <title>GoHireNow</title>
            <meta name="description" content="" />
        </MetaTags>
                    <div className="container pt-3">
                        <div className="row">
                            <div className="content">
                                <h2>OOPS!</h2>
                                <p>Page not found</p>
                                <div className="image-div">
                                    <img src={require("../../assets/error404.png")} alt=""/>
                                </div>
                                {
                                    isAuthenticated &&   user && user.userType===1 &&
                                    <Link to='/dashboard'>  <button className="btn text-uppercase">go to homepage</button></Link>
                                }
                                {
                                    isAuthenticated  && user && user.userType===2 &&
                                    <Link to='/dashboard-work'>  <button className="btn text-uppercase">go to homepage</button></Link>
                                }
                                {
                                    !isAuthenticated &&
                                    <Link to='/'>  <button className="btn text-uppercase">go to homepage</button></Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
    );
};



const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Error404);
