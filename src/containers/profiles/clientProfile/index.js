import React, { Fragment, useState, useEffect } from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import {apiPath} from '../../../services/config';
import Moment from 'react-moment';
import placeholder from "../../../assets/employer_icon.svg"
import Spinner from '../../../components/spinner'
import MediaQuery from "react-responsive";
import employer from "../../../assets/employer_icon.svg";
import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";
import TextParser from "../../../utils/TextParser";
import {ShortSalaryTypeById} from "../../../utils/constants/SalaryTypes";

const CompanyProfile = ({ history , match, auth: {  user } }) => {
    const [profileData, setProfile]=useState(null);
    const [loader, setLoader]=useState(true);
    const [ NotFound , SetNotFound ] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(apiPath+'/account/profile').then((res)=>{

            setProfile(res.data);
            setLoader(false)
        }).catch(()=>{})

    }, []);
    const gotohriewith = (value, red) => {

        if (red === "editjob") {
            localStorage.setItem("jobId",value);
            history.push(`/edit-job/${value}`);
        }
        else if (red === "viewjob") {
            localStorage.setItem("jobId",value)
            history.push(`/job-details-hire/${value}`);
        }
    }
    const localdate=(date)=>{
        if (mobileVendor == "Apple") {
            return date
        } else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
    }

    const placeholding= profileData &&profileData.profilePicturePath ? profileData.profilePicturePath:placeholder;
    return (
        <div className="registration" id="company-profile">
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
            {
                loader ? <div className="container"><Spinner/></div>:
                    <div className="container   " style={{}}>
                        <div className="row  top-div pl-0" style={{padding: "5% 0px 2% 0px"}} >
                            <h2>Company Profile</h2>
                            <div className="button">

                                {
                                    user && user.userTypeId===1 &&  <button className="btn text-uppercase" onClick={() => history.push(`/profile-edit-client/`)}>
                                        Edit
                                    </button>
                                }
                                {
                                    user && user.userTypeId===2 &&
                                    <button className="btn text-uppercase">Message</button>
                                }
                            </div>
                        </div>
                        <div className="row margin-div">
                            <div className=" col-md-4 pl-0">
                                <div className="row left-side-outer">
                                    <div className="col-sm-12 pl-0 left-side-inner">
                                        <div>
                                            <div className="user-div">
                                                <div className="user-pic">
                                                    <img src={placeholding} alt="" />
                                                </div>
                                                <h4>{profileData !== null && profileData.companyName}</h4>
                                                <p>{profileData!==null && profileData.countryName}</p>
                                            </div>
                                            <div className="member-details">
                                                <p>Member since:&nbsp;{
                                                    profileData!==null && profileData.memberSince !== null &&
                                                 <span> <Moment  format="MMM D YYYY">
                                                    {
                                                        // localdate(new Date(profileData.memberSince))
                                                        profileData.memberSince
                                                    }
                                                </Moment></span>}</p>
                                                <p>Last logged:&nbsp;{profileData!==null && profileData.lastLoginTime!==null&&
                                                <span> <Moment fromNow ago>
                                                    { localdate(new Date(profileData.lastLoginTime))}
                                                </Moment> ago</span>}</p>
                                            </div>
                                            <div className="button">
                                                {/*{*/}
                                                    {/*user && user.userTypeId ===2 &&*/}
                                                    {/*<button className="btn text-uppercase">Report</button>*/}
                                                {/*}*/}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-md-8 right-side pr-0">
                                <div className="right-side-top">
                                    {profileData!==null && profileData.introduction !==null &&  <h4><TextParser text={profileData.introduction}/></h4>}
                                    {profileData!== null && profileData.introduction===null && <p>Your Title: N/A</p>}
                                    {profileData!== null && profileData.description &&profileData.description
                                    && <>

                                        <p style={{height:"100%"}}><TextParser text={profileData.description}/></p>
                                    </>
                                    }
                                    {
                                        profileData!== null && profileData.description===null && <p className="">Your Description: N/A</p>
                                    }
                                </div>
                                <div className="bottom-head">
                                    <h4>Active Jobs</h4>
                                </div>
                                <MediaQuery maxDeviceWidth="767px">
                                    {
                                            profileData!== null && profileData.activeJobs.length > 0 &&
                                            profileData.activeJobs.map((item, index) => {
                                                return (
                                                    <div key={index + "title"} className='active-job-posts-mobile-container'>
                                                        <div className='a-j-p-avatitle'>
                                                            <div onClick={() => { gotohriewith(item.id, "viewjob") }} className='a-j-p-ava-container'>
                                                                <img src={employer} alt="" />
                                                            </div>
                                                            <div onClick={() => { gotohriewith(item.id, "viewjob") }} className='a-j-p-title'><TextParser text={item.title}/></div>
                                                        </div>
                                                        <div className='a-j-p-details'>
                                                            <div className='a-j-p-details-row'>
                                                                <span className='a-j-p-details-row-header'>TYPE</span>
                                                                <span>{item.type}</span>
                                                            </div>
                                                            <div className='a-j-p-details-row'>
                                                                <span className='a-j-p-details-row-header'>SALARY</span>
                                                                <span  className="pointer">
                                                                                 ${item.salary}{ShortSalaryTypeById(item.salaryTypeId)}
                                                                             </span>
                                                            </div>
                                                            <div className='a-j-p-details-row'>
                                                                <span className='a-j-p-details-row-header'>DATE</span>
                                                                <span>
                                                                                <Moment fromNow ago>
                                                                                {localdate(new Date(item.activeDate))}
                                                                                </Moment>
                                                                    &nbsp;ago
                                                                             </span>
                                                            </div>
                                                        </div>
                                                    </div>)
                                        })
                                    }
                                </MediaQuery>
                                <MediaQuery minDeviceWidth="768px">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th style={{minWidth:"250px", maxWidth:"250px", width:"250px"}}>JOB TITLE</th>
                                            <th style={{minWidth:"100px",maxWidth:"100px",width:"100px", textAlign:"center"}}> TITLE</th>
                                            <th style={{minWidth:"100px",maxWidth:"100px", width:"100px", textAlign:"center"}}>SALARY</th>
                                            <th style={{minWidth:"100px",maxWidth:"100px", width:"100px", textAlign:"center"}}>DATE</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            profileData!== null && profileData.activeJobs.length > 0 ?
                                                profileData.activeJobs.map((item)=>{
                                                return (
                                                    <tr>
                                                        <td  style={{minWidth:"250px", maxWidth:"250px", width:"250px",fontWeight:"bold"}}>
                                                            <span onClick={() => { gotohriewith(item.id, "viewjob") }} className="pointer">
                                                                <TextParser text={item.title}/>
                                                            </span>
                                                        </td>
                                                        <td  style={{minWidth:"100px",maxWidth:"100px",width:"100px", textAlign:"center"}}>
                                                            {item.type}
                                                        </td>
                                                        <td style={{minWidth:"100px",maxWidth:"100px", width:"100px", textAlign:"center"}}>
                                                            ${item.salary}
                                                        </td>
                                                        <td style={{minWidth:"100px",maxWidth:"100px", width:"100px", textAlign:"center"}}>
                                                            <Moment fromNow ago>{localdate(new Date(item.activeDate))}</Moment> ago
                                                        </td>
                                                    </tr>
                                                )
                                                }): <tr>
                                                <td className='no-jobs' colSpan='4'>No active job posts.</td>
                                                    </tr>
                                        }
                                        </tbody>
                                    </table>
                                </MediaQuery>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}


const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(CompanyProfile);
