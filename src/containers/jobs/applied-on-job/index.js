import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {  compose } from 'redux';
import { withRouter } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import {Helmet} from "react-helmet";
import { FacebookProvider, Share } from 'react-facebook';
import FbWelcome from "../../../assets/FbWelcome.svg";
import ShareLink from 'react-twitter-share-link';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Swal from "sweetalert2";

import { apiPath } from "../../../services/config";

class appliedjob extends Component {
    state={
        userDataskill:"",
        skills:[]
    }
    componentDidMount(){
        window.scrollTo(0, 0);
        axios.get(apiPath + "/account/profile").then((res) => {
            this.setState({userDataskill:res.data.skills && res.data.skills[0].id})
        });
        axios.get(apiPath + "/worker/jobs/detail/"+this.props.match.params.id ).then((res)=>{
            this.setState({skills: res.data.jobSkills});
        })
    }

    viewjob(){
        let jobid = this.props.match.params.id;
        this.props.history.push(`/job-details-hire/${jobid}`);
    }

    clipboardcpot = () => {
    Swal.fire({
        title: `https://www.gohirenow.com/job-details-hire/${this.props.match.params.id} has been copied`,
        type: "success",
        timer: 2000,
        showConfirmButton: false
    }).then((result) => {}
    )}
    makeurl(){
        let {skills}=  this.state;
        if(skills.length>0){
           return skills.map(skill => skill.id).toString()
        }
    }
    gotosearch=()=>{
        localStorage.setItem("browsesmiliar", true)
        this.props.history.push(`/search-work?tagsQuery=${this.makeurl()}`)
    }
    render() {
        let { dispatch, loggedIn }= this.props;
        return (
            <div className={loggedIn ? "registration greybf":"registration whitebg"} id="billing">
                <div className="container">
                    <div className="row  flex-column align-items-center heading-row p-0 ">
                        <h2 className="m-5 title-posted-job-mobile">Your application has been sent</h2>
                        <p className="mb-5 subtitle-posted-job-mobile" style={{
                            textDecoration: "none",
                            color: "black",
                            padding: "0px 14px"
                        }}>What you want to do next?</p>
                    </div>
                    <div className="row pb-5 mobile-containers-wrapper" style={{    justifyContent: "center"}}>
                        <div className=" whitebg mr-3 mobile-containers-social" style={{width:"30%", height: "230px",border: "1px solid #EBEBEB"}}>
                            <p className="text-center" style={{    fontWeight: "900", marginTop: "11%"}}>Share this job with your <br/> friend and family</p>
                            <div className="mobile-poviders-block cont-center" style={{ marginTop: "6%"}}>
                                {/*<div className="footer-icon2 d-flex ">*/}
                                    {/*<a href="https://www.facebook.com/gohirenowcom" target="_blank" > <i className="fa fa-facebook" /> </a>*/}
                                    {/*<a href="https://twitter.com/GoHireNow" target="_blank"><i className="fa fa-twitter ml-2 mr-2" /> </a>*/}
                                    {/*<a href="https://www.instagram.com/gohirenow/" target="_blank"><i className="fa fa-linkedin" /></a>*/}
                                {/*</div>*/}
                                <div className="d-flex" style={{
                                    justifyContent:"space-evenly"
                                }}>
                                    <FacebookProvider appId="2305648766322451">
                                        <Share href={`https://www.gohirenow.com/job-details-work/${this.props.match.params.id}`}>
                                            {({ handleClick, loading }) => (
                                                <div className="footer-icon1 pointer">
                                                    <i className="fa fa-facebook"   onClick={handleClick} src={FbWelcome} style={{width: "55px",
                                                        height: "55px", fontSize: "32px"}} />
                                                </div>
                                            )}
                                        </Share>
                                    </FacebookProvider>
                                    <div className="footer-icon1 pointer">
                                        <ShareLink link={`https://www.gohirenow.com/job-details-work/${this.props.match.params.id}`}>
                                            {link => (
                                                <a className={'unstyled-link'} href={link} target='_blank'>
                                                    <i className="fa fa-twitter" style={{width: "55px",
                                                        height: "55px",    fontSize: "32px"}} />
                                                </a>
                                            )}
                                        </ShareLink>
                                    </div>
                                    <CopyToClipboard text={`https://www.gohirenow.com/job-details-work/${this.props.match.params.id}`}
                                                     onCopy={() =>  this.clipboardcpot()} style={{width: "55px",
                                        height: "55px", fontSize: "32px"}}>
                                        <div className="footer-icon1 pointer">
                                            <p style={{    fontSize: "20px"}}>www</p>
                                        </div>
                                    </CopyToClipboard>
                                </div>
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
                        <div className="mobile-reposting-buttons job-aplliend whitebg ml-3 d-flex flex-column job-post align-items-center" style={{width:"30%", height: "230px"
                            ,border: "1px solid #EBEBEB"}}>
                            <p className="text-center"  style={{    fontWeight: "900", marginTop: "11%"}}>Other</p>
                            <button className="btn" onClick={()=>  this.gotosearch()}  style={{
                                marginTop: "3%",
                                width: "80%",
                                fontSize: "16px",
                            }}>BROWSE SIMILAR JOBS</button>
                            <button className="btn" onClick={()=>  this.props.history.push(`/search-work`)} style={{
                                marginTop: "4%",
                                width: "80%",
                                fontSize: "16px",

                                backgroundColor: "transparent",
                                color: "rgb(237, 123, 24)",
                                border:"1px solid rgb(237, 123, 24)"
                            }}>BROWSE ALL JOBS</button>

                            {/*<button className="btn"*/}
                                    {/*onClick={()=>  this.props.history.push(`/search-work`)}*/}
                                    {/*style={{*/}
                                        {/*marginTop: "7%",*/}
                                        {/*width: "80%",*/}
                                        {/*fontSize: "16px",*/}
                                        {/*padding: "9px 18px"}}>BROWSE CANDIDATES</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ auth }) => {
    return {
        loggedIn: auth.isAuthenticated,
        userStoreData: auth.user,
        auth
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
)(appliedjob);