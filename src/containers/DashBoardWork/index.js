import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from '../alerts/actions';
import { restPassword } from '../auth/actions';
import {  Redirect } from 'react-router-dom';
import Spinner from '../../components/spinner/index';
import { getAppliedJobs, getMatchingJobs, getLatestJobs } from '../jobs/actions';
import {getProfileInfo, getProgress } from '../accountSetting/actions';

import MetaTags from 'react-meta-tags';
import WwwWelcome from "../../assets/WwwWelcome.svg";
import TwitterWelcome from "../../assets/TwitterWelcome.svg";

import axios from 'axios';
import {apiPath} from '../../services/config';
import MediaQuery from "react-responsive";

import Swal from "sweetalert2";
import employer from "../../assets/employer_icon.svg";
import { FacebookProvider, Share } from 'react-facebook';
import FbWelcome from "../../assets/FbWelcome.svg";
import ShareLink from 'react-twitter-share-link';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {mobileVendor} from "react-device-detect";
import TextParser from "../../utils/TextParser";
import {ShortSalaryTypeById} from "../../utils/constants/SalaryTypes";


const DashBoardWork = ({userId,
                           jobApplied, jobMatching, jobLatest,
                           jobsloader,
                           progress,
                           getAppliedJobs,
                           getMatchingJobs,
                           getLatestJobs,
                           getProgress,
                           getProfileInfo,
                           history,
                           isAuthenticated,
                           account,
}) => {
    const [progresser, setprogress]=useState("0")
    useEffect(() => {
        window.scroll(0,0);
        getAppliedJobs();
        getMatchingJobs();
        getLatestJobs();
        getProgress(userId);
        getProfileInfo(userId);
        axios.get(`${apiPath}/account/complete-profile`).then((res)=>{
            setprogress(res.data.progress)
        })
        if(   account &&     account.profile && account.profile.skills
        ){

            setFormData({...formData,skills:account.profile.skills})
        }

    }, [getAppliedJobs, getMatchingJobs, getLatestJobs, getProgress]);

    const [formData, setFormData] = useState({
        username:"",
        jobFilter:"",
        style:"",
        skills:[]
    });
    let styler = {
        width: progresser && progresser + '%'
    };
    const { username,jobFilter,style, skills } = formData;
    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const jobclicked = (obj, index)=>{
        localStorage.setItem("jobId",obj.id );
        history.push(`/job-details-work/${obj.id}`);
    }
    if (isAuthenticated) {
        if (userId===1) return <Redirect to='/dashboard' />
    }
    const localdate=(date)=> {
        if (mobileVendor == "Apple") {
            return date
        }
        else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
    };

    const clipboardcpot=()=>{
        Swal.fire({
            title: "www.gohirenow.com has been copied",
            // text: ``,,
            type: "success",
            timer: 2000,
            showConfirmButton: false


        }).then((result) => {


        })
    }
    return (
        <Fragment>
            <MetaTags>
                <title>GoHireNow - Hire Top‑Quality Virtual Assistants</title>
            </MetaTags>
            <div className="registration dashboard dashboard-work" id="billing">
                {
                    jobsloader ? <div className="pt-5 pb-5"> <Spinner/></div>:
                        <div className="container ">
                            <div className="row heading-row ">
                                <div className="col-sm-12 pl-0">
                                    <h2 className="font-weight-bold">Dashboard</h2>
                                </div>

                            </div>
                            <div className="row main-row " style={{paddingLeft:"0px!important"}} id="client-dash">
                                <div className="col-md-8 pl-0">
                                    <div className="row">
                                        <div className="col-md-12 pl-0">
                                            <p className="font-weight-bold">Matching jobs by skills</p>
                                            <MediaQuery maxDeviceWidth="767px">
                                                {
                                                    !jobsloader && jobMatching && jobMatching.length > 0 &&
                                                    jobMatching.map((item, index) => {
                                                        if(index< 6){
                                                            return (
                                                                <div key={index + "title"} className='active-job-posts-mobile-container'>
                                                                    <div className='a-j-p-avatitle'>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-ava-container'>
                                                                            <img src={item.profilePicturePath ? item.profilePicturePath : employer} alt="" />
                                                                        </div>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-title'><TextParser text={item.title}/></div>
                                                                    </div>
                                                                    <div className='a-j-p-details'>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>TYPE</span>
                                                                            <span>{item.type}</span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>SALARY</span>
                                                                            <span  className="pointer">
                                                                                 ${item.salary}/{ShortSalaryTypeById(item.salaryTypeId)}
                                                                             </span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>DATE</span>
                                                                            <span>
                                                                                <Moment fromNow ago>
                                                                                    { localdate(new Date(item.activeDate))}
                                                                                </Moment> ago
                                                                             </span>
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                        }
                                                    })
                                                }
                                                {
                                                    !jobsloader && jobMatching && jobMatching.length === 0 &&
                                                    <div className={'empty-dashboard-table'}>
                                                        There is no job matching your skills
                                                    </div>
                                                }
                                            </MediaQuery>
                                            <MediaQuery minDeviceWidth="768px">
                                                <div className="second-table">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <th >JOB TITLE</th>
                                                            <th >TYPE</th>
                                                            <th >SALARY</th>
                                                            <th >DATE</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            !jobsloader && jobMatching && jobMatching.length > 0 &&
                                                            jobMatching.map((item, index) => {
                                                                if(index< 6){
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td ><span  className="pointer" onClick={() => jobclicked(item, index)}
                                                                            ><TextParser text={item.title}/></span></td>
                                                                            <td>{item.type}</td>
                                                                            <td style={{textAlign:"center"}} >${item.salary}/{ShortSalaryTypeById(item.salaryTypeId)}</td>
                                                                            <td style={{textAlign:"center"}}><Moment fromNow ago>
                                                                                { localdate(new Date(item.activeDate))}
                                                                            </Moment> ago</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        {
                                                            !jobsloader && jobMatching && jobMatching.length === 0 &&
                                                            <tr>
                                                                <td colSpan={'4'} style={{
                                                                    paddingRight:"0px"
                                                                }}>There is no job matching your skills.</td>
                                                            </tr>
                                                        }

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </MediaQuery>
                                        </div>
                                    </div>
                                    <div className="row padd pl-0" id="favoritesworker">
                                        <div className="col-md-12 pl-0">
                                            <p className="font-weight-bold">Recent jobs</p>
                                            <MediaQuery maxDeviceWidth="767px">
                                                {
                                                    !jobsloader &&   jobLatest && jobLatest.length > 0 &&
                                                    jobLatest.map((item, index) => {
                                                        if(index< 6){
                                                            return (
                                                                <div key={index + "title"} className='active-job-posts-mobile-container'>
                                                                    <div className='a-j-p-avatitle'>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-ava-container'>
                                                                            <img src={item.profilePicturePath ? item.profilePicturePath : employer} alt="" />
                                                                        </div>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-title'>
                                                                            <TextParser text={item.title}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className='a-j-p-details'>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>TYPE</span>
                                                                            <span>{item.type}</span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>SALARY</span>
                                                                            <span  className="pointer">
                                                                                 ${item.salary}/{ShortSalaryTypeById(item.salaryTypeId)}
                                                                             </span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>DATE</span>
                                                                            <span>
                                                                                <Moment fromNow ago>
                                                                                    { localdate(new Date(item.activeDate))}
                                                                                </Moment> ago
                                                                             </span>
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                        }
                                                    })
                                                }
                                            </MediaQuery>
                                            <MediaQuery minDeviceWidth="768px">
                                                <div className="second-table" >
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <th >JOB TITLE</th>
                                                            <th >TYPE</th>
                                                            <th >SALARY</th>
                                                            <th >DATE</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            !jobsloader &&   jobLatest && jobLatest.length > 0 &&
                                                            jobLatest.map((item, index) => {
                                                                if(index<6){
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td><span className="pointer" onClick={() => jobclicked(item, index)}><TextParser text={item.title}/></span></td>
                                                                            <td>{item.type}</td>
                                                                            <td>${item.salary}/{item.salaryType && item.salaryType.replace("ly","").replace("LY","")}</td>
                                                                            <td><Moment fromNow ago>
                                                                                { localdate(new Date(item.activeDate))}
                                                                            </Moment> ago</td>
                                                                        </tr>
                                                                    )
                                                                }

                                                            })
                                                        }

                                                        {
                                                            !jobsloader &&   jobLatest && jobLatest.length === 0 &&
                                                            <tr className="d-flex  align-items-center">
                                                                <td>No data</td>
                                                            </tr>
                                                        }


                                                        </tbody>
                                                    </table>
                                                </div>
                                            </MediaQuery>
                                        </div>
                                    </div>
                                    <div className="row padd pl-0" id="favoritesworker">
                                        <div className="col-md-12 pl-0">
                                            <p className="font-weight-bold">Recent job applications</p>
                                            <MediaQuery maxDeviceWidth="767px">
                                                {
                                                    !jobsloader  && jobApplied && jobApplied.length > 0 &&
                                                    jobApplied.map((item, index) => {
                                                        if(index< 6){
                                                            return (
                                                                <div key={index + "title"} className='active-job-posts-mobile-container'>
                                                                    <div className='a-j-p-avatitle'>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-ava-container'>
                                                                            <img src={item.profilePicturePath ? item.profilePicturePath : employer} alt="" />
                                                                        </div>
                                                                        <div onClick={() => jobclicked(item, index)} className='a-j-p-title'>
                                                                            <TextParser text={item.title}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className='a-j-p-details'>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>TYPE</span>
                                                                            <span>{item.type}</span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>SALARY</span>
                                                                            <span  className="pointer">
                                                                                 ${item.salary}/{ShortSalaryTypeById(item.salaryTypeId)}
                                                                             </span>
                                                                        </div>
                                                                        <div className='a-j-p-details-row'>
                                                                            <span className='a-j-p-details-row-header'>DATE</span>
                                                                            <span>
                                                                                <Moment fromNow ago>
                                                                                    { localdate(new Date(item.activeDate))}
                                                                                </Moment> ago
                                                                             </span>
                                                                        </div>
                                                                    </div>
                                                                </div>)
                                                        }
                                                    })
                                                }

                                                {
                                                    !jobsloader && jobApplied && jobApplied.length === 0 &&
                                                    <div className={'empty-dashboard-table'}>
                                                        You did not apply on any job
                                                    </div>
                                                }
                                            </MediaQuery>
                                            <MediaQuery minDeviceWidth="768px">
                                                <div className="second-table" style={{marginBottom:"15%"}}>
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <th >JOB TITLE</th>
                                                            <th >TYPE</th>
                                                            <th >SALARY</th>
                                                            <th >DATE</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            !jobsloader  && jobApplied && jobApplied.length > 0 &&
                                                            jobApplied.map((item, index) => {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td ><span className="pointer" onClick={() => jobclicked(item, index)}
                                                                        ><TextParser text={item.title}/></span></td>
                                                                        <td>{item.type}</td>
                                                                        <td>${item.salary}/{item.salaryType && item.salaryType.replace("ly","").replace("LY","")}</td>
                                                                        <td><Moment fromNow ago>
                                                                            { localdate(new Date(item.activeDate))}
                                                                        </Moment> ago</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            !jobsloader && jobApplied && jobApplied.length === 0 &&
                                                            <tr>
                                                                <td colSpan={'4'}>You did not apply on any job</td>
                                                            </tr>
                                                        }

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </MediaQuery>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-md-4 pr-0 work-dash">
                                    <div className="sub-box-1">
                                        <div className="first-div">
                                            <p>Hi! &nbsp;

                                                <span className="text-capitalize pointer" onClick={()=> history.push("/profile-work")}>
                                        { account && account.profile && account.profile.fullName ? account.profile.fullName: ""}
                                        </span>
                                            </p>
                                        </div>
                                        <div className="second-div">
                                            <div className="first-inner-div">
                                                <Link to="/complete-profile">
                                                    <p>Complete Profile</p>
                                                </Link>
                                                <p>{progresser}%</p>

                                            </div>
                                            <div className="second-inner-div">
                                                <div className="bar"
                                                     style={styler}
                                                />
                                            </div>
                                            {
                                                parseInt(progresser)<100 &&
                                                <div className="complete-btn" style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    paddingTop: "8%"
                                                }}>
                                                    <button className="btn specific-btn"
                                                            onClick={()=>{
                                                                history.push("/complete-profile")
                                                            }}>Complete</button>
                                                </div>
                                            }
                                        </div>

                                    </div>

                                    <div className="sub-box-1">
                                        <h1 className="text-center" style={{
                                            fontSize:"33px"
                                        }}>
                                            <b>Your friend need an online job?</b>
                                        </h1>
                                        <p className="text-center">
                                            Invite them today on <br/><b>GoHireNow</b>
                                        </p>
                                        <div className="d-flex  " style={{
                                            justifyContent:"space-evenly"
                                        }}>

                                            <FacebookProvider appId="2305648766322451">
                                                <Share href="https://www.gohirenow.com">
                                                    {({ handleClick, loading }) => (
                                                            <div className="footer-icon1 pointer">
                                                                 <i className="fa fa-facebook"   onClick={handleClick} src={FbWelcome} />
                                                            </div>
                                                    )}
                                                </Share>
                                            </FacebookProvider>
                                            <div className="footer-icon1 pointer">
                                                <ShareLink link='https://www.gohirenow.com'>
                                                    {link => (
                                                        <a className={'unstyled-link'} href={link} target='_blank'>
                                                               <i className="fa fa-twitter" />
                                                        </a>
                                                    )}
                                                </ShareLink>
                                            </div>
                                            <CopyToClipboard text={"www.gohirenow.com"}
                                                             onCopy={() =>  clipboardcpot()}>
                                                    <div className="footer-icon1 pointer">
                                                        <p>www</p>
                                                    </div>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                    <div className="sub-box-1">
                                        <div className="first-div">
                                            <p>
                                                <span>
                                                    YOUR SKILLS
                                                </span>
                                            </p>
                                        </div>
                                        <div className="second-div">
                                            <div className="first-inner-div inline">
                                                <p className="pointer">
                                            {
                                                account && account.profile && account.profile    &&   account.profile.skills &&
                                                account.profile.skills.map((item, index) => {
                                                    return (
                                                            <span key={index} className="pointer" onClick={()=>{
                                                                history.push(`/search-work?tagsQuery=${item.id}`)
                                                            }
                                                            }>{item.name}{index != account.profile.skills.length - 1 ? ', ' : ''}</span>
                                                    )
                                                })
                                            }
                                                </p>
                                            </div>
                                            {account && account.profile && account.profile.skills && account.profile.skills.length === 0 &&
                                            <div className="first-inner-div">
                                                <p>You didn't add any skills yet.</p>
                                            </div>
                                            }
                                        </div>
                                        <div className="buttons d-flex justify-content-end">
                                            <button className="btn specific-btn "
                                                    onClick={()=>{
                                                        history.push("/edit-profile")
                                                    }}
                                            >ADD</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }

            </div>
        </Fragment>
    )
};


const mapStateToProps = ({ auth, jobs, account, }) => ({
    userId: auth.user &&  auth.user.userTypeId,
    isAuthenticated:auth.isAuthenticated,
    jobApplied: jobs.jobApplied,
    jobMatching: jobs.jobMatching,
    jobLatest: jobs.jobLatest,
    jobsloader:jobs.loading,
    progress: account.progress,
    account,

});

export default connect(
    mapStateToProps,
    { getAppliedJobs, getMatchingJobs, getLatestJobs, getProgress, setAlert ,getProfileInfo}
)(DashBoardWork);

