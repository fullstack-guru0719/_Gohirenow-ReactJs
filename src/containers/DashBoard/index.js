import React, { Fragment, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import Spinner from "../../components/spinner/index";
import { getActiveJobs } from "../jobs/actions";
import { getFavoriteWorkers } from "../favorites/actions";
import { getProfileInfo, getProgress } from "../accountSetting/actions";
import {
  getTransactionDetails,
  getSubscriptionDetails,
} from "../billing/actions";
import DropDown from "./dropdown/index";
import workerplace from "../../assets/img_avatar.svg";
import employer from "../../assets/employer_icon.svg";
import MetaTags from "react-meta-tags";
import freelancerpic from "../../assets/img_avatar.svg";
import axios from "axios";
import { apiPath } from "../../services/config";
import MediaQuery from "react-responsive";
import { mobileVendor } from "react-device-detect";
import TextParser from "../../utils/TextParser";
import StarRating from "../../components/starRating";
import UpgradeNow from "../../components/UpgradeNow";
import PostProjectBanner from "../../components/PostProjectBanner";
import { RecruiteDesktop, RecruiteMobile } from "../../components/Recruite";
import UpgradeSmall from "../../components/UpgradeSmall";

const DashBoard = (props) => {
  const {
    history,
    jobs,
    favorites,
    user,
    account,
    trans_details,
    getActiveJobs,
    getFavoriteWorkers,
    getProfileInfo,
    getTransactionDetails,
    getSubscriptionDetails,
    getProgress,
    isAuthenticated,
    profile,
    trans_subs,
  } = props;
  const [dropdown, setDropdown] = useState({
    dropopen: false,
    values: "Active",
  });

  const [relatedworker, setRelated] = useState([]);
  const [active, setactive] = useState("Active");
  const [favloader, setfLoader] = useState(true);

  const [fav_worker, setFavworkers] = useState([]);

  const [progress, setprogress] = useState([]);

  useEffect(() => {
    window.scroll(0, 0);
    getActiveJobs(2, true);
    getFavoriteWorkers(user.userId);
    getProfileInfo(user.userId);
    getProgress(user.userId);
    getSubscriptionDetails();
    getTransactionDetails(user.email);

    axios.get(`${apiPath}/client/dashboard`).then((res) => {
      setRelated(res.data.relatedWorkers);
      setFavworkers(res.data.favoriteWorkers);
      setfLoader(false);
    });
    axios.get(`${apiPath}/account/complete-profile`).then((res) => {
      setprogress(res.data.progress);
    });
  }, [
    getActiveJobs,
    getFavoriteWorkers,
    getProfileInfo,
    getProgress,
    getSubscriptionDetails,
    getTransactionDetails,
  ]);

  let style = {
    width: progress && progress + "%",
  };

  const getActivebyStatus = (value) => {
    value === 2 ? setactive("Active") : setactive("Inactive");
    let isactive = value === 2 ? true : false;
    getActiveJobs(value, isactive);
  };

  const gotohriewith = (value, red) => {
    if (red === "editjob") {
      localStorage.setItem("jobId", value);
      history.push(`/edit-job/${value}`);
    } else if (red === "viewjob") {
      localStorage.setItem("jobId", value);
      history.push(`/job-details-hire/${value}`);
    } else if (red === "applicant") {
      localStorage.setItem("scroll", true);
      history.push(`/job-details-hire/${value}`);
    }
  };

  const gotoprofile = (id) => {
    localStorage.setItem("profileId", id);
    history.push(`/work-profile/${id}`);
  };

  const localdate = (date) => {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  };

  const renderActiveJobPosts = () => {
    const { loading, active_posts } = jobs;
    return !loading ? (
      active_posts && active_posts.length > 0 ? (
        active_posts.map((item, index) => {
          return [
            <MediaQuery maxDeviceWidth="767px">
              <div key={index} className="active-job-posts-mobile-container">
                <div className="a-j-p-avatitle">
                  <div
                    onClick={() => {
                      history.push("/profile-hire");
                    }}
                    className="a-j-p-ava-container"
                  >
                    <img
                      src={
                        profile && profile.profilePicturePath
                          ? profile.profilePicturePath
                          : employer
                      }
                      alt=""
                    />
                  </div>

                  <div
                    onClick={() => {
                      gotohriewith(item.id, "viewjob");
                    }}
                    className="a-j-p-title"
                  >
                    <TextParser text={item.title} />
                  </div>
                </div>
                <div className="a-j-p-details">
                  <div className="a-j-p-details-row">
                    <span className="a-j-p-details-row-header">STATUS</span>
                    <span>
                      {item.status !== "NotApproved"
                        ? item.status
                        : "Waiting Approval"}
                    </span>
                  </div>
                  <div className="a-j-p-details-row">
                    <span className="a-j-p-details-row-header">APPLICANTS</span>
                    <span
                      onClick={() => {
                        gotohriewith(item.id, "applicant");
                      }}
                      className="pointer"
                    >
                      {item.applicationCount} of {item.allowedApplicantions}
                    </span>
                  </div>
                  <div className="a-j-p-details-row">
                    <span className="a-j-p-details-row-header">DATE</span>
                    <span>
                      <Moment fromNow ago>
                        {localdate(new Date(item.createDate))}
                      </Moment>
                      &nbsp;ago
                    </span>
                  </div>
                </div>
                <div className="a-j-p-controls">
                  <div
                    onClick={() => {
                      gotohriewith(item.id, "editjob");
                    }}
                    className="pointer"
                  >
                    <i className="fa fa-pencil" />
                  </div>
                  <div
                    onClick={() => {
                      gotohriewith(item.id, "viewjob");
                    }}
                    className="pointer"
                  >
                    <i className="fa fa-eye" />
                  </div>
                </div>
              </div>
            </MediaQuery>,
            <MediaQuery minDeviceWidth="768px">
              <tr key={index}>
                <td>
                  <span
                    onClick={() => {
                      gotohriewith(item.id, "viewjob");
                    }}
                    className="pointer"
                  >
                    <TextParser text={item.title} />
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    onClick={() => {
                      gotohriewith(item.id, "applicant");
                    }}
                    className="pointer"
                  >
                    <b>
                      {item.applicationCount} of {item.allowedApplicantions}
                    </b>
                  </span>
                </td>
                <td>
                  {item.status !== "NotApproved"
                    ? item.status
                    : "Waiting Approval"}{" "}
                </td>
                <td>
                  <Moment fromNow ago>
                    {localdate(new Date(item.createDate))}
                  </Moment>
                  &nbsp;ago
                </td>
                <td>
                  <div className="Edit-mode">
                    <i
                      onClick={() => {
                        gotohriewith(item.id, "editjob");
                      }}
                      className={
                        active === "Inactive"
                          ? "fa fa-pencil"
                          : "fa fa-pencil visibility"
                      }
                    />
                    <i
                      onClick={() => {
                        // active==="Active" ?
                        gotohriewith(item.id, "viewjob");
                      }}
                      className={
                        active === "Active" ? "fa fa-eye " : "fa fa-eye"
                      }
                    />
                  </div>
                </td>
              </tr>
            </MediaQuery>,
          ];
        })
      ) : (
        [
          <MediaQuery maxDeviceWidth="767px">
            <div className={"empty-dashboard-table selector-under"}>
              {active === "Active"
                ? "You don't have any active jobs"
                : "You don't have any inactive jobs"}
            </div>
          </MediaQuery>,
          <MediaQuery minDeviceWidth="768px">
            <tr>
              <td className={"empty-dashboard-table"} colSpan="5">
                {active === "Active"
                  ? "You don't have any active jobs"
                  : "You don't have any inactive jobs"}
              </td>
            </tr>
          </MediaQuery>,
        ]
      )
    ) : (
      <Spinner />
    );
  };

  const renderFavWorker = () => {
    return !favloader ? (
      fav_worker && fav_worker.length > 0 ? (
        fav_worker.map((item, index) => {
          return [
            <MediaQuery maxDeviceWidth="767px">
              <tr key={index}>
                <td className="p-0" colSpan={5}>
                  <div
                    className={`client-favorites-container dashboard-favorites`}
                  >
                    <div className={`first-child`}>
                      <div
                        className="img-div pointer"
                        onClick={() => gotoprofile(item.userId)}
                      >
                        <img
                          src={
                            item.profilePicturePath
                              ? item.profilePicturePath
                              : workerplace
                          }
                          alt=""
                        />
                      </div>
                      <div className={`right`}>
                        <div className={`title`}>
                          <span
                            onClick={() => {
                              localStorage.setItem("profileId", item.userId);
                              history.push(`/work-profile/${item.userId}`);
                            }}
                            className="pointer"
                          >
                            {item.name}
                          </span>
                          <span>
                            <TextParser text={item.title} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`skills`}>
                      <p>
                        {item.skills &&
                          item.skills.map((ite, index) => {
                            return item.skills.length - 1 !== index
                              ? ite.name + ", "
                              : ite.name;
                          })}
                      </p>
                    </div>
                    <div className={`icons`}>
                      <div
                        onClick={() => {
                          localStorage.setItem("profileId", item.userId);
                          history.push("/favorites");
                        }}
                        className="pointer"
                      >
                        <i className="fa fa-pencil" />
                      </div>
                      <div
                        onClick={() => {
                          localStorage.setItem("profileId", item.userId);
                          history.push(`/work-profile/${item.userId}`);
                        }}
                        className="pointer"
                      >
                        <i className="fa fa-eye" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </MediaQuery>,
            <MediaQuery key={index} minDeviceWidth="768px">
              <tr key={index}>
                <td className="desktop-favs" style={{ minWidth: "200px" }}>
                  <span
                    onClick={() => {
                      history.push(`/work-profile/${item.userId}`);
                    }}
                    className="img-div pointer"
                  >
                    <img
                      src={
                        profile && item.profilePicturePath
                          ? item.profilePicturePath
                          : workerplace
                      }
                      alt=""
                    />
                  </span>
                  <span
                    style={{ paddingLeft: "15px" }}
                    onClick={() => {
                      localStorage.setItem("profileId", item.userId);
                      history.push(`/work-profile/${item.userId}`);
                    }}
                    className="pointer"
                  >
                    {item.name}
                  </span>
                </td>
                <td style={{ minWidth: "150px", color: "#ed7b18" }}>
                  {item.skills &&
                    item.skills.map((ite, inde) => {
                      return item.skills.length - 1 !== inde
                        ? ite.name + ", "
                        : ite.name;
                    })}
                </td>
                <td></td>
                <td
                  style={{
                    minWidth: "100px",
                    textAlign: "center",
                    paddingLeft: "0px",
                  }}
                >
                  <TextParser text={item.title} />
                </td>
                <td />
                <td>
                  <div className="Edit-mode">
                    <i
                      className="fa fa-pencil"
                      onClick={() => {
                        history.push("/favorites");
                      }}
                    />
                    <i
                      className="fa fa-eye pointer"
                      onClick={() => {
                        localStorage.setItem("profileId", item.userId);
                        history.push(`/work-profile/${item.userId}`);
                      }}
                    />
                  </div>
                </td>
              </tr>
            </MediaQuery>,
          ];
        })
      ) : (
        [
          <MediaQuery maxDeviceWidth="767px">
            <div className={"empty-dashboard-table selector-under"}>
              You don't have any favorites
            </div>
          </MediaQuery>,
          <MediaQuery minDeviceWidth="768px">
            <tr>
              <td className={"empty-dashboard-table"} colSpan="6">
                You don't have any favorites
              </td>
            </tr>
          </MediaQuery>,
        ]
      )
    ) : (
      <Spinner />
    );
  };

  const isNeededUpgrade = () => {
    if (active === "Active" && jobs.active_posts && jobs.active_posts.length) {
      if (!trans_subs || !trans_subs.subscriptionStatus) return true;
      if (
        trans_subs &&
        trans_subs.subscriptionStatus &&
        trans_subs.subscriptionStatus.planName === "Free"
      )
        return true;
    }
    return false;
  };
  const isNeededPostBanner = () => {
    if (
      active === "Active" &&
      (!jobs.active_posts || !jobs.active_posts.length)
    ) {
      return true;
    }
    return false;
  };
  const isNeededUpgradeSmall = () => {
    if (
      isAuthenticated &&
      user.userTypeId === 1 &&
      !(
        trans_subs &&
        trans_subs.subscriptionStatus &&
        trans_subs.subscriptionStatus.planName !== "Free"
      )
    )
      return true;
  };

  if (isAuthenticated) {
    if (user.userTypeId === 2) return <Redirect to="/dashboard-work" />;
  }

  let loaderfull = !jobs.loading && !favloader;
  return (
    <Fragment>
      <div className="registration dashboard" id="billing">
        <MetaTags>
          <title>GoHireNow - Hire Top‑Quality Virtual Assistants</title>
          <meta name="description" content="" />
        </MetaTags>
        {!loaderfull ? (
          <Spinner />
        ) : (
          <div className="container  ">
            <div className="row ">
              <MediaQuery minDeviceWidth="768px">
                {isNeededUpgrade() ? <UpgradeNow /> : ""}
              </MediaQuery>
              <MediaQuery minDeviceWidth="768px">
                {isNeededPostBanner() ? <PostProjectBanner /> : ""}
              </MediaQuery>
              <div className="col-sm-12 pl-0 dashboard-title">
                <h2>Dashboard</h2>
              </div>
              {/*<MediaQuery minDeviceWidth="1024px">*/}
              {/*<div className={`welcome-to-ghn`}>*/}
              {/*<div className={`welcome-to-ghn-left`}>*/}
              {/*<div className={`welcome-to-ghn-text`}>*/}
              {/*<div className='welcome-to-ghn-text-title'>Welcome on GoHireNow!</div>*/}
              {/*<div>GoHireNow Will be a huge platform for you to connect directly with companies and get a great job working from home. Since we just launched couple of days ago, we are currently advertising to you future candidates.</div>*/}
              {/*<div>We should be starting advertisement in Canada, United States, United Kingdom and Australia in the next weeks! This platform will be free for candidates forever!</div>*/}
              {/*<div>You can help us by sharing our website with your friends and family! Make sure to complete your profile, we will send you an e-mail on the first job post so when you get a chance to apply first!</div>*/}
              {/*<div>Thank you.</div>*/}
              {/*</div>*/}
              {/*<div className={`welcome-to-ghn-line`}/>*/}
              {/*<div className={`welcome-to-ghn-buttons`}>*/}
              {/*<div className={`welcome-to-ghn-buttons-title`}>SHARE</div>*/}
              {/*<img className={`welcome-to-ghn-buttons-img`} src={FbWelcome}/>*/}
              {/*<img className={`welcome-to-ghn-buttons-img`} src={TwitterWelcome}/>*/}
              {/*<a className={`welcome-to-ghn-buttons-img`} href={'http://www.gohirenow.com'}>*/}
              {/*<div className={`www-text`}>www</div>*/}
              {/*<img className={`welcome-to-ghn-buttons-img`} src={WwwWelcome}/>*/}
              {/*</a>*/}
              {/*</div>*/}
              {/*</div>*/}
              {/*<div className={`welcome-to-ghn-corner-wrapper`}>*/}
              {/*<span className={`welcome-to-ghn-corner`} />*/}
              {/*</div>*/}
              {/*</div>*/}
              {/*</MediaQuery>*/}
            </div>
            <div className="row main-row  client-dasher" id="client-dash">
              <div className="col-lg-8 pl-0 pr-0">
                <div className="row">
                  <div className="col-md-12 pl-0 pr-0">
                    <MediaQuery maxDeviceWidth="767px">
                      <div className="row">
                        <div className="col-sm-12 d-flex justify-content-end pr-0">
                          <Link to="/post-job">
                            <button className="post-a-job-mobile specific-btn btn">
                              {" "}
                              Post a job
                            </button>
                          </Link>
                        </div>
                      </div>
                    </MediaQuery>
                    <div className="select-div marginb1r">
                      <p className="font-weight-bold">{active} Job Posts</p>
                      <DropDown
                        statusactive={getActivebyStatus}
                        activestatus={active}
                      />
                    </div>
                    <MediaQuery maxDeviceWidth="767px">
                      {renderActiveJobPosts()}
                    </MediaQuery>
                    <MediaQuery minDeviceWidth="768px">
                      <div className="second-table">
                        <table
                          key={20302347237482384728374293874293874}
                          className={"table-respons-active-jobs"}
                        >
                          <thead>
                            <tr>
                              <th
                                className="job-title-th"
                                style={{
                                  minWidth: "250px",
                                  maxWidth: "250px",
                                  width: "250px",
                                }}
                              >
                                JOB TITLE
                              </th>
                              <th
                                style={{
                                  minWidth: "100px",
                                  maxWidth: "100px",
                                  width: "100px",
                                }}
                              >
                                APPLICANTS
                              </th>
                              <th
                                style={{
                                  minWidth: "130px",
                                  maxWidth: "130px",
                                  width: "130px",
                                  textAlign: "center",
                                  paddingLeft: "0px",
                                }}
                              >
                                STATUS
                              </th>
                              <th
                                style={{
                                  minWidth: "120px",
                                  maxWidth: "120px",
                                  width: "120px",
                                  textAlign: "center",
                                  paddingLeft: "0px",
                                }}
                              >
                                DATE
                              </th>
                              <th />
                            </tr>
                          </thead>
                          <tbody
                            key={2937492752952985787298745289572897294875298475}
                          >
                            {renderActiveJobPosts()}
                          </tbody>
                        </table>
                      </div>
                    </MediaQuery>
                  </div>
                </div>
                <MediaQuery maxDeviceWidth="767px">
                  {isNeededUpgrade() ? <UpgradeNow /> : ""}
                </MediaQuery>
                <MediaQuery maxDeviceWidth="767px">
                  {isNeededPostBanner() ? <PostProjectBanner /> : ""}
                </MediaQuery>
                <div className="row padd pl-0" id="favoritesworker">
                  <div className="col-md-12 pl-0">
                    <p className="font-weight-bold">Favorites</p>
                    <div className="second-table" id="second-table">
                      <MediaQuery maxDeviceWidth="767px">
                        {renderFavWorker()}
                      </MediaQuery>
                      <MediaQuery minDeviceWidth="768px">
                        <table>
                          <thead>
                            <tr>
                              <th
                                style={{
                                  minWidth: "225px",
                                  maxWidth: "225px",
                                  width: "225px",
                                }}
                              >
                                NAME
                              </th>
                              <th
                                style={{
                                  minWidth: "100px",
                                  maxWidth: "100px",
                                  width: "100px",
                                  textAlign: "center",
                                }}
                              >
                                SKILLS
                              </th>
                              <th
                                style={{
                                  minWidth: "110px",
                                  maxWidth: "110px",
                                  width: "110px",
                                  textAlign: "center",
                                  paddingLeft: "0px",
                                }}
                              ></th>
                              <th
                                style={{
                                  minWidth: "100px",
                                  maxWidth: "100px",
                                  width: "100px",
                                  textAlign: "center",
                                  paddingLeft: "0px",
                                }}
                              >
                                INFO
                              </th>
                              <th></th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>{renderFavWorker()}</tbody>
                        </table>
                      </MediaQuery>
                    </div>
                  </div>
                </div>
                <div className="row padd pl-0" id="dirtfavourties">
                  <div className="col-md-12 pl-0">
                    <p className="font-weight-bold">
                      Featured Virtual Assistants
                    </p>
                  </div>
                  {relatedworker.length > 0 &&
                    relatedworker.map((item, index) => {
                      return (
                        <div key={index} className="right">
                          {item && item.featured ? (
                            <span className="recommend-badge recommend-badge-absolute">
                              Recommended
                            </span>
                          ) : (
                            ""
                          )}
                          <div className="right-top mt-3">
                            <div
                              className="img-div pointer"
                              onClick={() => gotoprofile(item.userId)}
                            >
                              <img
                                src={
                                  item.profilePicturePath
                                    ? item.profilePicturePath
                                    : freelancerpic
                                }
                                alt=""
                              />
                            </div>
                            <div className="content">
                              <div className="d-flex flex-column align-items-start">
                                <h4
                                  className="pointer mr-1"
                                  onClick={() => gotoprofile(item.userId)}
                                >
                                  {item.name}
                                </h4>
                                <StarRating rating={item ? item.rating : 0} />
                              </div>
                              <p className="pointer">
                                <TextParser text={item.title} />
                              </p>
                              <p>
                                {item.skills &&
                                  item.skills.map((ite, index) => {
                                    return item.skills.length - 1 !== index
                                      ? ite.name + ", "
                                      : ite.name;
                                  })}
                              </p>
                            </div>
                          </div>
                          <div className="right-bottom">
                            <p>
                              {item.salary &&
                              item.salary !== "Salary/Month (USD)"
                                ? parseInt(item.salary) === 2000
                                  ? "$" + item.salary + "+/Month"
                                  : "$" + item.salary + "/Month"
                                : ""}
                              {!item.lastLoginDate ? (
                                ""
                              ) : (
                                <span>
                                  Last logged:{" "}
                                  <Moment fromNow ago>
                                    {localdate(
                                      new Date(
                                        item.lastLoginDate && item.lastLoginDate
                                      )
                                    )}
                                  </Moment>{" "}
                                  ago
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  {relatedworker.length === 0 && (
                    <div className="right">There are no related workers</div>
                  )}
                </div>
              </div>
              <MediaQuery maxDeviceWidth="459px">
                <RecruiteMobile />
              </MediaQuery>
              <MediaQuery minDeviceWidth="460px" maxDeviceWidth="991px">
                <RecruiteDesktop />
              </MediaQuery>
              <div
                className="col-lg-4 work-dash dash-margin  pr-0 mt-3 mt-lg-0"
                style={{ marginTop: "0px" }}
              >
                <MediaQuery minDeviceWidth="768px">
                  <div className="row mb-1">
                    <div className="col-sm-12 d-flex justify-content-end pr-0">
                      <Link to="/post-job">
                        <button className="specific-btn btn">
                          {" "}
                          Post a job
                        </button>
                      </Link>
                    </div>
                  </div>
                </MediaQuery>
                <div className="sub-box-1">
                  <div className="first-div">
                    <p>
                      Hi! &nbsp;
                      <span className="text-capitalize">
                        {profile && profile.companyName
                          ? profile.companyName
                          : ""}
                      </span>
                    </p>
                    <div className={"text-center"}>
                      {trans_subs && trans_subs.subscriptionStatus && (
                        <p className="text-uppercase text-center">
                          {trans_subs.subscriptionStatus.planName}
                        </p>
                      )}
                      {/*{*/}
                      {/*trans_details && trans_details.length === 0 &&*/}
                      {/*<p className="text-uppercase text-center">Starter</p>*/}
                      {/*}*/}
                      <p>
                        {trans_subs && trans_subs.subscriptionStatus && (
                          <span>
                            <Link to="/pricing">(upgrade)</Link>
                          </span>
                        )}
                        {/*{*/}
                        {/*trans_details && trans_details.length === 0 &&*/}
                        {/*<span>*/}
                        {/*<Link to="/pricing"> (upgrade)</Link>*/}
                        {/*</span>*/}
                        {/*}*/}
                      </p>
                    </div>
                  </div>
                  <div className="second-div">
                    <div className="first-inner-div">
                      <Link to="/complete-profile">
                        {" "}
                        <p>Complete Profile</p>
                      </Link>
                      <p>{progress}%</p>
                    </div>
                    <div className="second-inner-div">
                      <div className="bar" style={style} />
                    </div>
                    {parseInt(progress) < 100 && (
                      <div
                        className="complete-btn"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingTop: "8%",
                        }}
                      >
                        <button
                          className="btn"
                          onClick={() => {
                            history.push("/complete-profile");
                          }}
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* <p className="related font-weight-bold">Related Workers</p> */}
                {/*countryId: 194*/}
                {/*countryName: "Pakistan"*/}
                {/*lastLoginDate: "2019-09-26T20:45:51.6876453"*/}
                {/*name: "Usman Khan"*/}
                {/*salary: "200"*/}
                {/*salaryTypeId: 1*/}
                {/*skills: [{id: 1475, name: "4D"}, {id: 1477, name: "ADO.NET"}]*/}
                {/*title: "Usman Ali Updated"*/}
                {/*userId: "198daad2-a4ad-46db-84e6-4ca593e2cd7d"*/}

                <MediaQuery minDeviceWidth="992px">
                  <RecruiteMobile />
                </MediaQuery>
                {isNeededUpgradeSmall() && <UpgradeSmall />}

                {/*<div className="sub-box-2">*/}
                {/*<p className="font-weight-bold text-uppercase" >your skill</p>*/}
                {/*<p>C#</p>*/}
                {/*<p>Html</p>*/}
                {/*<p>Java</p>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ jobs, auth, favorites, account, billing }) => ({
  user: auth.user,
  profile: account.profile,
  jobs,
  favorites,
  account,
  trans_details: billing && billing.transaction_detail,
  trans_subs: billing && billing.subscripiotnandtrans,
  isAuthenticated: auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getActiveJobs,
  getFavoriteWorkers,
  getProfileInfo,
  getSubscriptionDetails,
  getTransactionDetails,
  getProgress,
})(DashBoard);
