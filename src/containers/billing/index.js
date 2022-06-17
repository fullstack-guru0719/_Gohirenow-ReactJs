
import React, {Component,Fragment,useEffect,useState} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import {getTransactionDetails} from './actions';
import { setAlert } from '../alerts/actions';
import axios from 'axios'
import Spinner from '../../components/spinner/index';
import Moment from 'react-moment';

import {apiPath} from '../../services/config';
import MediaQuery from "react-responsive";

import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";


const Billing = ({ email,getTransactionDetails }) => {
    const [subscribe, setSubsribe] = useState(null);
    const [transaction_detail, setTransaction_detail] = useState(null);
    const [billingStatus, setbillingStatus] = useState(null);
    useEffect(() => {
        window.scroll(0,0);
        getTransactionDetails(email);
    axios.get(apiPath+"/client/subscription").then((res)=>{
        if(res.data.subscriptionStatus!== null){
            setSubsribe(res.data.subscriptionStatus);
        }
        else{
            setSubsribe("No Subscription Found")
        }

        setTransaction_detail(res.data.transactions);
        setbillingStatus(res.data.billingStatus);
    })
    }, []);

    const [formData, setFormData] = useState({
      
    });

    const localdate=(date)=>{
        if (mobileVendor == "Apple") {
            return date
        } else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
    }

    return (
        <Fragment>
           <div className="registration" id="billing">
               {/*<MetaTags>*/}
                   {/*<title>GoHireNow</title>*/}
                   {/*<meta name="description" content="" />*/}
               {/*</MetaTags>*/}
               {


                   !subscribe || !transaction_detail ? <Spinner/>:  <div className="container billing-page">
                       <div className="row main-row" style={{padding: "5% 0px 2% 0px"}}>
                           <div className="col-sm-8 specifics pl-0">
                               <div className="row">
                                   <div className="col-sm-12 pl-0 billings">
                                       <h2 className="font-weight-bold" style={{padding: "0% 0px 2% 0px"}}>Subscription</h2>
                                       <div className="first-table">
                                           <MediaQuery maxDeviceWidth="767px">
                                               <table style={{marginBottom: '20px'}}>
                                                   <thead>
                                                   <tr>
                                                       <th style={{ textAlign: 'center', width: '30%', paddingLeft: '0'}}>PLAN</th>
                                                       <th style={{textAlign: 'center', width: '70%'}}>JOB POSTS</th>
                                                   </tr>
                                                   </thead>
                                                   <tbody>
                                                   <tr>
                                                       <td style={{fontWeight: 'bold', textAlign: 'center', padding: '15px'}}>
                                                           {subscribe.planName}
                                                       </td>
                                                       <td style={{textAlign: 'center', padding: '15px'}}>
                                                           {subscribe.postedJobs} of {subscribe.allowedJobs}
                                                       </td>
                                                   </tr>
                                                   </tbody>
                                               </table>
                                               <table>
                                                   <thead style={{textAlign: 'center'}}>
                                                   <tr>
                                                       <th style={{width: '30%', paddingLeft: '0'}}>CONTACTS</th>
                                                       <th style={{width: '70%'}}>MAX APPLICATIONS PER JOB</th>
                                                   </tr>
                                                   </thead>
                                                   <tbody>
                                                   <tr style={{textAlign: 'center'}}>
                                                       <td style={{padding: '15px'}}>
                                                           {subscribe.currentContacts} of {subscribe.allowedContacts}
                                                       </td>
                                                       <td style={{padding: '15px'}}>
                                                           {subscribe.maxApplicantsPerJob}
                                                       </td>
                                                   </tr>
                                                   </tbody>
                                               </table>
                                           </MediaQuery>
                                           <MediaQuery minDeviceWidth="768px">
                                               <table>
                                                   <thead>
                                                   <tr>
                                                       <th style={{minWidth:"12%", maxWidth:"12%", width:"12%"}}>PLAN</th>
                                                       <th style={{minWidth:"31%", maxWidth:"31%", width:"31%",textAlign:"center"}}>JOB POSTS</th>
                                                       <th style={{minWidth:"20%", maxWidth:"20%", width:"20%",textAlign:"center"}}> CONTACTS</th>
                                                       <th style={{minWidth:"32%", maxWidth:"32%", width:"32%",textAlign:"center"}}>
                                                       MAX APPLICATIONS PER JOB
                                                       </th>
                                                   </tr>
                                                   </thead>
                                                   <tbody>

                                                   {
                                                       // allowedContacts: 1
                                                       // allowedJobs: 25
                                                       // currentContacts: 1
                                                       // planName: "Business"
                                                       // postedJobs: 58
                                                       subscribe && subscribe!=="No Subscription Found" &&
                                                       <tr>
                                                             <td style={{fontWeight:"700"}}>{subscribe.planName} </td>
                                                             <td style={{textAlign:"center",padding:"20px 0px"}}>{subscribe.postedJobs} of {subscribe.allowedJobs}</td>
                                                             <td style={{textAlign:"center",padding:"20px 0px"}}>{subscribe.currentContacts} of {subscribe.allowedContacts}</td>
                                                             <td style={{textAlign:"center",padding:"20px 0px"}}>{subscribe.maxApplicantsPerJob}</td>
                                                       </tr>
                                                   }{
                                                       subscribe && subscribe==="No Subscription Found" &&
                                                       <tr>
                                                           <td colSpan='4'>
                                                               {"No Data Found" }
                                                           </td>
                                                       </tr>
                                                   }
                                                   </tbody>
                                               </table>
                                           </MediaQuery>
                                           <MediaQuery maxDeviceWidth="767px">
                                               <p className='all-limits'>
                                                   All limits resets on renewal date.
                                               </p>
                                               <div className="update-button" style={{padding: "0% 0px 5%"}}>
                                                   <Link to="/pricing"><button className="btn text-uppercase"
                                                   >{subscribe.planName === "Business" ? 'Upgrade subscription' : "Update subscription"}</button></Link>
                                               </div>
                                               {
                                                   transaction_detail.length !==0 &&
                                                   subscribe.planName!=="Free" &&
                                                   <div className="sub-box">
                                                       <h4>${billingStatus && billingStatus.planPrice}/Month</h4>
                                                       <p className="text-center">Billed monthly. Next payment will be charged automatically on
                                                           &nbsp;<Moment format="MMMM D, YYYY">
                                                               {
                                                                   // localdate(new Date(profileData.memberSince))
                                                                   billingStatus &&  billingStatus.nextBillingDate
                                                               }
                                                           </Moment>.</p><br/>
                                                       <p className="text-center">To cancel your subscription, downgrade to a Free plan </p>
                                                   </div>
                                               }
                                           </MediaQuery>
                                           <MediaQuery minDeviceWidth="768px">
                                               <p>
                                                   All limits resets on renewal date.
                                               </p>
                                           </MediaQuery>
                                       </div>
                                   </div>
                               </div>
                               <div className="row">
                                   <div className="col-sm-12 pl-0">
                                       <p className="font-weight-bold">Billing</p>
                                       <div className="second-table">
                                           <table>
                                               <thead>
                                               <tr>
                                                   <th style={{minWidth:"30%", maxWidth:"30%", width:"30%"}}>PLAN</th>
                                                   <th className="pl-0" style={{minWidth:"15%", maxWidth:"15%", width:"15%"}}>PRICE</th>
                                                   {/*<th className="pl-0" style={{minWidth:"15%", maxWidth:"15%", width:"15%"}}>CREDIT</th>*/}
                                                   <th style={{minWidth:"15%", maxWidth:"15%", width:"15%"}}>STATUS</th>
                                                   <th style={{minWidth:"20%", maxWidth:"20%", width:"20%",textAlign:"center"}}>DATE</th>
                                               </tr>
                                               </thead>
                                               <tbody>
                                               {
                                                   transaction_detail && transaction_detail.length>0 && transaction_detail.map((item,index)=>{
                                                       return(
                                                           <tr key={index}>
                                                               <td className='font-weight-bold'>{item.globalPlanName}</td>
                                                               <td>${item.amount}</td>
                                                               {/*<td>${item.credit}</td>*/}
                                                               <td >{item.status.toUpperCase()}</td>
                                                               <td style={{textAlign:"center",padding:"0"}}> <Moment format="MMMM DD, YYYY">
                                                                   {localdate( new Date(item.createDate))}

                                                               </Moment></td>
                                                           </tr>
                                                       )
                                                   })
                                               }

                                               </tbody>
                                           </table>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div className="col-sm-4 pr-0 specifics2">
                               <MediaQuery minDeviceWidth="768px">
                                   <div className="update-button" style={{padding: "0% 0px 5%"}}>
                                       <Link to="/pricing">
                                           <button className="btn text-uppercase">{subscribe.planName === "Business" ? 'Upgrade subscription' : "Update subscription"}</button>
                                        </Link>
                                   </div>
                                   {
                                       transaction_detail.length !==0 &&
                                       subscribe.planName!=="Free" &&
                                       <div className="sub-box">
                                           <h4>${billingStatus && billingStatus.planPrice}/Month</h4>
                                           <p className="text-center">Billed monthly. Next payment will be charged automatically on
                                               &nbsp;
                                               <Moment format="MMMM D, YYYY">
                                                   {
                                                       // localdate(new Date(profileData.memberSince))
                                                       billingStatus &&  billingStatus.nextBillingDate
                                                   }
                                               </Moment>.</p><br/>
                                           <p className="text-center">To cancel your subscription, downgrade to a Free plan. </p>
                                       </div>
                                   }
                               </MediaQuery>
                           </div>
                       </div>
                   </div>
               } </div>
        </Fragment>
    )
};

const mapStateToProps = ({ auth,billing }) => ({
    email: auth.user.email,
    transaction_detail: billing.transaction_detail
  });


export default connect(
mapStateToProps,
{ setAlert,getTransactionDetails }
)(Billing);//*/

