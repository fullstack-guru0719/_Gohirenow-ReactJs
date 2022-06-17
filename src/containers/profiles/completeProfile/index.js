import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import placeholder1 from "../../../assets/img_avatar.svg";
import placeholder2 from "../../../assets/employer_icon.svg";
import axios from 'axios';

import Spinner from '../../../components/spinner';
import MetaTags from 'react-meta-tags';

import {apiPath} from '../../../services/config';

class Profile extends Component {
    state={
        data:null,
        progwidth:0,
        plan:null
    }

    componentDidMount(){
        window.scrollTo(0, 0);
        let {user} = this.props;
        let {isAuthenticated}= this.props;
        if(!isAuthenticated){
            localStorage.setItem("route", this.props.location.pathname );
            this.props.history.push('/sign-in')
        }

       if(user.userTypeId===1){
           axios.get(apiPath+"/account/complete-profile").then((res)=>{

               this.setState({
                   data:res.data,
                   progwidth:res.data.progress
               })
           })
           axios.get(apiPath+"/client/subscription").then((res)=>{

               let planer=res.data.transactions.length >0 ? false:true;
               this.setState({
                   plan:planer
               })
           })
       }
       else{
           axios.get(apiPath+"/account/complete-profile").then((res)=>{

               this.setState({
                   data:res.data,
                   progwidth:res.data.progress
               })
               this.setState({
                   plan:true
               })
           })

       }
    }
    gotoeditpage(){
        let {user} = this.props;
        parseInt(user.userTypeId) === 2 ? this.props.history.push("/edit-profile"):this.props.history.push("/profile-edit-client/");
    }

    render() {
        let{dispatch, loggedIn,user, profile}= this.props;
        let{data}= this.state;
        let styleprog = {
            width: this.state.progwidth+ '%'
        };

        let placeholder= this.props.user && parseInt(this.props.user.userTypeId)=== 2 ? placeholder1:placeholder2;
        let placeholading=this.props.profile && this.props.profile.profilePicturePath ? this.props.profile.profilePicturePath: placeholder;
        return (
        <div className="complete-profile registration grey-bf"
             style={{
                 backgroundColor: "#f8f8f8"
             }}
             id="user-profile">
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
                    <div className="container pt-3 ">
                        <div className="row inner-div"
                        style={{
                            padding: "5% 0px 2% 0px"
                        }}>
                            <h1 className="pl-0">Complete Your Profile</h1>
                        </div>
                        {
                            this.state.data ===null && this.state.plan ===null &&
                            <div className="row"><Spinner/></div>
                        }
                        {
                            this.state.data !== null  &&  this.state.plan!==null &&
                            <div className="row">
                                <div className=" col-md-4 pl-0">
                                    <div className="row left-side-outer p-0 ">
                                        <div style={{backgroundColor: 'white'}} className="col-sm-12 left-side-inner">
                                            <div className="user-div" id="edit-profile">
                                                <div className="user-pic-upload p-0">
                                                    <img
                                                        src={placeholading}
                                                        alt=""
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            borderRadius: "50%"
                                                        }}
                                                    />
                                                </div>
                                                <h2>{user.companyName ? user.companyName:user.fullName}</h2>
                                            </div>
                                            <div>
                                                <div className="profile-percent">
                                                    <p>Complete Profile</p>
                                                    <p>{
                                                        data && data.progress && data.progress
                                                    }%</p>
                                                </div>
                                                <div className="progress-bar-outer">
                                                    <div className="progress-bar" style={styleprog}/>
                                                </div>
                                                <div className="orng"
                                                     style={{
                                                         textAlign: "center",
                                                         marginTop: "20px"
                                                     }}>
                                                    {
                                                        user && user.userTypeId===1 &&
                                                        <Link to="profile-hire">
                                                            <button className="btn"
                                                                    style={{

                                                                        padding: "10px 30px 10px 30px"
                                                                    }}>
                                                                View Profile
                                                            </button>
                                                        </Link>
                                                    }
                                                    {
                                                        user && user.userTypeId===2 &&
                                                        <Link to="profile-work">
                                                            <button className="btn"
                                                                    style={{
                                                                        padding: "10px 30px 10px 30px"
                                                                    }}>
                                                                View Profile
                                                            </button>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" col-md-8">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="complete-profile-table">
                                                <tbody>

                                                <tr>
                                                    <td><div className="numbering">1</div></td>
                                                    {
                                                        this.props.user &&
                                                        parseInt(this.props.user.userTypeId)=== 2 ?
                                                            <td>Upload your picture (20%)</td>:
                                                            <td>Upload a logo on your profile (20%)</td>
                                                    }


                                                    {
                                                        this.props.user &&
                                                        parseInt(this.props.user.userTypeId)===1 &&
                                                        <td>
                                                            {
                                                                data && data.logo ?
                                                                    <div className="completed-div">
                                                                        <div className="checked">✓</div>
                                                                        <p>COMPLETED</p>
                                                                    </div>
                                                                    :
                                                                    <div className="upload-btn-wrapper">
                                                                    <button className="btn"
                                                                            onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                                </div>
                                                            }

                                                        </td>

                                                    }
                                                    {
                                                        this.props.user &&
                                                        parseInt(this.props.user.userTypeId)===2 &&
                                                        <td>
                                                            {
                                                                data && data.profilePicture ?
                                                                    <div className="completed-div">
                                                                        <div className="checked">✓</div>
                                                                        <p>COMPLETED</p>
                                                                    </div>
                                                                    :<div className="upload-btn-wrapper">
                                                                    <button className="btn"
                                                                            onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                                </div>
                                                            }
                                                        </td>
                                                    }
                                                </tr>
                                                <tr>
                                                    <td><div className="numbering">2</div></td>
                                                    <td>
                                                        {
                                                            this.props.user &&
                                                            parseInt(this.props.user.userTypeId)=== 2 ?
                                                                "Enter your expertise title (20%)":
                                                                "Enter your company introduction  (20%)"
                                                        }
                                                    </td>
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 2 &&
                                                    <td>
                                                        {
                                                            data && data.title ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 1 &&
                                                    <td>
                                                        {
                                                            data && data.title ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }

                                                </tr>
                                                <tr>
                                                    <td><div className="numbering">3</div></td>
                                                    <td>
                                                        {
                                                            this.props.user &&
                                                            parseInt(this.props.user.userTypeId)=== 2 ?
                                                                "Fill your description (20%)":
                                                                "Enter your company description (20%)"
                                                        }
                                                    </td>
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 2 &&
                                                    <td>
                                                        {
                                                            data && data.description && data.title ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 1 &&
                                                    <td>
                                                        {
                                                            data && data.description ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }

                                                </tr>
                                                <tr>
                                                    <td><div className="numbering">4</div></td>
                                                    <td> {
                                                        this.props.user &&
                                                        parseInt(this.props.user.userTypeId)=== 2 ?
                                                            "Add your top skills (20%)":
                                                            "Create your first job post (20%)"
                                                    }</td>
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 2 &&
                                                    <td colSpan={3}>
                                                        {
                                                            data && data.skills ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) === 1 &&
                                                    <td colSpan={3}>
                                                        {
                                                            data && data.jobs ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>{this.props.history.push("/post-job")}}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </td>
                                                    }

                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="complete-profile-bottom-div bottom-div">
                                                <h2>BONUS</h2>
                                                <div className="bonus-div d-flex mt-1 justify-content-between align-items-center">
                                                    <p>
                                                        {
                                                            this.props.user &&
                                                            parseInt(this.props.user.userTypeId)=== 2 ?
                                                                "Upload documents in your portfolio (10%)":
                                                                "Upgrade your account plan to contact candidates  (20%)"
                                                        }
                                                    </p>
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) ===2 &&
                                                    <div>
                                                        {
                                                            data && data.portfolio ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>this.gotoeditpage()}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </div>
                                                    }
                                                    {this.props.user &&
                                                    parseInt(this.props.user.userTypeId) ===1 &&
                                                    <div>
                                                        {
                                                            this.state.plan===false  ?
                                                                <div className="completed-div">
                                                                    <div className="checked">✓</div>
                                                                    <p>COMPLETED</p>
                                                                </div>
                                                                : <div className="upload-btn-wrapper">
                                                                <button className="btn"
                                                                        onClick={()=>

                                                                            this.props.history.push("/pricing")}>CLICK HERE</button>
                                                            </div>
                                                        }
                                                    </div>
                                                    }
                                                </div>
                                                {
                                                    this.props.user &&
                                                    parseInt(this.props.user.userTypeId)=== 2 &&
                                                    <div className="d-flex mt-1 justify-content-between align-items-center">
                                                        <p


                                                        >Apply on an active job offer (10%)</p>
                                                        {this.props.user &&
                                                        parseInt(this.props.user.userTypeId) ===2 &&
                                                        <div>
                                                            {
                                                                data && data.appliedJob ?
                                                                    <div className="completed-div">
                                                                        <div className="checked">✓</div>
                                                                        <p>COMPLETED</p>
                                                                    </div>
                                                                    : <div className="upload-btn-wrapper">
                                                                    <button className="btn"
                                                                            onClick={()=>
                                                                                this.props.history.push("/search-work")
                                                                            }

                                                                    >CLICK HERE</button>
                                                                </div>
                                                            }
                                                        </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
        )
    }
}

const mapStateToProps = ({ auth,jobs,favorites,account }) => {
    return {
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        profile: account.profile,

    };
};

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Profile);