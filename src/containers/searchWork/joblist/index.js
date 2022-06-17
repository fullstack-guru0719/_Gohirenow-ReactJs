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
import {isMobile, isTablet, mobileVendor} from "react-device-detect";
import Pagination from "../../../utils/seopagination";
import ReactDOM from "react-dom";
import MediaQuery from "react-responsive";
import MetaTags from 'react-meta-tags';
import Swal from "sweetalert2";
import { setUserType } from '../../auth/actions';
import TextParser from "../../../utils/TextParser";


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
        searchloader:true,
        searchedkeyword:"",
        activejobs:true,
        expertsearch:true,
        skillssearchdash:false,
        searchedskils:[],
        startIndex: 0,
        endIndex: 10,
        titleselected:"",
        alldata:null
    };

    componentDidMount(){
        window.scroll(0,0);
        const { props: { history: {location} } } = this;
        axios.get(`${apiPath}/lookup/countries`).then((res)=>{
            this.setState({countries:res.data});
        }).catch((err)=>{});
        let searchkeyword = this.props.match.params.id;

        this.searchQuery(searchkeyword);
    }

    searchQuery=(keyword)=>{
        axios.get(apiPath+"/hire/job-titles").then((res)=>{
            let titleto="";
            res.data.map((item)=>{
                item.jobTitles.map((ite)=>{
                    console.log("item", ite.friendlyUrl,this.props.match.params.category)
                    if(ite.friendlyUrl===this.props.match.params.category){
                        titleto=ite.name;
                    }
                })
            });
            console.log("making this",titleto, res.data.filter(title => title.friendlyUrl===this.props.match.params.category),this.props.match.params.category, res.data);
            this.setState({titleselected: titleto})
        })
        axios.get(`${apiPath}/jobs/global-jobs/${keyword}`).then
        ((res)=>{
            let data=res.data.jobs.filter((item)=>
            {return item.title && item.profilePicturePath &&
                item.profilePicturePath!=="https://apiv1.gohirenow.com/resources/profile-pictures/worker-default-icon.svg"});
            const { props: { history: { location }}} = this;
            const currentUrl = queryString.parse(location.search);
            const { tagsQuery, searchQuery, selectorQuery, from, to, page } = currentUrl;
            const isCurrentUrlParameters = tagsQuery || searchQuery || selectorQuery || from || to || (page && page !=1);

            if ( page ) {
                let startIndex = page >= 1 ? (page - 1) * 10 : 0;
                let endIndex = page >= 2 ? page * 10 : 10;
                this.setState({ startIndex:startIndex, endIndex:endIndex});
                this.urlUpdate({page:page});
            }
            else {
                // this.urlUpdate({page:1});
            }
            this.setState({
                allsearchclients:data,searchloader:false,
                alldata:res.data});
        }).catch((err)=>{
            this.setState({searchloader:false});
        })
    }

    handleChangeSelect(e) {
        this.setState({countryId:e.target.value});
    }

    rangevalue = (rangevalues) => {
        this.setState({rangevalues: rangevalues}, () => this.urlUpdate({from: rangevalues[0], to: rangevalues[1]}));
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { props: { history: {location}, jobs: { suggestions } = {} }, state: {tags, keyword, jobType, searchedkeyword, rangevalues, startIndex, page: statePage} } = this;
        const { rangevalues: prevRangeValues } = prevState;
        const currentUrl = queryString.parse(location.search);
        const { tagsQuery, searchQuery, selectorQuery, from, to, page } = currentUrl;
        const urlHasProps = tagsQuery || searchQuery || selectorQuery || from || to || page;
        const isInitState = tags.length === 0 && keyword === "" && searchedkeyword === "" && !jobType && from != rangevalues[0] && to !=rangevalues[1] && from != prevRangeValues[0] && to != prevRangeValues[1] && startIndex == 0 && statePage == 1;
        const newState = {};
        if (urlHasProps && suggestions.length && isInitState) {
            if (tagsQuery) {
                const tagsArr = tagsQuery.split(',');
                const newTags = [];
                for (let i = 0; i < tagsArr.length; i++) {
                    newTags.push(suggestions.find(tag => tag.id === parseInt(tagsArr[i])))
                }
                newState.tags = newTags;
                newState.jobSkills = newTags;
                newState.skillsArr = newTags;
            }
            if (searchQuery) {
                newState.keyword = searchQuery;
            }
            if (selectorQuery) {
                newState.jobType = selectorQuery;
            }
            if (from) {
                newState.rangevalues = [from, rangevalues[1]]
            }
            if (to) {
                newState.rangevalues = from ? [from, to] : [rangevalues[0], to]
            }
            if ((page && page!=1) || (page && page == 1 && prevState.page && prevState.page !=1)) {

                newState.startIndex = page >= 1 ? (page - 1) * 10 : 0;
                newState.endIndex = page >= 2 ? page * 10 : 10;
                newState.page= parseInt(page);
                console.log("working on false of page", page, newState)
                // page !== false ? newState.page=page: newState.page=1;
            }
            Object.keys(newState).length != 0 && this.setState(newState, () =>this.searchQuery(searchQuery));
        }
    }
    urlUpdate(params) {
        console.log("more on this");
        const { tags, searchInput, availabilitySelector, from, to, page } = params;
        const { props: { history } } = this;
        const { location } = history;
        const currentUrl = queryString.parse(location.search);
        console.log("locationsearch", location.pathname, location.search, this.props.history.location.pathname)
        if (params.hasOwnProperty('tags')) {
            tags.length > 0 ? currentUrl.tagsQuery = tags.map(tag => tag.id).toString() : delete currentUrl.tagsQuery;
        }
        if (params.hasOwnProperty('searchInput')) {
            searchInput ? currentUrl.searchQuery = searchInput : delete currentUrl.searchQuery;
        }
        if (params.hasOwnProperty('availabilitySelector')) {
            availabilitySelector ? currentUrl.selectorQuery = availabilitySelector : delete currentUrl.selectorQuery;
        }
        if (params.hasOwnProperty('from')) {
            from ? currentUrl.from = from : delete currentUrl.from;
        }
        if (params.hasOwnProperty('to')) {
            to ? currentUrl.to = to : delete currentUrl.to;
        }
        if (params.hasOwnProperty('page')) {
            page !== false  ? currentUrl.page = page : delete currentUrl.page;
        }
        history.push({
            search: "?" + new URLSearchParams(currentUrl)
        });
    }
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
        // let {user}=this.props;
        // if(user && parseInt(user.userTypeId)===1 ){
        //     if(check==="picture"){
        //         localStorage.setItem("profileId",item.userId);
        //     }
        //     if(check==="name"){
        //         localStorage.setItem("profileId",item.userId);
        //     }
        // }
        // else if(user && parseInt(user.userTypeId)===2 ){
        //     if(check==="picture"){
        //         localStorage.setItem("profileId", item.client.id);
        //     }
        // }
    }


    handleChangePage=(startIndex, endIndex, currentPage) =>{
        const resNode = ReactDOM.findDOMNode(this.refs.results);
        if (!isTablet && !isMobile) {
            window.scrollTo(0, resNode.offsetTop - 20);
        }
        else {
            window.scrollTo(0, resNode.offsetTop);
        }
        this.setState({ startIndex:  startIndex, endIndex: endIndex},()=>{
            this.urlUpdate({page: currentPage!=="false" ? currentPage:1});
        });
    };

    gotohire=()=>{
        this.props.setUserType(1);
        this.props.history.push('/register')
    }
    popup = () => {
        Swal.fire({
            // title: "Are you sure you want to delete this candidate?",
            html: `<h2>You need to create an account to search candidates.</h2>
								<p style="margin-top: 50px;"></p>`,
            type: "warning",
            width: "950px",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Sign Up"
        }).then((result) => {if (result.value) {this.props.history.push("/register");}})
    }
    render() {

        let{dispatch, loggedIn, user, history: {location}, isAuthenticated}= this.props;
        const isClient = user && user.userTypeId == 1;
        let {countries,search,searchloader,searchedkeyword,activejobs, searchedSkills, rangevalues}= this.state;
        let placeholder= workerpladce;
        const currentPage = queryString.parse(location.search).page;
        return (
            <div  id="search">
                <div className="hire-want-section new-home2"  >
                    <div className="container">
                        <div className="row">
                            <div className="col-7 hire-page-header-inner" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                                <div className="largetext1 new-text-h1">
                                    <MediaQuery minDeviceWidth="1200px">
                                        <h1 style={{ marginTop: "44px",
                                        }}>
                                            {           console.log("more on this", this.state.alldata)             }
                                            {
                                                this.state.alldata && this.state.alldata.jobBigTitle
                                            }
                                        </h1>
                                    </MediaQuery>
                                    <MediaQuery maxDeviceWidth="1199px">
                                        <span className={'hire-page-header-text job-page-header-text'}>
                                            {this.state.alldata && this.state.alldata.jobBigTitle}
                                        </span>
                                    </MediaQuery>
                                </div>
                                <div className="hire-work-buttons  ">
                                    <Link to="/register">
                                    <button className="btn text-uppercase new-search-btn " onClick={()=> this.gotohire()}>POST A JOB</button>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-5 pr-0">
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
                <div className="as-seen-as" style={{
                    backgroundColor: "#333333"}}>
                    <div className="container-fluid d-flex justify-content-center">
                        <div className="row black-back black-back-header" style={{
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
                <div className="container pl-0 " >
                    <div className="row align-pad " style={{
                        padding: "0% 0px 0% 15px"
                    }}>
                        <div className="col-md-12 pl-0">
                            <h2 className="text-center text-uppercase mb-0"
                                style={{
                                    padding: "4% 0px 3% 15px",
                                    fontSize: "28px",
                                    fontWeight: "700"
                                }}
                            >
                                {
                                    this.state.alldata && this.state.alldata.jobTitle
                                }
                            </h2>
                            <h3
                                style={{
                                    padding: "0% 0px 4% 15px",
                                    fontSize: "22px",
                                    lineHeight: "1.3",
                                    fontWeight: "500"
                                }}
                                className="mb-0 text-center">
                                {
                                    this.state.alldata && this.state.alldata.jobDescripton
                                }
                            </h3>
                        </div>
                    </div>
                    <div className="row" ref="test">
                        <div className="col-md-4  ">
                            <div className="left-side" onClick={()=> this.popup()}>
                                <h4>FIND AN EXPERT</h4>
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
                                    disabled
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
                                <div ref="results" className="top">
                                    {
                                        <h2>Recent Jobs</h2>
                                    }
                                </div>
                                {
                                    searchloader &&
                                    <div className="whole-div">
                                        <Spinner />
                                    </div>
                                }
                                { (this.state.allsearchclients === null || this.state.allsearchclients.length === 0) &&  !searchloader ?
                                    <div className="whole-div">
                                        No jobs found
                                    </div>:""
                                }
                                {
                                    !searchloader && this.state.allsearchclients !== null && this.state.allsearchclients.length > 0 &&
                                    query(this.state.allsearchclients, this.state.startIndex, this.state.endIndex)
                                        .map((item, index) => {
                                            return (
                                                [<MediaQuery maxDeviceWidth="767px">
                                                    {
                                                        <div className="whole-div-new-worker" key={index}>
                                                            <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
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
                                                                        <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
                                                                            <p style={{color: 'black'}}
                                                                               className={ "pointer b-900 "}><TextParser text={item.title}/></p>
                                                                        </Link>
                                                                    </div>
                                                                    <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
                                                                        <p className={`client-title-search`}>
                                                                            <TextParser text={item.client.companyName}/>
                                                                        </p>
                                                                    </Link>
                                                                    <p className={`skills`}>
                                                                        {
                                                                            item.skills && item.skills.map((ite, index) => {
                                                                                return item.skills.length - 1 !== index ? ite.name + ", " :
                                                                                    ite.name
                                                                            })
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className={`second-div`}>
                                                                    {
                                                                        item.salary && item.salary !== "Salary/Month (USD)" &&
                                                                        <h4 className="text-center">
                                                                            ${ item.salary }
                                                                            { item.salary === "2000" && "+" }/{ salaryTypes[item.salaryTypeId - 1].name.toLowerCase().replace("ly", "") }
                                                                        </h4>
                                                                    }
                                                                    <p>{ item.availability ? parseInt(item.availability) !== 0 && item.availability : item.type}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </MediaQuery>,
                                                    <MediaQuery minDeviceWidth="768px">
                                                        <div className="whole-div" key={index}>
                                                            <div className="first">
                                                                <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
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
                                                                    <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
                                                                        <h4 className="pointer">
                                                                            <TextParser text={item.name}/>
                                                                        </h4>
                                                                    </Link>
                                                                    {
                                                                        <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
                                                                        <p style={{color: 'black'}}
                                                                           className={ "b-900"}><TextParser text={item.title}/></p>
                                                                        </Link>

                                                                    }
                                                                    <Link to={`/job/${this.props.match.params.category.toLowerCase().replace(/\s+/g, '-')}/${item.title && item.title.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.countryName && item.client.countryName.toLowerCase().replace(/\s+/g, '-')}/${item.client && item.client.companyName && item.client.companyName.toLowerCase().replace(/\s+/g, '-')}/${item.id&&item.id}`}>
                                                                        <p className={`client-title-search`}>
                                                                            {item.client.companyName}
                                                                        </p>
                                                                    </Link>
                                                                    <p>
                                                                        {
                                                                            item.skills &&item.skills.map((ite, index) => {
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
                                                                    <h4 className="text-center">
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
                                                                {/*{*/}

                                                                    {/*item.lastLoginDate !== null &&*/}
                                                                    {/*<p>*/}
                                                                        {/*<Moment fromNow ago>*/}
                                                                            {/*{ this.localdate(new Date(item.lastLoginDate))}*/}
                                                                        {/*</Moment> ago*/}
                                                                    {/*</p>*/}
                                                                {/*}*/}
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

const mapStateToProps = ({ main, jobs,auth,unreadCount, billing }) => {
    return {
        loggedIn: main.loggedIn,
        userStoreData: main.userStoreData,
        jobs,
        user:auth.user,
        searchword:unreadCount.search,
        isAuthenticated: auth.isAuthenticated,
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
