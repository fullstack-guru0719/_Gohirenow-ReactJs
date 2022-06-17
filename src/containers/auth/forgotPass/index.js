import React, { Fragment, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../alerts/actions';
import { passwordForgot,resetForgot} from '../actions'
import MetaTags from 'react-meta-tags';

import {Helmet} from "react-helmet";

const ForgotPassword = ({
    isAuthenticated,
    passwordForgot,
                            forgotpassworderr,
                            resetForgot,
                            resetbtn,
    extratexts
}) => {
    const [formData, setFormData] = useState({
        email:""
    });
    const [err, setErr]=useState("")
    useEffect(() => {
        window.scroll(0,0);
        resetForgot()
    },[]);

const { email } = formData;

const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async ()=> {    
       if(formData.email==="" ){
           setErr("Please enter your email address")
       }
       else if (!formData.email.includes("@")) setErr('Email is incorrect');
       else{
           setErr('')
           passwordForgot(email);
       }
    }

    return (
        <Fragment>
            <Helmet>
                <title>GoHireNow - Lost Password</title>
                <meta property="og:title" content="GoHireNow" data-react-helmet="true"/>
                <meta property="og:site_name" content="GoHireNow" data-react-helmet="true"/>
                <meta property="og:image" content="images/Capture.PNG" data-react-helmet="true" />
                <meta property="og:type" content="text" data-react-helmet="true"/>
                <meta property="og:url" content="https://www.gohirenow.com" data-react-helmet="true"/>
                <meta property="og:description" content="Have you lost your GoHireNow password? Use your email to retrieve it."
                      data-react-helmet="true" />
            </Helmet>
            <div className="registration">
                    <div className="container pt-3">
                        <div className="mobile-pb-0 inner-div" style={{padding:"50px"}}>
                            <div className="row flex-column top-text reset-password">
                                <h2 className="text-center">Reset your password</h2>
                            </div>
                            {
                                !resetbtn.includes("sent") &&
                                <div className="register-work-form">
                                    <div className="inner-pass-form">
                                        <input type="email" name="email" placeholder="Email Address" onChange={e => onChange(e)} />

                                    </div>
                                     <p className="collorred">{err ? err:forgotpassworderr}</p>
                                     {/*<p className="collorred">{extratexts}</p>*/}
                                    <div className="sign-up-btn">
                                        <button className="btn text-uppercase" onClick={handleSubmit}>{resetbtn}</button>
                                    </div>
                                    <div className="already-member">
                                        <p>Don't have an account? <Link to="register-hire">Sign Up</Link></p>                                    </div>
                                </div>
                            }
                            {
                                resetbtn.includes("sent") &&
                                <div className="already-member d-flex flex-column align-items-center">
                                    <h3 className="mobile-sent-password text-center mt-4 w-50">An email has been sent to your email address to change your password.</h3>
                                    <p className="mt-4">NOTE: This email can be placed in your Spam/Junk folder.</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
        </Fragment>
    )
};

  
  const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated ,
      resetbtn:auth.resetbtn,
      forgotpassworderr:auth.forgotpassworderr,
      extratexts:auth.extratexts
  });
  
  export default connect(
    mapStateToProps,
    { passwordForgot, setAlert, resetForgot }
  )(ForgotPassword);
