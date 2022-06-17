import React, { Component, Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../../components/spinner/index';
// const apiPath= "http://gohirenow.roshaanhomes.com";
import MetaTags from 'react-meta-tags';

import employeeplace from '../../../assets/employer_icon.svg';
import {apiPath} from '../../../services/config';
import queryString from "query-string";
import TextParser from "../../../utils/TextParser";
const config = {
    headers: {
        'Content-Type':'application/json'
    }
};


const JobApplication = ({ isAuthenticated,history, match  }) => {
        
    const [formData, setFormData] = useState({
        jobCover: "",
        includeResume: false
    });
    const [err, setErr]= useState("")
    const [btnerror, setBtn]= useState(false)
    const [clientdata , setClient]=useState({});
    const [loading, setLoad]=useState(true);

    useEffect(()=>{
        window.scrollTo(0, 0);
        let jobid = match.params.id || localStorage.getItem("jobId");

        if(jobid){

            axios.get(apiPath + "/worker/jobs/detail/"+jobid, config ).then((res)=>{

                setClient(res.data);
                setLoad(false);
            }).catch((err)=>{
            })
        }
    },[])

    const { jobCover, includeResume } = formData;

    const onChange = (e,value) =>{

       switch (value){
           case "resume":
               setFormData({ ...formData, [e.target.name]: e.target.checked });
               break;
           case "cover":
               setFormData({ ...formData, [e.target.name]: e.target.value });
                break;
           default:
               break;
            }
    }




    const apply=()=>{
        setErr("")
        if(formData.jobCover ===""){
            setErr("Cover letter cannot be empty")
        }
        else{
            setBtn(true);
           let data={
                "introduction":formData.jobCover,
                "jobId": clientdata.id,
                "userId": clientdata.userId,
                "resume": formData.includeResume,
                "coverLetter": formData.jobCover
            }
            axios.post(apiPath + "/worker/jobs/apply", data,config ).then((res)=>{
                setBtn(false);
                if(clientdata.jobSkills){
                    localStorage.setItem("appliedjobskillsid", clientdata.jobSkills[0].id);
                }
                history.push(`/job-applied/${clientdata.id}`)
            }).catch((err)=>{if(err.response && err.response.data && err.response.data.errorMessage){
                setErr(err.response.data.errorMessage   )
            }})
        }
    }

    return (
        <Fragment>
            <div
                className={isAuthenticated ? "how-it-works how-it-works-page greybg" : "how-it-works how-it-works-page whitebg"}>
                <div className="container" id="job-application">
                    <div className="row">
                        <div className="col-md-12 pl-0">
                            <h2>Job Application</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pl-0 pr-0">
                            {
                                loading ? <div className="mb-5"><Spinner/></div>:
                                    <div className="top-div">
                                        <div className="first">
                                            <div className="img-div pointer"  onClick={() => {
                                                localStorage.setItem("profileId",clientdata.client.id);
                                                history.push(`/client-profile/${clientdata.client.id}`) }}  >
                                                <img src={clientdata.client.profilePicturePath ? clientdata.client.profilePicturePath:employeeplace} alt="" />
                                            </div>

                                            <div className="content">
                                                <h4 onClick={() => {
                                                    history.push(`/job-details-work/${clientdata.id}`) }} className="pointer">{clientdata && <TextParser text={clientdata.title}/>}</h4>
                                                <h4
                                                    onClick={() => {
                                                        history.push(`/job-details-work/${clientdata.id}`) }} className="pointer">{clientdata && <TextParser text={clientdata.type}/>}</h4>


                                                <p onClick={() => {
                                                    localStorage.setItem("profileId",clientdata.client.id);
                                                    history.push(`/client-profile/${clientdata.client.id}`) }} className="pointer">{clientdata && clientdata.client && clientdata.client.companyName && clientdata.client.companyName }
                                                </p>
                                                <p>{clientdata.jobSkills &&clientdata.jobSkills.map((item,index)=>{
                                                    return clientdata.jobSkills.length-1 !== index ? item.name+", ":
                                                        item.name
                                                })}</p>
                                            </div>
                                        </div>
                                        <div className="second">
                                            <h3>${clientdata.salary && clientdata.salary  }/{clientdata.salaryType && clientdata.salaryType.replace("ly","").replace("ly","")}</h3>
                                            <p>{clientdata.type && clientdata.type}</p>
                                        </div>
                                    </div>
                            }
                            <div className="text-area">
                                <textarea onChange={e => onChange(e,"cover")} name="jobCover" placeholder="Why are you the perfect candidate for this job?"></textarea>
                            </div>
                            <p style={{color:"red"}}>{err}</p>
                            {/*<div className="checkbox">*/}
                                {/*<label><input type="checkbox" name="includeResume" className="includeResume"  onChange={e => onChange(e, "resume")} />Include my resume</label>*/}
                            {/*</div>*/}
                            <div className="button" style={{
                                display:"flex",
                                justifyContent:"flex-end"
                            }}>
                                <button className="btn" onClick={()=> apply()}>{btnerror ? <Spinner/>: "Apply"}</button>
                            </div>
                        </div>
                        <div className="bottom pl-0 pr-0">
                            <h4 className="text-uppercase">Advices</h4>
                            <p>Read the job detail carefully.<br/>

                                Tailor your application to match the job application requirements.<br/>

                                Describe why you are the perfect candidate for this job.<br/>

                                Write your qualifications out in full.<br/>

                                Provide references if requested.<br/>

                                Check your application for mistakes.<br/>

                                Don't leave out questions.<br/>

                                If you have a portfolio make sure to include it.<br/></p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}


const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    null
)(JobApplication);

