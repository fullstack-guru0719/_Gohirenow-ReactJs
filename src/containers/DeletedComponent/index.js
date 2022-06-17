import React, {Component} from 'react';

import { connect } from "react-redux";

import { Link } from 'react-router-dom';

import axios from 'axios';

import {apiPath} from '../../services/config'

import {  compose } from 'redux';

import { withRouter } from 'react-router-dom';

import MetaTags from 'react-meta-tags';

import {Helmet} from "react-helmet";
 

class DeletePage extends Component {

    componentDidMount(){
        window.scrollTo(0, 0);
    }
    render() {
        let{dispatch, loggedIn, text }= this.props;

        return (
            <div className={loggedIn ? "registration greybf":"registration whitebg"} id="contact">
                <div className="container pt-3">
                    <div className="row inner-div text-center job-post d-flex flex-column align-items-center  ">
                        <h2 className="text-center" style={{
                            padding: "94px 15px"
                        }}>{ text && text }</h2>
                        <Link to={"/"} style={{width:"38%"}}>
                            <button className="btn" style={{
                                width:"100%",
                                fontSize: "21.746px",
                                padding: "18px 15px",
                                marginBottom: "53px"
                            }}>
                                Go To Homepage
                            </button>

                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        loggedIn: auth.isAuthenticated,
        userStoreData: auth.user
    };
};

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispachToProps)
)(DeletePage);
