import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../../../components/spinner/index';
import { login } from '../actions';
import { setAlert } from '../../alerts/actions';
import { setUpChat } from '../../../utils/pusherConfig';
//import MetaTags from 'react-meta-tags';
import { Helmet } from "react-helmet";
import MetaTags from 'react-meta-tags';


const SignIn = ({ history, login, isAuthenticated, loading, setAlert, user ,errmessage}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showErr, setshowErr] = useState("");
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(()=>{
        window.scroll(0,0);
        if(errmessage !==""){
            setshowErr(errmessage);
        }
    });

    const onSubmit = async e => {
        e.preventDefault();
        if (email === "") setshowErr('Email is required');
        else if (!email.includes("@")) setshowErr('Email is incorrect');
        else if (password === "") setshowErr('Password  is required');
        else login(email, password,history);
    };

    if (isAuthenticated) {
        setUpChat();
        if (user && user.userTypeId === 1) return <Redirect to='/dashboard' />
        if (user && user.userTypeId === 2) return <Redirect to='/dashboard-work' />
    }

    return (
        <div className="registration">

            <MetaTags>
                <title>GoHireNow - Sign In</title>
                <meta name="description" content="sign in description." />
                {/*<meta property="og:site_name" content="sign_in" />*/}
                <meta property="og:url" content="sign_in" />
                <meta property="og:description" content="Ahmed" />
            </MetaTags>

            {/*<Helmet>*/}
                {/*<title>GoHireNow - Sign In</title>*/}
                {/*<meta property="og:title" content="GoHireNow" />*/}
                {/*<meta property="og:site_name" content="GoHireNow" />*/}
                {/*<meta property="og:image" content="images/Capture.PNG"  />*/}
                {/*<meta property="og:type" content="text" />*/}
                {/*<meta property="og:url" content="https://www.gohirenow.com" />*/}
                {/*<meta property="og:description" content="Sign in to connect to your dashboard and start browsing jobs and candidates."*/}
                      {/*/>*/}
            {/*</Helmet>*/}
            <div className="container pt-3">
                <div className="mobile-pb-0 inner-div" style={{padding:"50px 50px"}}>
                    <div className="row flex-column top-text ">
                        <h2 className="text-center">Welcome Back!</h2>
                    </div>
                    <form>
                        <div className="register-work-form">
                            <div className="inner-pass-form">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    onChange={e => onChange(e)}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={e => onChange(e)}
                                    required
                                />
                                <p className="text-center" style={{ color: "Red", marginTop:"12px" }}>{showErr}</p>
                            </div>
                            <div className="sign-up-btn">

                                <button className="btn text-uppercase d-flex justify-content-center"
                                    onClick={e => onSubmit(e)}>{loading ? <Spinner /> : "SIGN IN"}</button>
                            </div>
                            <div className="already-member">
                                <p>Dont have an account? <Link to="/register">Sign Up</Link></p>
                                <p>Lost your password? <Link to="/forget-password">Click Here</Link></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = ({ auth }) => {
    return {
        isAuthenticated: auth.isAuthenticated,
        loading: auth.loading,
        user: auth.user,
        errmessage:auth.errmessage
    };
};


export default connect(
    mapStateToProps,
    { login, setAlert }
)(SignIn);
