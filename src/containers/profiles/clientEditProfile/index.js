import React, {Component} from 'react';
import { connect } from "react-redux";
import axios from 'axios';
import {apiPath} from '../../../services/config';
import UploadProfile from '../../../components/uploadavatar';
import Spinner from '../../../components/spinner';

import Moment from 'react-moment';


import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";

class Profile extends Component {

    state = {
        company: "",
        country: 0,
        title: "",
        describe: "",
        save:"Save",
        data: [],
        countriesList: [],
        lastlogin:"",
        loader:true,
        companyLogo:""
    };

    componentWillReceiveProps(nextProps) {
        let {loggedIn} = nextProps;
        if (!loggedIn) {
            localStorage.setItem("route", this.props.location.pathname);
            this.props.history.push('/sign-in');
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        axios.get(apiPath + "/lookup/countries").then(res => {
            this.setState({
                data: res.data,
                countriesList: res.data,
            })
        });
        let {loggedIn} = this.props;
        if (!loggedIn) {
            localStorage.setItem("route", this.props.location.pathname);
            this.props.history.push('/sign-in')
        }
        this.getProfileInfo();
    }

    getProfileInfo = () =>{
        axios.get(apiPath+`/account/profile`).then(res => {
            if(res.data){

                this.setState({
                    country: res.data.countryId,
                    title: res.data.introduction || '',
                    companyLogo:  res.data.profilePicturePath ?  res.data.profilePicturePath : "",
                    describe: res.data.description || '',
                    company: res.data.companyName || '',
                    registerDate: res.data.memberSince || "",
                    lastlogin: res.data.lastLoginTime || "",
                    loader:false
                });
            }
        }).catch((err)=>{

        });
    }

    onChangeCountry = (event)=> {
        this.setState({ country: event.target.value });
    }

    handlesubmit = (e) => {
        e.preventDefault();
        this.setState({ save:"Saving" });
        const formData = new FormData();
        formData.append('Title', this.state.title);
        formData.append('Description', this.state.describe);
        formData.append('CompanyName', this.state.company);
        formData.append('countryId', this.state.country);
        formData.append('CompanyIntroduction', this.state.title);
        formData.append('UserId', this.props.userStoreData.userId);
        formData.append('GlobalPlanId',null);
        axios.post(`${apiPath}/account/clientupdate`,formData)
            .then(res => {

                this.setState({
                    save : "Save"
                })
                this.props.history.push('/profile-hire')
            })
            .catch(err => {
                this.setState({
                    save : "Save"
                })
                if (err.response && err.response.status === 401) {

                    //window.confirm('unauthorized');
                }
            });
    };
    localdate=(date)=>{
        if (mobileVendor == "Apple") {
            return date
        } else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
}

    render() {
        let { dispatch, loggedIn ,userStoreData} = this.props;
        let { data, loader } = this.state;
        return (
            <div className="registration client-edit-profile" id="edit-profile">
                {/*<MetaTags>*/}
                    {/*<title>GoHireNow</title>*/}
                    {/*<meta name="description" content="" />*/}
                {/*</MetaTags>*/}
                <div className="container row-padd " >
                    <div className="row inner-div " style={{padding: "5% 0px 2% 0px"}}>
                        <h1 className="mb-0">Edit Profile</h1>
                        <button className="btn save-btn text-uppercase"  onClick={this.handlesubmit}>
                            {this.state.save}
                        </button>
                    </div>
                    {
                        loader ? <Spinner/>:  <div className="row">
                            <div className=" col-md-4 pl-0">
                                <div className="row left-side-outer">
                                    <div className="col-sm-12 left-side-inner">
                                        <UploadProfile
                                            dispatch={this.props.dispatch}
                                            userStoreData={this.props.userStoreData}
                                            country={this.state.country}
                                            file = {this.state.companyLogo}
                                        />
                                        <div>
                                            <div className="edit-fields mt-5">
                                                <input type="text" placeholder="Company Name" value={this.state.company}
                                                       onChange={(e) => this.setState({company: e.target.value})}
                                                />
                                                <select placeholder="Country" name="country"
                                                        onChange={this.onChangeCountry}
                                                        value={this.state.country}>
                                                    {
                                                        data && data.length > 0 && data.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                            )
                                                        })}

                                                </select>
                                            </div>
                                            <div className="member-details">

                                                <p>Member since:&nbsp; <span>{ this.state.registerDate!== null &&
                                                this.state.registerDate !=="" &&
                                                <Moment  format="MMM D YYYY">
                                                    {
                                                        // this.localdate(new Date(this.state.registerDate))
                                                        this.state.registerDate
                                                    }
                                                </Moment>}</span></p>
                                                <p>Last logged:&nbsp;
                                                    {this.state.lastlogin!=="" && this.state.lastlogin!==null &&
                                                    <span><Moment  fromNow ago>
                                                    {
                                                        this.localdate(new Date(this.state.lastlogin))
                                                    }
                                                </Moment> ago</span>} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-md-8 pr-0 right-side">
                                <div className="right-side-inner hire">
                                    <input type="text" placeholder="Company Introduction" value={this.state.title}
                                           onChange={(e) => this.setState({title: e.target.value})} />
                                    <textarea type="text" placeholder="Company Description" value={this.state.describe}
                                              onChange={(e) => this.setState({describe: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
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
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Profile);








