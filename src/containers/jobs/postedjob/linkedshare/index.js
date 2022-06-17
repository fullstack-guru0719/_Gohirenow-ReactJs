import React, {Component} from 'react';

import { connect } from "react-redux";

import { Link } from 'react-router-dom';

import axios from 'axios';

import {  compose } from 'redux';

import { withRouter } from 'react-router-dom';

import MetaTags from 'react-meta-tags';

import {Helmet} from "react-helmet";

import {FacebookProvider, Share} from "react-facebook";

import FbWelcome from "../../../../assets/FbWelcome.svg";


import ShareLink from "react-linkedin-share-link";


import {CopyToClipboard} from "react-copy-to-clipboard";

import Swal from "sweetalert2";




class linkedin extends Component {

    render() {
        let { dispatch, loggedIn }= this.props;
        return (
                                <div className="footer-icon1 medium-fa pointer mr-2 " style={{width: "55px",
                                    height: "55px",    fontSize: "32px"}}>
                                    <ShareLink link={`https://www.gohirenow.com/job-details-hire/${this.props.match.params.id}`}>
                                        {link => (
                                            <a className={'unstyled-link'} href={link} target='_blank'>
                                                <i className="fa fa-linkedin medium-fa-inner" />
                                            </a>
                                        )}
                                    </ShareLink>
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
)(linkedin);