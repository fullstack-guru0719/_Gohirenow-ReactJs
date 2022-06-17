import React, {Component} from 'react';

import { connect } from "react-redux";

import { Link } from 'react-router-dom';

import axios from 'axios';

import {  compose } from 'redux';

import { withRouter } from 'react-router-dom';

import MetaTags from 'react-meta-tags';

import {Helmet} from "react-helmet";

import {FacebookProvider, Share} from "react-facebook";

import FbWelcome from "../../../assets/FbWelcome.svg";

import ShareLink from "react-twitter-share-link";
import Linkedin from './linkedshare/index'



import {CopyToClipboard} from "react-copy-to-clipboard";

import Swal from "sweetalert2";



window.gtag('event', 'conversion', {'send_to': 'AW-693012316/gcBVCLmr-uIBENyOusoC'});

class postedjob extends Component {
    componentWillMount() {
        window.scroll(0,0);
    }

    viewjob(){

        // const { props: { history: { location } } } = this;
        let jobid = this.props.match.params.id;
        this.props.history.push(`/job-details-hire/${jobid}`);
    }
  clipboardcpot = () =>{

    Swal.fire({
        title: `www.gohirenow.com/job-details-hire/${this.props.match.params.id} has been copied`,
        // text: ``,,
        type: "success",
        timer: 2000,
        showConfirmButton: false
    }).then((result) => {})
    };
    render() {
        let { dispatch, loggedIn,trans_subs }= this.props;
        const isFreeClient = trans_subs && (!trans_subs.subscriptionStatus  || (trans_subs.subscriptionStatus && trans_subs.subscriptionStatus.planName == "Free"));

        return (
            <div className={loggedIn ? "registration greybf":"registration whitebg"} id="billing">
                <div className="container">
                    <div className="row  flex-column align-items-center heading-row p-0 ">
                        <h2 className="m-5 title-posted-job-mobile">
                            {isFreeClient ? 'Your job post is awaiting approval' : 'Your job has been posted'}</h2>
                        <p className="mb-5 subtitle-posted-job-mobile" style={{
                            textDecoration: "none",
                            color: "black",
                            padding: "0px 14px"
                        }}>What you want to do next?</p>
                    </div>
                    <div className="row pb-5 mobile-containers-wrapper" style={{    justifyContent: "center"}}>
                        <div className="mobile-containers-social whitebg mr-3" style={{width:"30%", height: "270px",border: "1px solid #EBEBEB"}}>
                            <p className="text-center" style={{    fontWeight: "900", marginTop: "11%"}}>Share my job</p>
                            <div className="mobile-poviders-block cont-center flex-row" style={{ marginTop: "23%"}}>
                                <FacebookProvider appId="2305648766322451">
                                    <Share href={`https://www.gohirenow.com/job-details-hire/${this.props.match.params.id}`}>
                                        {({ handleClick, loading }) => (
                                            <div className="footer-icon1 medium-fa pointer" style={{width: "55px",
                                                height: "55px",    fontSize: "32px"}}>
                                                <i className="fa fa-facebook medium-fa-inner fa-xs"   onClick={handleClick} src={FbWelcome} />
                                            </div>
                                        )}
                                    </Share>
                                </FacebookProvider>
                                <div className="footer-icon1 medium-fa pointer mr-2 ml-2" style={{width: "55px",
                                    height: "55px",    fontSize: "32px"}}>
                                    <ShareLink link={`https://www.gohirenow.com/job-details-hire/${this.props.match.params.id}`}>
                                        {link => (
                                            <a className={'unstyled-link'} href={link} target='_blank'>
                                                <i className="fa fa-twitter medium-fa-inner" />
                                            </a>
                                        )}
                                    </ShareLink>
                                </div>
                                <Linkedin/>
                                {/*<CopyToClipboard text={`https://www.gohirenow.com/job-details-hire/${this.props.match.params.id}`}*/}
                                                 {/*onCopy={() =>  this.clipboardcpot()}>*/}
                                    {/*<div className="footer-icon1 pointer medium-fa">*/}
                                        {/*<p style={{    fontSize: "17px"}}>www</p>*/}
                                    {/*</div>*/}
                                {/*</CopyToClipboard>*/}
                            </div>
                        </div>
                        {/*<div className=" whitebg job-post text-center" style={{width:"30%", height: "270px"}}>*/}
                            {/*<p className="text-center "*/}
                               {/*style={{    fontWeight: "900", marginTop: "11%"}}>*/}
                                {/*Make money Invite a friend<br/>*/}
                                {/*( 50$ per referral )*/}
                            {/*</p>*/}
                            {/*<button className="btn" style={{marginTop: "24%",*/}
                                {/*marginTop: "15%",*/}
                                {/*width: "80%",*/}
                                {/*fontSize: "16px",*/}
                                {/*letterSpacing: "2px"}} disabled={true} >INVITE</button>*/}
                        {/*</div>*/}
                        <div className="mobile-reposting-buttons whitebg d-flex flex-column job-post align-items-center ml-3" style={{width:"30%", height: "270px"
                            ,border: "1px solid #EBEBEB"}}>
                            <p className="text-center"  style={{    fontWeight: "900", marginTop: "11%"}}>Other</p>
                            <button className="btn" onClick={()=> this.viewjob()} style={{
                                marginTop: "3%",
                                width: "80%",
                                fontSize: "16px",
                               }}>VIEW MY JOB</button>
                                 <button className="btn" onClick={()=>  this.props.history.push(`/post-job`)} style={{
                                    marginTop: "7%",
                                    width: "80%",
                                    fontSize: "16px",

                                    backgroundColor: "transparent",
                                    color: "rgb(237, 123, 24)",
                                    border:"1px solid rgb(237, 123, 24)"
                                }}>POST A NEW JOB</button>

                            <button className="btn"
                                    onClick={()=>  this.props.history.push(`/search-work`)}
                                    style={{
                                marginTop: "7%",
                                width: "80%",
                                fontSize: "16px",
                                padding: "9px 18px"}}>BROWSE CANDIDATES</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ auth, billing }) => {
    return {
        loggedIn: auth.isAuthenticated,
        userStoreData: auth.user,
        trans_subs: billing && billing.subscripiotnandtrans,
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
)(postedjob);
