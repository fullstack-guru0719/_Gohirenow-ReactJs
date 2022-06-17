import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiPath } from "../../../services/config";
import { Slider, Rail, Handles } from "react-compound-slider";
import ReactTags from "react-tag-autocomplete";
import workerpladce from "../../../assets/img_avatar.svg";
import Spinner from "../../../components/spinner";
import { salaryTypes } from "../../../utils/constants/SalaryTypes";
import Moment from "react-moment";
import { SliderRail, Handle } from "../../../components/slider/components";
import { domain, defaultValues } from "../../../utils/constants/Slider";
import queryString from "query-string";
import { isMobile, isTablet, mobileVendor } from "react-device-detect";
import Pagination from "../../../utils/seopagination";
import MediaQuery from "react-responsive";
import { withCookies, Cookies } from "react-cookie";

import Swal from "sweetalert2";
import { setUserType } from "../../auth/actions";
import TextParser from "../../../utils/TextParser";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import StarRating from "../../../components/starRating";
import {
  JoinForFreeDesktop,
  JoinForFreeMobile,
} from "../../../components/JoinForFree";

const MAX_LENGTH = 160;
function trimString(str) {
  if (!str) return "";
  if (str.length < MAX_LENGTH) return str;
  const trimmedString = str.substring(0, MAX_LENGTH);
  return trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
  );
}

class SearchWork extends Component {
  state = {
    rangevalues: ["", ""],
    countries: [],
    keyword: "",
    countryId: null,
    jobType: null,
    tags: [],
    jobSkills: [],
    allsearchclients: null,
    searchclients: null,
    search: true,
    searchloader: true,
    searchedkeyword: "",
    activejobs: true,
    expertsearch: true,
    skillssearchdash: false,
    searchedskils: [],
    startIndex: 0,
    endIndex: 10,
    titleselected: "",
    alldata: null,
    title: "",
    description: "",
    totalWorkers: 0,
    page: 1,
    minRating: 0,
  };

  componentDidMount() {
    const { cookies } = this.props;
    if (cookies && !cookies.get("LandingPage")) {
      cookies.set("LandingPage", 101, {
        expires: new Date("Thu, 18 Dec 2050 12:00:00 UTC"),
        path: "/",
      });
    }
    window.scroll(0, 0);
    const {
      props: {
        history: { location },
      },
    } = this;
    axios
      .get(`${apiPath}/lookup/countries`)
      .then((res) => {
        this.setState({ countries: res.data });
      })
      .catch((err) => {});

    let searchkeyword = this.props.match.params.id;

    this.setState({ keyword: searchkeyword });
    this.searchQuery(searchkeyword);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.searchword !== "" &&
      nextProps.searchword != this.props.searchword
    ) {
      this.setState(
        {
          keyword: nextProps.searchword,
          jobType: null,
          tags: [],
          jobSkills: [],
          skillsArr: [],
          searchedSkills: "",
          rangevalues: ["", ""],
          education: "",
          experience: "",
        },
        () => {
          this.urlUpdate({ searchInput: nextProps.searchword });
          this.searchQuery(nextProps.searchword);
        }
      );
    }
  }

  searchQuery = (keyword) => {
    axios.get(apiPath + "/hire/job-titles").then((res) => {
      let titleto = "";
      res.data.map((item) => {
        item.jobTitles.map((ite) => {
          if (ite.friendlyUrl === this.props.match.params.category) {
            titleto = ite.name;
          }
        });
      });
      this.setState({ titleselected: titleto });
    });
    const currentPage = queryString.parse(this.props.history.location.search)
      .page;
    const params = {
      size: 10,
      page: currentPage ? currentPage : 1,
    };
    axios
      .get(`${apiPath}/hire/workers/${keyword}`, { params })
      .then((res) => {
        console.log("response", res.data);
        let data = res.data.workers.filter((item) => {
          return (
            item.title &&
            item.profilePicturePath &&
            item.profilePicturePath !==
              "https://apiv1.gohirenow.com/resources/profile-pictures/worker-default-icon.svg"
          );
        });

        const {
          props: {
            history: { location },
          },
        } = this;
        const currentUrl = queryString.parse(location.search);
        const {
          tagsQuery,
          searchQuery,
          selectorQuery,
          from,
          to,
          page,
        } = currentUrl;
        const isCurrentUrlParameters =
          tagsQuery ||
          searchQuery ||
          selectorQuery ||
          from ||
          to ||
          (page && page != 1);

        if (page) {
          let startIndex = page >= 1 ? (page - 1) * 10 : 0;
          let endIndex = page >= 2 ? page * 10 : 10;
          console.log("page is true", startIndex, endIndex, page);
          this.setState({ startIndex: startIndex, endIndex: endIndex });
          this.urlUpdate({ page: page });
        } else {
          // this.urlUpdate({page:1});
        }
        console.log("setting Data", data);
        this.setState({
          title: res.data.jobBigTitle,
          description: res.data.jobDescripton,
          allsearchclients: data,
          searchloader: false,
          alldata: res.data,
          totalWorkers: res.data.totalWorkers,
        });
      })
      .catch((err) => {
        this.setState({ searchloader: false });
      });
  };

  handleChangeSelect(e) {
    this.setState({ countryId: e.target.value });
  }

  rangevalue = (rangevalues) => {
    this.setState({ rangevalues: rangevalues }, () =>
      this.urlUpdate({ from: rangevalues[0], to: rangevalues[1] })
    );
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      props: {
        history: { location },
        jobs: { suggestions } = {},
      },
      state: {
        tags,
        keyword,
        jobType,
        searchedkeyword,
        rangevalues,
        startIndex,
        page: statePage,
      },
    } = this;
    const { rangevalues: prevRangeValues } = prevState;
    const currentUrl = queryString.parse(location.search);
    const {
      tagsQuery,
      searchQuery,
      selectorQuery,
      from,
      to,
      page,
    } = currentUrl;
    const urlHasProps =
      tagsQuery || searchQuery || selectorQuery || from || to || page;
    const isInitState =
      tags.length === 0 &&
      keyword === "" &&
      searchedkeyword === "" &&
      !jobType &&
      from != rangevalues[0] &&
      to != rangevalues[1] &&
      from != prevRangeValues[0] &&
      to != prevRangeValues[1] &&
      startIndex == 0 &&
      statePage == 1;
    const newState = {};
    if (urlHasProps && suggestions.length && isInitState) {
      if (tagsQuery) {
        const tagsArr = tagsQuery.split(",");
        const newTags = [];
        for (let i = 0; i < tagsArr.length; i++) {
          newTags.push(
            suggestions.find((tag) => tag.id === parseInt(tagsArr[i]))
          );
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
        newState.rangevalues = [from, rangevalues[1]];
      }
      if (to) {
        newState.rangevalues = from ? [from, to] : [rangevalues[0], to];
      }
      if (
        (page && page != 1) ||
        (page && page == 1 && prevState.page && prevState.page != 1)
      ) {
        newState.startIndex = page >= 1 ? (page - 1) * 10 : 0;
        newState.endIndex = page >= 2 ? page * 10 : 10;
        newState.page = parseInt(page);
        console.log("working on false of page", page, newState);
        // page !== false ? newState.page=page: newState.page=1;
      }
      Object.keys(newState).length != 0 &&
        this.setState(newState, () => this.searchQuery(searchQuery));
    }
  }
  urlUpdate(params) {
    const { tags, searchInput, availabilitySelector, from, to, page } = params;
    const {
      props: { history },
    } = this;
    const { location } = history;
    const currentUrl = queryString.parse(location.search);
    if (params.hasOwnProperty("tags")) {
      tags.length > 0
        ? (currentUrl.tagsQuery = tags.map((tag) => tag.id).toString())
        : delete currentUrl.tagsQuery;
    }
    if (params.hasOwnProperty("searchInput")) {
      searchInput
        ? (currentUrl.searchQuery = searchInput)
        : delete currentUrl.searchQuery;
    }
    if (params.hasOwnProperty("availabilitySelector")) {
      availabilitySelector
        ? (currentUrl.selectorQuery = availabilitySelector)
        : delete currentUrl.selectorQuery;
    }
    if (params.hasOwnProperty("from")) {
      from ? (currentUrl.from = from) : delete currentUrl.from;
    }
    if (params.hasOwnProperty("to")) {
      to ? (currentUrl.to = to) : delete currentUrl.to;
    }
    if (params.hasOwnProperty("page")) {
      page !== false ? (currentUrl.page = page) : delete currentUrl.page;
    }
    history.push({
      search: "?" + new URLSearchParams(currentUrl),
    });
  }

  onChangetag = (e) => {};
  handleDelete = (i) => {
    if (this.state.tags) {
      let newTags = [];
      this.state.tags.map((item, index) => {
        if (index !== i) {
          newTags.push(item);
        }
      });
      this.urlUpdate({ tags: newTags });
      this.setState({ tags: newTags, jobSkills: newTags, skillsArr: newTags });
      // setFormData({...formData,jobSkills: newTags})
    }
  };
  handleAddition = (tag) => {
    let { tags } = this.state;
    // let tagz=[tags];
    let tager = [...tags, tag];

    if (tag) {
      this.urlUpdate({ tags: tager });
      this.setState({ tags: tager, jobSkills: tager, skillsArr: tager });
    }
  };
  localdate(date) {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  }
  gotoprofile(item, check) {
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
  handleChangePage = (startIndex, endIndex, currentPage) => {
    const resNode = ReactDOM.findDOMNode(this.refs.results);
    if (!isTablet && !isMobile) {
      window.scrollTo(0, resNode.offsetTop - 20);
    } else {
      window.scrollTo(0, resNode.offsetTop);
    }
    this.setState(
      {
        startIndex: startIndex,
        endIndex: endIndex,
        page: currentPage !== "false" ? currentPage : 1,
      },
      () => {
        // this.urlUpdate({ page: currentPage !== "false" ? currentPage : 1 });
        this.searchQuery(this.state.keyword);
      }
    );
  };

  gotohire = () => {
    this.props.setUserType(1);
    this.props.history.push("/register");
  };
  popup = () => {
    Swal.fire({
      // title: "Are you sure you want to delete this candidate?",
      html: `<h2>You need to create an account to search candidates.</h2>
								<p style="margin-top: 50px;"></p>`,
      type: "warning",
      width: "950px",
      showCancelButton: true,
      confirmButtonColor: "#ED7B18",
      confirmButtonText: "Sign Up",
    }).then((result) => {
      if (result.value) {
        this.props.history.push("/register");
      }
    });
  };

  render() {
    let {
      dispatch,
      loggedIn,
      user,
      history: { location },
      isAuthenticated,
    } = this.props;
    let {
      countries,
      search,
      searchloader,
      searchedkeyword,
      activejobs,
      searchedSkills,
      rangevalues,
      title,
      description,
      minRating,
    } = this.state;
    let placeholder = workerpladce;
    const currentPage = queryString.parse(location.search).page;
    // let combine=`/${this.props.match.params.category}`;
    let combine = `/hire-virtual-assistant`;

    const trimTitle = trimString(title);
    const trimDesc = trimString(description);

    return (
      <div id="search">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{trimTitle}</title>
          <title>{trimTitle}</title>
          <meta name="title" content={trimTitle} />
          <meta property="og:title" content={trimTitle} />
          <meta name="description" content={trimDesc} />
          <meta property="description" content={trimDesc} />
          <meta property="og:description" content={trimDesc} />
        </Helmet>
        <div className="hire-want-section new-home2">
          <div className="container">
            <div className="row">
              <div
                className="col-7 hire-page-header-inner"
                style={{ paddingLeft: "0px", paddingRight: "0px" }}
              >
                <div className="largetext1 new-text-h1">
                  <MediaQuery minDeviceWidth="1200px">
                    <h1 style={{ marginTop: "44px" }}>
                      {this.state.alldata && this.state.alldata.jobBigTitle}
                    </h1>
                  </MediaQuery>
                  <MediaQuery maxDeviceWidth="1199px">
                    <span className={"hire-page-header-text"}>
                      {this.state.alldata && this.state.alldata.jobBigTitle}
                    </span>
                  </MediaQuery>
                </div>
                <div className="hire-work-buttons  ">
                  <Link to="/register">
                    <button
                      className="btn text-uppercase new-search-btn "
                      onClick={() => this.gotohire()}
                    >
                      POST A JOB
                    </button>
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
        <div className="as-seen-as" style={{ backgroundColor: "#333333" }}>
          <div className="container-fluid d-flex justify-content-center">
            <div
              className="row black-back black-back-header "
              style={{
                width: "88%",
                padding: "25px 49px",
              }}
            >
              <h2 className="text-uppercase new-style-needed">as seen on</h2>
              <div className="black-circle-adj">
                <div>
                  <img src={require("../../../assets/seen1.png")} alt="" />
                </div>
                <div>
                  <img
                    className="bottom-fixed"
                    src={require("../../../assets/seen2.png")}
                    alt=""
                  />
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
        <div className="container pl-0 ">
          <div
            className="row align-pad "
            style={{
              padding: "0% 0px 0% 15px",
            }}
          >
            <div className="col-md-12 pl-0">
              <h2
                className="text-center text-uppercase mb-0"
                style={{
                  padding: "4% 0px 3% 15px",
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                {this.state.alldata && this.state.alldata.jobTitle}
              </h2>
              <h3
                style={{
                  padding: "0% 0px 4% 15px",
                  fontSize: "22px",
                  lineHeight: "1.3",
                  fontWeight: "500",
                }}
                className="mb-0 text-center"
              >
                {this.state.alldata && this.state.alldata.jobDescripton}
              </h3>
            </div>
          </div>
          <div className="row" ref="test">
            <div className="col-md-4  ">
              <div className="left-side" onClick={() => this.popup()}>
                <h4>FIND AN EXPERT</h4>
                <div className="search">
                  <input
                    type="text"
                    name="keyword"
                    onChange={() => this.popup()}
                    disabled
                    placeholder="Keyword"
                  />
                  <i className="fa fa-search" />
                </div>
                <ReactTags
                  name="jobSkills"
                  placeholder="Skills"
                  onChange={(e) => this.popup()}
                  tags={this.state.tags}
                  suggestions={this.props.jobs && this.props.jobs.suggestions}
                  handleDelete={this.handleDelete.bind(this)}
                  handleAddition={this.handleAddition.bind(this)}
                  allowBackspace={false}
                  autofocus={false}
                  disabled
                />
                <select name="jobType" onChange={(e) => this.this.popup(e)}>
                  <option value="">Availability</option>
                  <option selected={this.state.jobType === "1"} value="1">
                    Full-time
                  </option>
                  <option selected={this.state.jobType === "2"} value="2">
                    Part-time
                  </option>
                </select>
                {
                  <div className="range-div">
                    <p className="ml-4 font-weight-bold text-dark font-16">
                      Monthly Salary (USD)
                    </p>
                    <Slider
                      mode={1}
                      step={1}
                      domain={domain}
                      className="slider-ghn"
                      onUpdate={this.popup}
                      onChange={this.popup}
                      values={
                        rangevalues[0] || rangevalues[1]
                          ? [rangevalues[0], rangevalues[1]]
                          : defaultValues
                      }
                    >
                      <Rail>
                        {({ getRailProps }) => (
                          <SliderRail getRailProps={getRailProps} />
                        )}
                      </Rail>
                      <Handles>
                        {({ handles, activeHandleID, getHandleProps }) => (
                          <div className="slider-handles">
                            {handles.map((handle) => (
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

                    <p>
                      ${this.state.rangevalues[0] || 0}
                      <span>
                        $
                        {typeof this.state.rangevalues[1] === "number"
                          ? this.state.rangevalues[1]
                          : "2000+"}
                        {this.state.rangevalues[1] &&
                          parseInt(this.state.rangevalues[1]) === 2000 &&
                          "+"}
                      </span>
                    </p>
                    {/* <p className="ml-4 font-weight-bold text-dark font-16">
                      Rating
                    </p>
                    <StarRating
                      rating={minRating}
                      onChange={(rating) =>
                        this.setState({ minRating: rating })
                      }
                    /> */}
                  </div>
                }
                <button
                  onClick={() => {
                    this.popup();
                  }}
                  className="btn text-uppercase button"
                  disabled
                >
                  {search ? "Search" : <Spinner />}
                </button>
                <p className="">{/*3829 jobs posted the past 30 days.*/}</p>
              </div>
            </div>
            <div ref="results" className="col-md-8 pr-0">
              <div
                className="right-side"
                style={{
                  minHeight: "532px",
                }}
              >
                <div ref="results" className="top">
                  {<h2>Talented Virtual Assistants</h2>}
                </div>
                {searchloader && (
                  <div className="whole-div">
                    <Spinner />
                  </div>
                )}

                {(this.state.allsearchclients === null ||
                  this.state.allsearchclients.length === 0) &&
                !searchloader ? (
                  <div className="whole-div">No workers found</div>
                ) : (
                  ""
                )}
                {!searchloader &&
                  this.state.allsearchclients !== null &&
                  this.state.allsearchclients.length > 0 && (
                    <>
                      {this.state.allsearchclients.map((item, index) => {
                        return [
                          <MediaQuery key={"767px-1"} maxDeviceWidth="767px">
                            {
                              <div className="whole-div-new" key={index}>
                                <div className="first-new">
                                  <Link
                                    target="_blank"
                                    to={`${combine}/${item.title
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )}/${item.countryName
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}/${
                                      item.name &&
                                      item.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")
                                        .replace(/[\/\\]/g, "")
                                        .replaceAll(".", "")
                                    }/${
                                      item.userUniqueId && item.userUniqueId
                                    }`}
                                  >
                                    <div
                                      onClick={() =>
                                        this.gotoprofile(item, "picture")
                                      }
                                      className="ava-div-new"
                                    >
                                      <img
                                        src={
                                          item.client
                                            ? item.client.profilePicturePath
                                              ? item.client.profilePicturePath
                                              : placeholder
                                            : item.profilePicturePath
                                            ? item.profilePicturePath
                                            : placeholder
                                        }
                                        alt=""
                                      />
                                    </div>
                                  </Link>
                                  <div className="content-new">
                                    <div className="content-name">
                                      <Link
                                        target="_blank"
                                        to={`${combine}/${item.title
                                          .toLowerCase()
                                          .replace(
                                            /\s+/g,
                                            "-"
                                          )}/${item.countryName
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}/${
                                          item.name &&
                                          item.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            .replace(/[\/\\]/g, "")
                                            .replaceAll(".", "")
                                        }/${
                                          item.userUniqueId && item.userUniqueId
                                        }`}
                                      >
                                        <h4 className="pointer">
                                          <TextParser text={item.name} />
                                        </h4>
                                        {item && item.featured ? (
                                          <span className="recommend-badge">
                                            Recommended
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </Link>
                                      <StarRating
                                        rating={item ? item.rating : 0}
                                      />
                                      <p
                                        style={{ color: "black" }}
                                        className={
                                          this.props.user &&
                                          this.props.user.userTypeId === 2
                                            ? "pointer b-900"
                                            : "pointer "
                                        }
                                      >
                                        <TextParser text={item.title} />
                                      </p>
                                    </div>
                                    <div className="salary-new">
                                      {item.salary &&
                                        item.salary !==
                                          "Salary/Month (USD)" && (
                                          <h4>
                                            ${item.salary}
                                            {item.salary === "2000" && "+"}/
                                            {salaryTypes[
                                              item.salaryTypeId - 1
                                            ].name
                                              .toLowerCase()
                                              .replace("ly", "")}
                                          </h4>
                                        )}
                                      <p style={{ marginBottom: 0 }}>
                                        {item.availability
                                          ? parseInt(item.availability) !== 0 &&
                                            item.availability
                                          : item.type}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="second-new">
                                  <p>
                                    {item.skills &&
                                      item.skills.map((ite, index) => {
                                        return item.skills.length - 1 !== index
                                          ? ite.name + ", "
                                          : ite.name;
                                      })}

                                    <div
                                      style={{
                                        color: "black",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {item.countryName}{" "}
                                      {item.education
                                        ? " | " + item.education
                                        : ""}{" "}
                                      {item.experience
                                        ? " | Experience " + item.experience
                                        : ""}
                                    </div>
                                  </p>
                                </div>
                                <div className="last-new">
                                  {item.lastLoginDate !== null && (
                                    <p>
                                      Last logged:&nbsp;
                                      <Moment fromNow ago>
                                        {this.localdate(
                                          new Date(item.lastLoginDate)
                                        )}
                                      </Moment>{" "}
                                      ago
                                    </p>
                                  )}
                                </div>
                              </div>
                            }
                          </MediaQuery>,
                          <MediaQuery key={"768px-1"} minDeviceWidth="768px">
                            <div className="whole-div" key={index}>
                              <MediaQuery maxDeviceWidth="1199px">
                                {item && item.featured ? (
                                  <span className="recommend-badge recommend-badge-absolute">
                                    Recommended
                                  </span>
                                ) : (
                                  ""
                                )}
                              </MediaQuery>
                              <div className="first mt-xl-0">
                                <Link
                                  target="_blank"
                                  to={`${combine}/${item.title
                                    .toLowerCase()
                                    .replace(
                                      /\s+/g,
                                      "-"
                                    )}/${item.countryName
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}/${
                                    item.name &&
                                    item.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                                      .replace(/[\/\\]/g, "")
                                      .replaceAll(".", "")
                                  }/${item.userUniqueId && item.userUniqueId}`}
                                >
                                  <div
                                    onClick={() =>
                                      this.gotoprofile(item, "picture")
                                    }
                                    className="img-div pointer"
                                  >
                                    <img
                                      src={
                                        item.client
                                          ? item.client.profilePicturePath
                                            ? item.client.profilePicturePath
                                            : placeholder
                                          : item.profilePicturePath
                                          ? item.profilePicturePath
                                          : placeholder
                                      }
                                      alt=""
                                    />
                                  </div>
                                </Link>
                                <div className="content">
                                  <Link
                                    target="_blank"
                                    to={`${combine}/${item.title
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )}/${item.countryName
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}/${
                                      item.name &&
                                      item.name
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")
                                        .replace(/[\/\\]/g, "")
                                        .replaceAll(".", "")
                                    }/${
                                      item.userUniqueId && item.userUniqueId
                                    }`}
                                  >
                                    <div className="name-star-wrapper">
                                      <div className="d-flex flex-row align-items-center">
                                        <h4 className="pointer">
                                          <TextParser text={item.name} />
                                        </h4>
                                        <MediaQuery minDeviceWidth="1200px">
                                          {item && item.featured ? (
                                            <span className="recommend-badge">
                                              Recommended
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </MediaQuery>
                                      </div>
                                      <div className="badge-rating-wrapper">
                                        <StarRating
                                          rating={item ? item.rating : 0}
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                  {
                                    <p style={{ color: "black" }}>
                                      <TextParser text={item.title} />
                                    </p>
                                  }
                                  <p>
                                    {item.skills &&
                                      item.skills.map((ite, index) => {
                                        return item.skills.length - 1 !== index
                                          ? ite.name + ", "
                                          : ite.name;
                                      })}
                                    <div
                                      style={{
                                        color: "black",
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {item.countryName}{" "}
                                      {item.education
                                        ? " | " + item.education
                                        : ""}{" "}
                                      {item.experience
                                        ? " | Experience " + item.experience
                                        : ""}
                                    </div>
                                  </p>
                                </div>
                              </div>
                              <div className="second">
                                {item.salary &&
                                  item.salary !== "Salary/Month (USD)" && (
                                    <h4>
                                      ${item.salary}
                                      {item.salary === "2000" && "+"}/
                                      {salaryTypes[item.salaryTypeId - 1].name
                                        .toLowerCase()
                                        .replace("ly", "")}
                                    </h4>
                                  )}
                                <p>
                                  {item.availability
                                    ? parseInt(item.availability) !== 0 &&
                                      item.availability
                                    : item.type}
                                </p>
                                {item.lastLoginDate !== null && (
                                  <p>
                                    <Moment fromNow ago>
                                      {this.localdate(
                                        new Date(item.lastLoginDate)
                                      )}
                                    </Moment>{" "}
                                    ago
                                  </p>
                                )}
                              </div>
                            </div>
                          </MediaQuery>,
                        ];
                      })}
                    </>
                  )}
              </div>
              {this.state.allsearchclients !== null && (
                <Pagination
                  forcedPage={parseInt(currentPage) || 1}
                  pageSize={10}
                  countItems={
                    this.state.totalWorkers !== null
                      ? this.state.totalWorkers
                      : []
                  }
                  onChangePage={this.handleChangePage.bind(this)}
                  href={this.props.history.location.pathname + "?page="}
                />
              )}
              <MediaQuery minDeviceWidth="768px">
                <JoinForFreeDesktop />
              </MediaQuery>
              <MediaQuery maxDeviceWidth="767px">
                <JoinForFreeMobile />
              </MediaQuery>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ main, jobs, auth, unreadCount }) => {
  return {
    loggedIn: main.loggedIn,
    userStoreData: main.userStoreData,
    jobs,
    user: auth.user,
    searchword: unreadCount.search,
    isAuthenticated: auth.isAuthenticated,
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
export default withCookies(
  connect(mapStateToProps, {
    mapDispachToProps,
    setUserType,
  })(SearchWork)
);
