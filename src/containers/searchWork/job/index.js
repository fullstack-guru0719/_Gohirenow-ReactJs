import React, {Component,Fragment} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import axios from "axios";
import {apiPath} from '../../../services/config';

import workerpladce from '../../../assets/img_avatar.svg';

import queryString from 'query-string';

import Spinner from '../../../components/spinner';

import {setUserType} from '../../auth/actions';
import MediaQuery from "react-responsive";



class SearchWork extends Component {
    state={
        jobtitles:null,
        dropshows: []
    };
    componentDidMount(){
        window.scroll(0,0);
        axios.get(apiPath+"/jobs/global-job-titles").then((res)=>{
            this.setState({jobtitles: res.data})
        })
    }
    handleDropClick = (id) => {
        const { dropshows } = this.state;
        const newDrops = dropshows.includes(id) ? dropshows.filter(dropId => dropId != id) : dropshows.concat(id);
        this.setState({dropshows: newDrops});
    };

    checkDropShowStatus = (id) => {
        const { dropshows } = this.state;
        return dropshows.includes(id)
    };
    render() {
        let {jobtitles}=this.state;
        window.scroll(0,0);
        return (
        <div>
            <div className="hire-want-section new-home2"  >
                <div className="container">
                    <div className="row">
                        <div className="col-6 hire-page-header-inner" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                            <MediaQuery minDeviceWidth="1200px">
                                <div className="largetext1 new-text-h1">
                                    <h1 style={{ marginTop: "44px"}}>
                                        Find Top Virtual Assistants and Freelancers.
                                    </h1>
                                </div>
                            </MediaQuery>
                            <MediaQuery maxDeviceWidth="1199px">
                                        <span className={'hire-page-header-text'}>
                                            Find Top Virtual Assistants and Freelancers.
                                        </span>
                            </MediaQuery>
                            <div className="hire-work-buttons  ">
                                {/*if(isAuthenticated){*/}
                                {/*if(user && user.userTypeId === 1 ){*/}
                                {/*return <Link to='/post-job'><p>Post a job</p></Link>*/}
                            {/*}*/}
                                {/*else{*/}
                                {/*return <Link to={'/search-work'}><p>Browse Jobs</p></Link>*/}
                            {/*}}*/}
                                {/*else{ return <Link to={"/register"} className="pointer" onClick={()=> gotohire()}>Post a job</Link>*/}
                            {/*}*/}
                                {/**/}
                                <Link to="/register">
                                <button className="btn text-uppercase new-search-btn " >POST A JOB</button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-6 pr-0">
                            <div className="voted-div-outer">
                                <div className="voted-div">
                                    {/*<div>*/}
                                    {/*<div className="top">*/}
                                    {/*<p>VOTED</p>*/}
                                    {/*<h4>#1</h4>*/}
                                    {/*</div>*/}
                                    {/*<p>The leader in <br /> Virtual<br />Assistants</p>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="as-seen-as" style={{ backgroundColor: "#333333"
            }}>
                <div className="container-fluid d-flex justify-content-center">
                    <div className="row  black-back-header black-back" style={{
                        width:"88%",
                        padding: "25px 49px"
                    }}>
                        <h2 className="text-uppercase new-style-needed">as seen on</h2>
                        <div className="black-circle-adj">
                            <div>
                                <img src={require("../../../assets/seen1.png")} alt="" />
                            </div>
                            <div>
                                <img className='bottom-fixed' src={require("../../../assets/seen2.png")} alt="" />
                            </div>
                            <div>
                                <img src={require("../../../assets/seen3.png")} alt="" />
                            </div>
                            <div>
                                <img src={require("../../../assets/seen4.png")} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container " style={{marginTop:"0px"}}>
                <div className="row align-pad " style={{
                    padding: "0% 0px 0% 15px"
                }}>
                    <div className="col-md-12 pl-0">
                        <h2 className="text-center text-uppercase mb-0"
                            style={{
                                padding: "4% 0px 3% 15px",
                                fontWeight: "700",
                                fontSize: "28px",
                                fontFamily:"lato"
                            }}
                        >
                            Browse our virtual assistants by skills
                        </h2>
                        <h3
                            style={{
                                padding: "0% 0px 4% 15px",
                                fontSize: "22px",
                                fontWeight: "500",
                                lineHeight: "1.3"
                            }}
                            className="mb-0 text-center">
                            Hire top-quality freelancers and virtual assistants for your next project or startup.<br/>
                            &nbsp; Learn how you can save more than 82% on salaries. Get work done today!
                        </h3>
                    </div>
                </div>
                <div className="row respsonsive-of-listing mt-4  hirepage-container">
                    {
                        jobtitles && jobtitles.map((item, index)=> {
                            return  ([
                                <MediaQuery maxDeviceWidth="767px">
                                    <div className="dropdown-hirepage"  key={`${index}hirepage`}>
                                        {/*<button onClick={() => {this.handleDropClick(index)}} className="btn">*/}
                                        {/*    {item.name.toUpperCase()}*/}
                                        {/*</button>*/}
                                        {
                                            <div className="w-25 col-3 pb-2 pt-2 pr-2 pl-2 d-flex  hirepage-job flex-column respsonsive-of-listing-new" >
                                                <div className=" d-flex   p-4 flex-column "
                                                     style={{
                                                         fontSize:"17px",
                                                         borderWidth: "1px solid rgb(225, 225, 225)",
                                                         backgroundColor: "rgb(243, 243, 243)",
                                                         height: "850px",
                                                         alignItems:"center"
                                                     }}>
                                                    <img src={require(`../../../assets/listofjobsassets/${item.name.toUpperCase()}.png`)}
                                                         style={{
                                                             marginTop: "24px",
                                                             marginBottom: "25px",
                                                             width: "120px",
                                                             height: "120px"
                                                         }}
                                                         alt=""/>
                                                    <a className="mt-2 mb-2 text-center" style={{fontSize:"18px",fontWeight: "700", height: "65px",
                                                        minHeight:"65px",
                                                        maxHeight:"65px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}>{item.name.toUpperCase()}</a>
                                                    {item.jobTitles && item.jobTitles.map((ite)=>{
                                                        return <Link to={`/job/${ite.friendlyUrl && ite.friendlyUrl.replace("/","").toLowerCase()}/${ite.id}`}
                                                                     className="text-center mt-2 mb-2"
                                                                     style={{


                                                                         color: "rgb(65, 143, 205)"
                                                                     }}
                                                        >{ite.name}</Link>
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </MediaQuery>,
                                <MediaQuery minDeviceWidth="768px">
                                    <div className="w-25 col-3 pb-2 pt-2 pr-2 pl-2 d-flex  hirepage-job flex-column
                                respsonsive-of-listing-new"  key={index} >
                                        <div className=" d-flex   p-4 flex-column "
                                             style={{
                                                 fontSize:"17px",
                                                 borderWidth: "1px solid rgb(225, 225, 225)",
                                                 backgroundColor: "rgb(243, 243, 243)",
                                                 height: "850px",
                                                 alignItems:"center"
                                             }}>
                                            <img src={require(`../../../assets/listofjobsassets/${item.name.toUpperCase()}.png`)}
                                                 style={{
                                                     marginTop: "24px",
                                                     marginBottom: "25px",
                                                     width: "120px",
                                                     height: "120px"
                                                 }}
                                                 alt=""/>
                                            <a className="mt-2 mb-2 text-center" style={{fontSize:"18px",fontWeight: "700", height: "65px",
                                                minHeight:"65px",
                                                maxHeight:"65px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>{item.name.toUpperCase()}</a>
                                            {item.jobTitles && item.jobTitles.map((ite)=>{
                                                return <Link to={`/job/${ite.friendlyUrl && ite.friendlyUrl.replace("/","").toLowerCase()}/${ite.id}`}
                                                             className="text-center mt-2 mb-2"
                                                             style={{


                                                                 color: "rgb(65, 143, 205)"
                                                             }}
                                                >{ite.name}</Link>
                                            })}
                                        </div>
                                    </div>
                                </MediaQuery>
                            ])
                        })
                    }
                    {
                        !jobtitles && <div className="m-5 w-100"><Spinner/></div>
                    }
                </div>
            </div>

        </div>

        )
    }
}

// const mapStateToProps = ({ main, jobs,auth,unreadCount }) => {
//     return {
//         loggedIn: main.loggedIn,
//         userStoreData: main.userStoreData,
//         jobs,
//         user:auth.user,
//         searchword:unreadCount.search
//     };
// };
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
    mapStateToProps,
    {mapDispachToProps,setUserType}
)(SearchWork);
