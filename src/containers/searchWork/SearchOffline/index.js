import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import axios from "axios";
import {apiPath} from '../../../services/config';
import { Slider, Rail, Handles } from 'react-compound-slider'
import ReactTags from 'react-tag-autocomplete';
import workerpladce from '../../../assets/img_avatar.svg';
import clientpladce from '../../../assets/employer_icon.svg';
import Spinner from '../../../components/spinner';
import {salaryTypes} from '../../../utils/constants/SalaryTypes';
import {searchkey} from '../../../components/header/action';
import store from '../../../store/configureStore';
import Moment from "react-moment";
import { SliderRail, Handle } from "../../../components/slider/components";
import { domain, defaultValues } from "../../../utils/constants/Slider";
import queryString from 'query-string';
import {
    isMobile,
    isTablet, mobileVendor,
} from "react-device-detect";
import Pagination from "../../../utils/pagination";
import ReactDOM from "react-dom";
import MediaQuery from "react-responsive";
import MetaTags from 'react-meta-tags';

import Swal from "sweetalert2";
import {setUserType} from '../../auth/actions';


function query(tableData = "", startIndex = null, endIndex = null) {
    return tableData.length>0 && startIndex >=0 && endIndex >= 0 ? tableData.slice(startIndex, endIndex):tableData;
}
class SearchWork extends Component {
    state={
        rangevalues: ["", ""],
        countries:[],
        keyword:"",
        countryId:null,
        jobType:null,
        tags:[],
        jobSkills:[],
        allsearchclients:null,
        searchclients:null,
        search:true,
        searchloader:false,
        searchedkeyword:"",
        activejobs:true,
        expertsearch:true,
        skillssearchdash:false,
        searchedskils:[],
        startIndex: 0,
        endIndex: 10
    };

    componentDidMount(){
        window.scroll(0,0);
        const { props: { history: {location} } } = this;
        axios.get(`${apiPath}/lookup/countries`).then((res)=>{
            this.setState({countries:res.data});
        }).catch((err)=>{});
        let searchkeyword = this.props.match.params.keyword;
        this.searchQuery(searchkeyword);
    }

    searchQuery=(keyword)=>{
            let params= {
                Keyword: keyword
            };
            axios.get(`${apiPath}/client/search-workers`,{params:params}).then
            ((res)=>{
                let data=res.data.filter((item)=>
                {return item.title && item.profilePicturePath && item.skills.length> 0 &&
                    item.profilePicturePath!=="https://apiv1.gohirenow.com/resources/profile-pictures/worker-default-icon.svg"});
                this.setState({
                    allsearchclients:data,
                    searchclients:query(res.data,this.state.startIndex, this.state.endIndex)});
            })
    }
    onvalue(e) {}
    handleChangeSelect(e) {
        this.setState({countryId:e.target.value});
    }

    rangevalue = (rangevalues) => {
        this.setState({rangevalues: rangevalues}, () => this.urlUpdate({from: rangevalues[0], to: rangevalues[1]}));
    };

    onChangetag = e => {}
    handleDelete = (i) => {
        if(this.state.tags) {
            let newTags = [];
            this.state.tags.map((item,index)=>{
                if(index !== i){
                    newTags.push(item);
                }
            });
            this.urlUpdate({ tags: newTags });
            this.setState({ tags:newTags,jobSkills:newTags,skillsArr:newTags });
            // setFormData({...formData,jobSkills: newTags})
        }
    };
    handleAddition = (tag) => {
        let {tags}=this.state;
        // let tagz=[tags];
        let tager=[...tags,tag];

        if(tag){
            this.urlUpdate({ tags: tager });
            this.setState({ tags: tager, jobSkills: tager,skillsArr:tager });
        }
    };



    localdate (date) {
        if (mobileVendor == "Apple") {
            return date
        } else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
    }
    gotoprofile(item,check){
        let {user}=this.props;
        if(user && parseInt(user.userTypeId)===1 ){
            if(check==="picture"){
                localStorage.setItem("profileId",item.userId);
            }
            if(check==="name"){
                localStorage.setItem("profileId",item.userId);
            }
        }
        else if(user && parseInt(user.userTypeId)===2 ){
            if(check==="picture"){
                localStorage.setItem("profileId", item.client.id);
            }
        }
    }


    handleChangePage=(startIndex, endIndex, currentPage) =>{

        // const tesNode = ReactDOM.findDOMNode(this.refs.results);
        // if (!isTablet && !isMobile) {
        //     window.scrollTo(0, tesNode.offsetTop - 20);
        // } else {
        //     window.scrollTo(0, tesNode.offsetTop + 10);
        // }
        this.setState({ startIndex:  startIndex, endIndex: endIndex});
    };

    gotohire=()=>{
    this.props.setUserType(1);
    this.props.history.push('/register')
    }
    popup(){
        Swal.fire({
            // title: "Are you sure you want to delete this candidate?",
            html: `<h2>You can’t use this feature </h2>
								<p style="margin-top: 50px;"></p>`,
            type: "warning",
            width: "950px",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Register!"
        }).then((result) => {if (result.value) {this.props.history.push("/register");}})
    }
    render() {

        let{dispatch, loggedIn, user, history: {location}}= this.props;
        let {countries,search,searchloader,searchedkeyword,activejobs, searchedSkills, rangevalues}= this.state;
        let placeholder= workerpladce;
        const currentPage = queryString.parse(location.search).page;
        return (
            <div  id="search">

                <div className="hire-want-section new-home2"  >
                    <div className="container">
                        <div className="row">
                            <div className="col-6 hire-page-header-inner" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                                <div className="largetext1">
                                    <MediaQuery maxDeviceWidth="1199px">
                                        <span className={'hire-page-header-text'} style={{ marginTop: "44px"}}>
                                            Find quality freelancers and agencies for accounting & consulting.
                                        </span>
                                    </MediaQuery>
                                    <MediaQuery minDeviceWidth="1200px">
                                        <h2 className={'hire-page-header-text'} style={{ marginTop: "44px"}}>
                                            Find quality freelancers and agencies for accounting & consulting.
                                        </h2>
                                    </MediaQuery>
                                </div>
                                <div className="hire-work-buttons  ">
                                    <button className="btn text-uppercase new-search-btn " onClick={()=> this.gotohire()}>POST A JOB</button>
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
                <div className="as-seen-as">
                    <div className="container-fluid d-flex justify-content-center">
                        <div className="row black-back black-back-header " style={{
                            width:"88%"
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
                <div className="container pl-0 " >
                    <div className="row align-pad ">
                        <div className="col-md-12 pl-0">
                            <h2>Search</h2>
                        </div>
                    </div>
                    <div className="row" ref="test">
                        <div className="col-md-4  ">
                            <div className="left-side" onClick={()=> this.popup()}>
                                <h4>aFIND AN EXPERT</h4>
                                <div className="search">
                                    <input type="text" name="keyword"
                                           onChange={()=> this.popup()}
                                            disabled
                                           placeholder="Keyword"
                                    />
                                    <i className="fa fa-search" />
                                </div>
                                <ReactTags
                                    name="jobSkills"
                                    placeholder="Skills"
                                    onChange={e => this.popup()}
                                    tags={this.state.tags}
                                    suggestions={this.props.jobs && this.props.jobs.suggestions}
                                    handleDelete={this.handleDelete.bind(this)}
                                    handleAddition={this.handleAddition.bind(this)}
                                    allowBackspace={false}
                                    autofocus={false}
                                />
                                <select name="jobType" onChange={(e)=> this.this.popup(e)}>
                                    <option value="">Availability</option>
                                    <option selected={this.state.jobType === "1"} value="1">Full-time</option>
                                    <option selected={this.state.jobType === "2"} value="2">Part-time</option>
                                </select>
                                {
                                    <div className='range-div'>
                                        <p className="ml-4">Monthly Salary (USD)</p>
                                        <Slider
                                            mode={1}
                                            step={1}
                                            domain={domain}
                                            className='slider-ghn'
                                            onUpdate={this.popup}
                                            onChange={this.popup}
                                            values={rangevalues[0] || rangevalues[1] ? [rangevalues[0], rangevalues[1]] : defaultValues}
                                        >
                                            <Rail>
                                                {({ getRailProps }) =>
                                                    <SliderRail getRailProps={getRailProps} />
                                                }
                                            </Rail>
                                            <Handles>
                                                {({ handles, activeHandleID, getHandleProps }) => (
                                                    <div className="slider-handles">
                                                        {handles.map(handle => (
                                                            <Handle
                                                                key={handle.id}
                                                                handle={handle}
                                                                domain={domain}
                                                                isActive={handle.id === activeHandleID}
                                                                getHandleProps={getHandleProps}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </Handles>
                                        </Slider>

                                        <p>${this.state.rangevalues[0] || 0}
                                            <span>${typeof this.state.rangevalues[1] === 'number' ? this.state.rangevalues[1] : '2000+'}
                                                {this.state.rangevalues[1] && parseInt(this.state.rangevalues[1])===2000 && "+"}
                                     </span></p>
                                    </div>
                                }
                                <button  onClick={()=>{

                                    this.popup()
                                }} className="btn text-uppercase button"
                                         disabled

                                >{search ? "Search": <Spinner/>}</button>
                                <p className="">
                                    {/*3829 jobs posted the past 30 days.*/}
                                </p>
                            </div>
                        </div>
                        <div ref="results" className="col-md-8 pr-0">
                            <div className="right-side" style={{
                                minHeight: "532px"
                            }}>
                                <div className="top">
                                    {
                                        <h2>Talented Virtual Assistants</h2>
                                    }
                                </div>
                                {
                                    searchloader &&
                                    <div className="whole-div">
                                        <Spinner />
                                    </div>
                                }
                                {
                                    !searchloader && this.state.allsearchclients !== null && this.state.allsearchclients.length > 0 &&
                                    query(this.state.allsearchclients, this.state.startIndex, this.state.endIndex)
                                        .map((item, index) => {
                                            return (
                                                [<MediaQuery maxDeviceWidth="767px">
                                                    {
                                                    <div className="whole-div-new-worker" key={index}>
                                                        <Link
                                                            to={`/work-profile/${item.userId}`}>
                                                            <div onClick={() => this.gotoprofile(
                                                                item, "picture")} className="img-div">
                                                                <img src={
                                                                    item.client ? item.client.profilePicturePath
                                                                        ? item.client.profilePicturePath : placeholder :
                                                                        item.profilePicturePath ? item.profilePicturePath : placeholder}
                                                                     alt=""
                                                                />
                                                            </div>
                                                        </Link>
                                                        <div className="info">
                                                            <div className={`first-div`}>
                                                                <div className="content">
                                                                    <Link to={`/job-details-work/${item.id}`}>
                                                                        <p style={{color: 'black'}}
                                                                           onClick={() => this.gotoprofile(item, "title")}
                                                                           className={ "pointer "}>
                                                                            {item.title}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                                <p className={`skills`}>
                                                                    {
                                                                        item.skills.map((ite, index) => {
                                                                            return item.skills.length - 1 !== index ? ite.name + ", " :
                                                                                ite.name
                                                                        })
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className={`second-div`}>
                                                                {
                                                                    item.salary && item.salary !== "Salary/Month (USD)" &&
                                                                    <h4>
                                                                        ${ item.salary }
                                                                        { item.salary === "2000" && "+" }/{ salaryTypes[item.salaryTypeId - 1].name.toLowerCase().replace("ly", "") }
                                                                    </h4>
                                                                }
                                                                <p>{ item.availability ? parseInt(item.availability) !== 0 && item.availability : item.type}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                    {
                                                    <div className="whole-div-new" key={index}>
                                                        <div className="first-new">
                                                            <Link
                                                                to={`/work-profile/${item.userId}`}>
                                                                <div onClick={() => this.gotoprofile(
                                                                    item, "picture")} className="ava-div-new">
                                                                    <img src={
                                                                        item.client ? item.client.profilePicturePath
                                                                            ? item.client.profilePicturePath : placeholder :
                                                                            item.profilePicturePath ? item.profilePicturePath : placeholder}
                                                                         alt=""/>
                                                                </div>
                                                            </Link>
                                                            <div className="content-new">
                                                                <div className="content-name">
                                                                    <Link to={`/work-profile/${item.userId}`}>
                                                                        <h4 onClick={() => this.gotoprofile(item, "name")}
                                                                            className="pointer">
                                                                            {item.name && item.name}
                                                                        </h4>
                                                                    </Link>
                                                                </div>
                                                                <div className="salary-new">
                                                                    { item.salary && item.salary !== "Salary/Month (USD)" &&
                                                                        <h4>
                                                                            ${ item.salary }
                                                                            {item.salary === "2000" && "+"}/{
                                                                                salaryTypes[item.salaryTypeId - 1].name.toLowerCase().replace("ly", "")
                                                                        }
                                                                        </h4>
                                                                    }
                                                                    <p>{   item.availability ? parseInt(item.availability) !== 0 && item.availability : item.type }</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="second-new">
                                                            <p>
                                                                {
                                                                    item.skills.map((ite, index) => {
                                                                        return item.skills.length - 1 !== index ? ite.name + ", " :
                                                                            ite.name
                                                                    })
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="last-new">
                                                            {
                                                                item.lastLoginDate !== null &&
                                                                <p>
                                                                    Last logged:&nbsp;
                                                                    <Moment fromNow ago>
                                                                        { this.localdate(new Date(item.lastLoginDate))}
                                                                    </Moment> ago
                                                                </p>
                                                            }
                                                        </div>
                                                    </div>
                                                    }
                                                </MediaQuery>,
                                                    <MediaQuery minDeviceWidth="768px">
                                                        <div className="whole-div" key={index}>
                                                            <div className="first">
                                                                <Link
                                                                    to={`/work-profile/${item.userId}`}>
                                                                    <div onClick={() => this.gotoprofile(
                                                                        item, "picture")} className="img-div pointer">
                                                                        <img src={
                                                                            item.client ? item.client.profilePicturePath
                                                                                ? item.client.profilePicturePath : placeholder :
                                                                                item.profilePicturePath ? item.profilePicturePath : placeholder}
                                                                             alt=""/>
                                                                    </div>
                                                                </Link>
                                                                <div className="content">
                                                                    <Link to={`/work-profile/${item.userId}`}>
                                                                        <h4 onClick={() => this.gotoprofile(item, "name")}
                                                                            className="pointer">
                                                                            { item.name && item.name }
                                                                        </h4>
                                                                    </Link>
                                                                    {
                                                                        <p style={{color: 'black'}}
                                                                           className={ ""}>
                                                                            { item.title }
                                                                        </p>
                                                                    }
                                                                    <p>
                                                                        {
                                                                            item.skills.map((ite, index) => {
                                                                                return item.skills.length - 1 !== index ? ite.name + ", " :
                                                                                    ite.name
                                                                            })
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="second">
                                                                {
                                                                    item.salary && item.salary !== "Salary/Month (USD)" &&
                                                                    <h4>
                                                                        ${item.salary}
                                                                        {item.salary === "2000" && "+"}/{
                                                                            salaryTypes[item.salaryTypeId - 1].name.toLowerCase().replace("ly", "")
                                                                    }
                                                                    </h4>
                                                                }
                                                                <p>
                                                                    {   item.availability ? parseInt(item.availability) !== 0 && item.availability :
                                                                        item.type
                                                                    }
                                                                </p>
                                                                {

                                                                    item.lastLoginDate !== null &&
                                                                    <p>
                                                                        <Moment fromNow ago>
                                                                            { this.localdate(new Date(item.lastLoginDate))}
                                                                        </Moment> ago
                                                                    </p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </MediaQuery>
                                                ]
                                            )
                                        })
                                }
                            </div>
                            {
                                this.state.allsearchclients !== null &&
                                <Pagination
                                    forcedPage={parseInt(currentPage) || 1}
                                    pageSize={10}
                                    countItems={
                                        this.state.allsearchclients !== null ? this.state.allsearchclients.length:
                                            []
                                    }
                                    onChangePage={this.handleChangePage.bind(this)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ main, jobs,auth,unreadCount }) => {
    return {
        loggedIn: main.loggedIn,
        userStoreData: main.userStoreData,
        jobs,
        user:auth.user,
        searchword:unreadCount.search
    };
};

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
    mapStateToProps,
    {mapDispachToProps,setUserType}
)(SearchWork);
