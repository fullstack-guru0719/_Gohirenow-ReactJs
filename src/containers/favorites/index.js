import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {apiPath} from '../../services/config'
import axios from 'axios';
import Spinner from '../../components/spinner/index';
import employerplace from "../../assets/employer_icon.svg"
import workerplace from '../../assets/img_avatar.svg';
import Swal from "sweetalert2";

import Moment from 'react-moment';

import {ShortSalaryTypeById} from '../../utils/constants/SalaryTypes';
import MediaQuery from "react-responsive";
import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";

const config = {
    headers: {
        'Content-Type':'application/json'
    }
}

const Favorites = ({ favorites, user,history }) => {
    const [state, setstate] = useState(
        {
            clientFav: [],
            freelancerFav: []
        });
    const [loader, setLoader]=useState(true);
    const [delloader, setDeloader]=useState({
        loader:[]
    });
    const [clientdelloader, setclientdelloader]=useState({
        loader:[]
    });
    useEffect(()=>{
        window.scroll(0,0);
        if(user && parseInt(user.userTypeId) === 1 ){

            axios.get(apiPath+"/favorites/client/workers",config).then((res)=>{

                setstate({...state.clientFav, clientFav:res.data })
                let loader = [];
                res.data.map((item)=>{
                    loader.push(false)
                })
                setclientdelloader({...delloader, loader:loader });
                setLoader(false);
            }).catch(err=>{

            })
        }
        else if(user && parseInt(user.userTypeId) === 2){

            axios.get(apiPath+"/favorites/worker/jobs").then((res)=>{
                 setstate({...state.freelancerFav, freelancerFav:res.data });
                let loader=[];
                res.data.map((item)=>{
                    loader.push(false)
                });
                setDeloader({...delloader, loader:loader });
                setLoader(false);
            }).catch(err=>{

            })
        }
    },[]);

    const gotohriewith = (value, red) => {
        localStorage.setItem("jobId",value);
        history.push(`/job-details-work/${value}`);
    }

   const gotoprofile=(id)=>{

        localStorage.setItem("profileId",id);
      history.push(`/work-profile/${id}`);

    }
    const gottojob=(id)=>{
        history.push(`/job-details-work/${id}`);
    }

    const deletejob = (uid, index)=>{

        Swal.fire({
            title: "Are you sure you want to delete this job?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.value) {
                let allowloader=[];

                delloader.loader.map((item,newind)=>{
                    if(newind===index){
                        item=true;

                    }
                    allowloader.push(item);
                });
                setDeloader({...delloader, loader:allowloader });

                // setDeloader(true)
                axios.delete(apiPath+"/favorites/worker/remove/"+uid).then((res)=>{

                    // let freelancer= .splice(index,1);
                    let newfreelacner=[];
                    let loader=[];
                    state.freelancerFav.map((item, inde)=>{
                        if(inde!==index){
                            newfreelacner.push(item);
                            loader.push(false)}
                        })
                    setstate({...state, freelancerFav:newfreelacner });
                    setDeloader({...delloader, loader:loader });
                    // setDeloader({ loader});
                }).catch(err=>{
               })
            }
        });

    }
    const deletework = (uid, index)=>{
        Swal.fire({
            title: "Are you sure you want to delete this candidate?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.value) {
                let allowloader=[];
                clientdelloader.loader.map((item,newind)=>{
                    if(newind===index){
                        item=true;
                    }
                    allowloader.push(item);
                });
                setclientdelloader({...clientdelloader, loader:allowloader });
                // setDeloader(true)
                axios.delete(apiPath+"/favorites/client/remove/"+uid).then((res)=>{
                    // let freelancer= .splice(index,1);
                    let newfreelacner=[];
                    let loader=[];
                    state.clientFav.map((item, inde)=>{
                        if(inde!==index){
                            newfreelacner.push(item);
                            loader.push(false)
                        }
                    })

                    setstate({...state, clientFav:newfreelacner });

                    setclientdelloader({...clientdelloader, loader:loader });
                    // setDeloader({ loader});


                }).catch(err=>{
                })
            }
        });

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

    const { clientFav, freelancerFav } = state;
    const renderFreelancerFav = () => {
        if(!freelancerFav || freelancerFav.length===0){
            return (
                <div className="whole-div nofavorites" >
                    <div className="">You don't have any favorites</div>
                </div>
            )
        }
        else{
            return  freelancerFav && freelancerFav.length >0 && freelancerFav.map((item, index) => {
                return [
                    <MediaQuery maxDeviceWidth="767px">
                        <div className="freelancers-favorites-responsive">
                            <div className="freelancers-favorites-head">
                                <div className="img-div pointer"
                                     onClick={()=>  {
                                         // this.props.history.push("/client-profile");
                                         if(item.client && item.client){
                                             localStorage.setItem("profileId", item.client.id);
                                             history.push(`/client-profile/${item.client.id}`)}
                                     }
                                     }
                                >
                                    <img src={item.client && item.client.profilePicturePath ? item.client.profilePicturePath:employerplace} alt="" />
                                </div>
                                <h4 className="pointer"
                                    onClick={()=>{

                                        history.push(`/job-details-work/${item.id}`)
                                    }}
                                >{item.title && item.title}</h4>
                            </div>
                            <div className="freelancers-favorites-responsive-right">
                                <div className="freelancers-favorites-info">
                                    <p>{item.type&&item.type}
                                        <span style={{
                                            marginLeft: "20%"
                                        }}>${item.salary && item.salary}/ {ShortSalaryTypeById(item.salaryTypeId)}</span>
                                        <span style={{
                                            marginLeft: "20%"
                                        }}> 

                                        <Moment fromNow ago>
                                                {localdate(
                                                    new Date(item && item.activeDate)
                                                )}
                                        </Moment>{" "}ago</span>
                                    </p>
                                </div>
                                <div className="freelancers-favorites-tags">
                                    <p>{item.skills &&item.skills.map((ite,index)=>{
                                        return  item.skills.length-1 !== index ? ite.name+", ":
                                            ite.name
                                    })}</p>
                                </div>
                                <div className="freelancers-favorites-controls">
                                    <div onClick={()=> gotohriewith(item.id && item.id)}  className="pointer">
                                        <i className="fa fa-eye" />
                                        <p>View</p>
                                        </div>
                                    <div  onClick={()=> deletejob(item.id ,index)}  className="pointer">
                                        <i className="fa fa-times-circle" />
                                        <p key={index}>{delloader.loader[index] ? <Spinner/>:"Delete"}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </MediaQuery>,
                    <MediaQuery minDeviceWidth="768px">
                        <div className="whole-div" key={index}>
                            <div className="first">
                                <div className="img-div pointer"
                                     onClick={()=>  {
                                         // this.props.history.push("/client-profile");
                                         if(item.client && item.client){
                                             localStorage.setItem("profileId", item.client.id);
                                             history.push(`/client-profile/${item.client.id}`)}
                                     }
                                     }
                                >
                                    <img src={item.client && item.client.profilePicturePath ? item.client.profilePicturePath:employerplace} alt="" />
                                </div>
                                <div className="content" style={{width:"100%"}}>
                                    <h4 className="pointer"
                                        onClick={()=>{

                                            history.push(`/job-details-work/${item.id}`)
                                        }}
                                    >{item.title && item.title}</h4>
                                    <p>{item.type&&item.type}
                                        <span style={{
                                            marginLeft: "20%"
                                        }}>${item.salary && item.salary}/ {ShortSalaryTypeById(item.salaryTypeId)}</span>
                                        <span style={{
                                            marginLeft: "20%"
                                        }}> <Moment fromNow ago>
                                    {localdate(
                                        new Date(item && item.activeDate )
                                    )}
                                </Moment>{" "}ago</span>

                                    </p>
                                    <p>{item.skills &&item.skills.map((ite,index)=>{
                                        return  item.skills.length-1 !== index ? ite.name+", ":
                                            ite.name
                                    })}</p>
                                </div>
                            </div>
                            <div className="second">
                                <h4>{item.date && item.date}</h4>

                                <p>{item.country && item.country}</p>
                            </div>
                            <div className="third">
                                <div onClick={()=> gotohriewith(item.id && item.id)}  className="pointer">
                                    <i className="fa fa-eye" />
                                    <p>View</p>
                                </div>
                                <div  onClick={()=> deletejob(item.id ,index)}  className="pointer">
                                    <i className="fa fa-times-circle" />
                                    <p key={index}>{delloader.loader[index] ? <Spinner/>:"Delete"}</p>
                                </div>
                            </div>
                        </div>
                    </MediaQuery>
                    ]
                })
        }
    }

    const renderClientFav = () => {
        if(!clientFav || clientFav.length===0){
            return (
                <div className="whole-div nofavorites">
                    <div className="">You don't have any favorites</div>
                </div>
            )
        }
        else{
            return clientFav.map((item, index) => {

                return [
                    <MediaQuery maxDeviceWidth="767px">
                        <div className={`client-favorites-container`}>
                            <div className={`first-child`}>
                                <div className="img-div pointer" onClick={()=> gotoprofile(item.userId)}>
                                    <img src={item.profilePicturePath ? item.profilePicturePath:workerplace} alt="" />
                                </div>
                                <div className={`right`}>
                                    <div className={`title`}>
                                        <h4 onClick={()=> gotoprofile(item.userId)} className="pointer">
                                            {item.name && item.name}</h4>
                                            {item.title && <p>{item.title}</p>}
                                    </div>
                                    <div className={`info`}>
                                        <p>{item.country && item.country}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`skills`}>
                                <p>{item.skills && item.skills.map((ite,index)=>{
                                    return  item.skills.length-1 !== index ? ite.name+", ":
                                        ite.name
                                })}</p>
                            </div>
                            <div className={`log-info`}>
                                {item.lastLoginDate && (
                                    <p>
                                        Last logged:{" "}
                                        <Moment fromNow ago>
                                            {localdate(
                                                new Date(item.lastLoginDate && item.lastLoginDate)
                                            )}
                                        </Moment>{" "}
                                        ago
                                    </p>
                                )}
                                <p>
                                    Member Since:{" "}
                                    <Moment format=" MMM D YYYY">
                                        {item.createdDate && item.createdDate}
                                    </Moment>
                                </p>
                            </div>
                            <div className={`icons`}>
                                <div onClick={()=> gotoprofile(item.userId && item.userId)} className="pointer">
                                    <i className="fa fa-eye" />
                                    <p>View</p>
                                </div>
                                <div onClick={()=> deletework(item.userId ,index)}  className="pointer">
                                    <i className="fa fa-times-circle" />
                                    <p key={index}>{clientdelloader.loader[index] ? <Spinner/>:"Delete"}</p>
                                </div>
                            </div>
                        </div>
                    </MediaQuery>,
                    <MediaQuery minDeviceWidth="768px"><div className="whole-div" key={index}>
                    <div className="first" style={{width:"45%"}}>
                        <div className="img-div pointer" onClick={()=> gotoprofile(item.userId)}>
                            <img src={item.profilePicturePath ? item.profilePicturePath:workerplace} alt="" />
                        </div>
                        <div className="content" style={{width:"100%"}}>
                            <h4 onClick={()=> gotoprofile(item.userId)} className="pointer">
                                {item.name && item.name}</h4>
                            <p>{item.title && item.title}
                            </p>

                            <p>{item.skills && item.skills.map((ite,index)=>{
                                return  item.skills.length-1 !== index ? ite.name+", ":
                                    ite.name
                            })}</p>
                        </div>
                    </div>
                    <div className="second" style={{width:"45%",
                        flexDirection: "column",
                        alignItems: "center"}}>
                        {item.lastLoginDate && (
                            <h4>
                                Logged:{" "}
                                <Moment fromNow ago>
                                    {localdate(
                                        new Date(item.lastLoginDate && item.lastLoginDate)
                                    )}
                                </Moment>{" "}
                                ago
                            </h4>
                        )}
                        <p>
                            Member Since:{" "}
                            <Moment format=" MMM D YYYY">
                                {item.createdDate && item.createdDate}
                            </Moment>
                        </p>
                        <p>{item.country && item.country}</p>
                    </div>
                    <div className="third" style={{width:"10%"}}>
                        <div onClick={()=> gotoprofile(item.userId && item.userId)} className="pointer">
                            <i className="fa fa-eye" />
                            <p>View</p>
                        </div>
                        <div onClick={()=> deletework(item.userId ,index)}  className="pointer">
                            <i className="fa fa-times-circle" />
                            <p key={index}>{clientdelloader.loader[index] ? <Spinner/>:"Delete"}</p>
                        </div>
                        </div>
                    </div>
                    </MediaQuery>]})
        }

    }
    return (
        <Fragment>
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
            <div className="registration" id="favorites-hire">
                <div className="container  ">
                    <div className="row flex-column favoreds top-text " style={{padding: "5% 0px 2% 0px"}}>
                        <div className="col-md-12 pl-0">
                            <h2>Favorites</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 pl-0  pr-0">
                            {
                                loader ? <div><Spinner/></div>:
                                    <div className="right-side">
                                        {
                                            user && user.userTypeId&& user.userTypeId === 1 ? renderClientFav() :
                                                renderFreelancerFav()
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

const mapStateToProps = ({ favorites, auth : { user } }) => {
    return {
        favorites,
        user,
    };
};

export default connect(
    mapStateToProps,
)(Favorites);
