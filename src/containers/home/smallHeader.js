import React, { Component, Fragment , useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrustedCompany from "../../components/trustedcompany/index";
import { setUserType } from '../auth/actions';
import MetaTags from 'react-meta-tags';
import { Helmet } from "react-helmet";
import MediaQuery from "react-responsive";


const MainLayout = ({ isAuthenticated, user,setUserType, history }) => {
    useEffect(()=>{
        window.scrollTo(0, 0);
    })
    const gotowork=()=>{
        setUserType(2);
        history.push('/register')
    }
    const gotohire=()=>{
        setUserType(1);
        history.push('/register')
    }
    if (isAuthenticated) {
        if (user && user.userTypeId === 1) return <Redirect to='/dashboard' />;
        if (user && user.userTypeId === 2) return <Redirect to='/dashboard-work' />;
    }
    return (
        <Fragment>
            <div className="hire-want-section new-home1" >
                <div className="container">
                    <div className="row">
                        <div className="col-6 second-two" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                            <div className="largetext">
                                <h2 style={{ marginTop: "44px"}}>
                                    Hire experts directly for any online jobs !
                                </h2>
                            </div>
                            <div className="smalltext">
                                <p style={{ marginTop: "70px",
                                    marginBottom: "70px",
                                    fontSize: "20px"}}>
                                    We take 0% commissions
                                </p>
                            </div>
                            <div className="hire-work-buttons ">
                                <button className="btn text-uppercase " onClick={()=> gotohire()}>i want to hire</button>
                            </div>
                        </div>
                        <div className="col-6 pr-0">
                            <div className="voted-div-outer">
                                <div className="voted-div">
                                    <div>
                                        <div className="top">
                                            <p>VOTED</p>
                                            <h4>#1</h4>
                                        </div>
                                      <p>The leader in <br /> Virtual<br />Assistants</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </Fragment>
    )

}




const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps,{setUserType})(MainLayout);
