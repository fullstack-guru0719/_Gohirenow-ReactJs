import React, { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { apiPath } from "../../../services/config";
import Moment from "react-moment";
import placeholder1 from "../../../assets/img_avatar.svg";
import placeholder2 from "../../../assets/employer_icon.svg";
import { Link, withRouter } from "react-router-dom";
import Spinner from "../../../components/spinner/index";
import { connect } from "react-redux";
import placeholdericon from "../../../assets/icons.png";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import Pagination from "../../../utils/pagination";
import queryString from "query-string";
import MediaQuery from "react-responsive";
import MetaTags from "react-meta-tags";
import { mobileVendor } from "react-device-detect";
import { FacebookProvider, Share } from "react-facebook";
import FbWelcome from "../../../assets/FbWelcome.svg";
import ShareLink from "react-twitter-share-link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TextParser from "../../../utils/TextParser";
import StarRating from "../../../components/starRating";
import { RecruiteDesktop, RecruiteMobile } from "../../../components/Recruite";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

class JobHire extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const currentUrl = queryString.parse(location.search);
    this.state = {
      showMore: [],
      showLess: [],
      jobdetails: {},
      overall: [],
      loading: false,
      salarytype: ["", "Hour", "Week", "Month", "Fixed"],
      showModal: false,
      message: {
        fromUserId: "",
        toUserId: "",
        message: "",
        jobId: "",
        name: "",
      },
      planDetails: null,
      deltloader: [],
      notFound: false,
      startIndex: currentUrl.page ? (parseInt(currentUrl.page) - 1) * 10 : 0,
      endIndex: currentUrl.page ? parseInt(currentUrl.page) * 10 : 10,
      fromClientMail: currentUrl.fromClientMail,
      applicantsCount: 0,
    };
    if (currentUrl.fromClientMail == true) {
      this.scrolltoapp();
    }
  }

  clipboardcpot = () => {
    const {
      location: { pathname },
    } = this.props;
    Swal.fire({
      title: `www.gohirenow.com${pathname} has been copied`,
      // text: ``,,
      type: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then((result) => {});
  };

  componentDidMount() {
    const { history, user: expectedUser, profile } = this.props;
    const currentUrl = queryString.parse(history.location.search);

    const user = expectedUser || localStorage.getItem("user");
    let scollcheck = !!localStorage.getItem("scroll");
    if (!scollcheck) {
      window.scrollTo(0, 0);
    }

    let jobid = this.props.match.params.id;

    if (!user) {
      if (!currentUrl.fromClientMail) {
        history.push(`/job-details-work/${jobid}`);
      } else {
        history.push(
          `/sign-In?backto=job-details-hire/${this.props.match.params.id}?fromClientMail=true`
        );
      }
    }

    if (jobid) {
      this.setState({ loading: true });
      axios
        .get(apiPath + "/client/jobs/detail/" + jobid, config)
        .then((res) => {
          let showmore = [];
          let showless = [];

          this.setState({ applicantsCount: res.data.applicationCount });
          res.data.attachments.map((item) => {
            const file = item.filePath;
            const fileType = file.substr(file.lastIndexOf(".") + 1);
            const validImageTypes = ["gif", "jpg", "png", "jpeg"];

            if (validImageTypes.includes(fileType.toLowerCase())) {
              item.fileExtension = "";
            } else {
              item.fileExtension = fileType.toUpperCase();
            }
          });
          this.setState({
            overall: res.data,
            jobdetails: res.data,
            loading: false,
          });
          res.data.applicants.map((item) => {
            showmore.push("");
            showless.push("display");
          });
          this.setState({
            showMore: showmore,
            showLess: showless,
          });
          let loader = [];
          res.data.applicants.map((item) => {
            loader.push(false);
          });
          this.setState({ deltloader: loader });
          let scoll = localStorage.getItem("scroll");
          if (
            currentUrl.fromClientMail === "true" ||
            currentUrl.fromClientMail === true
          ) {
            this.scrolltoapp();
          } else {
            if (scoll) {
              const tesNode = ReactDOM.findDOMNode(this.refs.test);
              window.scrollTo(0, tesNode.offsetTop);
            } else {
              window.scrollTo(0, 0);
            }
          }
        })
        .catch((err) => {});
      axios.get(apiPath + "/client/subscription").then((res) => {
        this.setState({ planDetails: res.data.subscriptionStatus });
      });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("scroll");
  }

  change = (c, text) => {
    let showmore = this.state.showMore;
    let showLess = this.state.showLess;
    switch (text) {
      case "more":
        showmore[c] = "display";
        showLess[c] = "";
        this.setState({ showLess: showLess, showMore: showmore });
        break;
      case "less":
        showmore[c] = "";
        showLess[c] = "display";
        this.setState({ showLess: showLess, showMore: showmore });
        break;
      default:
        break;
    }
  };

  handleClose = (sh) => {
    this.setState({ showModal: false });
  };

  openMessageModal = (fromUserId, toUserId, name) => {
    const bodysender = {
      entryType: "Contacts",
      messageToUserId: toUserId,
    };
    axios
      .post(apiPath + "/client/GetPricingPlanCapabilityStatus", bodysender)
      .then((res) => {
        if (res.data.result === true) {
          this.setState((prevState) => ({
            message: {
              ...prevState.message,
              toUserId: toUserId,
              fromUserId: fromUserId,
              jobId: prevState.jobdetails.id,
              name: name,
            },
          }));
          this.setState({ showModal: true });
        } else {
          if (
            this.props.trans_subs.subscriptionStatus.planName.toUpperCase() ===
            "FREE"
          ) {
            Swal.fire({
              // title: "",
              html: `<h3 style="margin-bottom:50px;">
						 You need to upgrade your current plan to contact candidates!
						</h3>`,
              type: "warning",
              width: "850px",
              showCancelButton: true,
              confirmButtonColor: "#ED7B18",
              confirmButtonText: "Upgrade Now!",
            }).then((result) => {
              if (result.value) {
                this.props.history.push("/pricing");
              }
            });
          } else {
            Swal.fire({
              // title: "Are you sure you want to delete this candidate?",
              html: `<h2>You have reached the limit of candidates you can contact!</h2>
								<p style="margin-top: 50px;">
								You are at ${res.data.stat} contacts
								</p>`,
              type: "warning",
              width: "950px",
              showCancelButton: true,
              confirmButtonColor: "#ED7B18",
              confirmButtonText: "Upgrade Now!",
            }).then((result) => {
              if (result.value) {
                this.props.history.push("/pricing");
              }
            });
          }
        }
      })
      .catch((err) => {
        console.warn("message error: ", err);
      });
  };

  setMessage = (event) => {
    let msg = event.target.value;
    event.preventDefault();
    this.setState((prevState) => ({
      message: {
        ...prevState.message,
        message: msg,
      },
    }));
  };

  sendMessage = () => {
    axios
      .post(apiPath + "/messages/intial/send", this.state.message, config)
      .then((res) => {
        if (res.data.status === "success") {
          Swal.fire(
            "Sent!",
            `Message has been sent to ${this.state.message.name}`,
            "success"
          );
          this.setState((prevState) => ({
            message: {
              ...prevState.message,
              toUserId: "",
              fromUserId: "",
              jobId: "",
              message: "",
            },
          }));
          this.setState({ showModal: false });
        }
      })
      .catch((err) => {
        alert(err.statusText);
      });
  };

  scrolltoapp() {
    const tesNode = ReactDOM.findDOMNode(this.refs.test);
    console.log("scrolltoapp", tesNode.offsetTop + 190);
    window.scrollTo(0, tesNode.offsetTop + 190);
  }

  localdate(date) {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  }

  gotoprofile(id) {
    let jobid = this.props.match.params.id;
    localStorage.setItem("profileId", id);
    localStorage.setItem("jobId_Message", jobid);
    this.props.history.push(`/work-profile/${id}`);
  }

  handleChangePage = (startIndex, endIndex, currentPage) => {
    this.setState({ startIndex: startIndex, endIndex: endIndex }, () => {
      this.urlUpdate({ page: currentPage });
      const resultsNode = ReactDOM.findDOMNode(this.refs.results);
      window.scroll(0, resultsNode.offsetTop + 135);
    });
  };

  urlUpdate(params) {
    const { page } = params;
    const {
      props: { history },
    } = this;
    const { location } = history;
    const currentUrl = queryString.parse(location.search);
    if (params.hasOwnProperty("page")) {
      page != 1 ? (currentUrl.page = page) : delete currentUrl.page;
    }
    history.push({
      search: "?" + new URLSearchParams(currentUrl),
    });
  }

  deleteapplicant(userId, index) {
    Swal.fire({
      title: "Are you sure you want to delete this candidate?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ED7B18",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        let allowloader = [];
        this.state.deltloader.map((item, newind) => {
          if (newind === index) {
            item = true;
          }
          allowloader.push(item);
        });
        this.setState({ deltloader: allowloader });
        let jobid = this.props.match.params.id;
        axios
          .delete(`${apiPath}/client/jobs/${jobid}/applicant/${userId}/delete`)

          .then((res) => {
            let applicatns = [];
            let loader = [];
            let cnt = this.state.applicantsCount;

            if (cnt > 0) {
              cnt = cnt - 1;
              this.setState({ applicantsCount: cnt });
            }

            this.state.jobdetails.applicants.map((item, inde) => {
              if (userId === item.userId) {
              } else {
                applicatns.push(item);
                loader.push(false);
              }
            });
            let { jobdetails } = this.state;
            let jobdetail = jobdetails;
            jobdetail.applicants = applicatns;
            this.setState({ deltloader: loader, jobdetails: jobdetail });
          })
          .catch((err) => {});
      }
    });
  }

  sortapplicants = (value) => {
    let { overall } = this.state;
    let jobdetail = { ...overall };

    switch (value) {
      case "best-rating":
        jobdetail.applicants.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return b.rating - a.rating;
        });
        this.setState({ jobdetails: jobdetail });
        break;
      case "newest":
        jobdetail.applicants.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.createDate) - new Date(a.createDate);
        });
        this.setState({ jobdetails: jobdetail });
        break;
      case "oldest":
        jobdetail.applicants.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(a.createDate) - new Date(b.createDate);
        });
        this.setState({ jobdetails: jobdetail });
        break;
      case "name":
        jobdetail.applicants.sort(function (a, b) {
          var textA = a.name;
          var textB = b.name;
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        this.setState({ jobdetails: jobdetail });
        break;
      default:
        break;
    }
  };
  download = (path, name) => {
    const link = document.createElement("a");
    link.href = path;
    document.body.appendChild(link);
    link.download();
    document.body.removeChild(link);
  };
  render() {
    let {
      dispatch,
      isAuthenticated,
      user,
      history: { location },
    } = this.props;
    let { jobdetails, loading, startIndex, endIndex } = this.state;
    let descrip =
      jobdetails &&
      jobdetails.description &&
      jobdetails.description.replace(/\u21B5/g, "<br/>");
    let jobid = localStorage.getItem("jobId");
    let applicants =
      jobdetails.applicants && jobdetails.applicants.length > 10
        ? jobdetails.applicants.slice(startIndex, endIndex)
        : jobdetails.applicants;
    let placeholding =
      this.props.profile &&
      this.props.profile.profilePicturePath &&
      this.props.profile.profilePicturePath
        ? this.props.profile.profilePicturePath
        : placeholder2;
    const currentPage = queryString.parse(location.search).page;
    return (
      <div
        className={isAuthenticated ? "registration greybf" : "registration "}
        id="job-details-hire"
      >
        {/*<MetaTags>*/}
        {/*<title>GoHireNow</title>*/}
        {/*</MetaTags>*/}
        <div className="container pt-3 ">
          {loading ? (
            <div className="row" style={{ height: "300px" }}>
              {" "}
              <Spinner />
            </div>
          ) : (
            <>
              <div className="row main-row pd0">
                <div className="job-details-head row w-100">
                  <div style={{ width: "74%" }}>
                    <h4 className="font-weight-bold heading">
                      {jobdetails && <TextParser text={jobdetails.title} />}
                    </h4>
                  </div>
                  <div
                    className="buttons"
                    style={{
                      marginBottom: "10px",
                      paddingRight: "3px",
                      width: "26%",
                    }}
                  >
                    <button
                      className="btn text-uppercase button1 button"
                      style={{ padding: " 7px 29px" }}
                      onClick={() => this.scrolltoapp()}
                    >
                      View applicants
                    </button>
                    <Link to={`/edit-job/${jobid}`}>
                      <button
                        className="btn text-uppercase  button"
                        style={{ padding: " 7px 29px" }}
                      >
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="col-md-8 pl-0 specifics">
                  <div id="job-details">
                    <div className="row">
                      <div className="col-md-6">
                        <h4>JOB DETAILS</h4>
                        <p style={{ height: "100%" }}>
                          <TextParser text={descrip} />
                        </p>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <table width="100%">
                            <tr>
                              <th>TYPE</th>
                              <th>SALARY</th>
                              <th>DATE</th>
                            </tr>
                            <tr>
                              <td>{jobdetails.type}</td>
                              <td>
                                ${jobdetails && jobdetails.salary}/
                                {
                                  this.state.salarytype[
                                    jobdetails.salaryTypeId &&
                                      parseInt(jobdetails.salaryTypeId)
                                  ]
                                }
                              </td>
                              <td>
                                <Moment fromNow ago>
                                  {jobdetails && jobdetails.modifiedDate
                                    ? this.localdate(
                                        new Date(jobdetails.modifiedDate)
                                      )
                                    : this.localdate(
                                        new Date(jobdetails.createDate)
                                      )}
                                </Moment>{" "}
                                ago
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div className="second-div">
                          <h4>REQUIRED SKILLS</h4>
                          <div className="skills-dis">
                            {jobdetails &&
                              jobdetails.skills &&
                              jobdetails.skills.map((item, index) => {
                                return <p key={index}> {item.name}</p>;
                              })}
                          </div>
                        </div>
                        <div className="third-div">
                          {jobdetails &&
                            jobdetails.attachments &&
                            jobdetails.attachments.length > 0 && (
                              <h4>ATTACHMENTS</h4>
                            )}
                          <div className="third-inner-div">
                            {jobdetails &&
                              jobdetails.attachments &&
                              jobdetails.attachments.map((item, index) => {
                                return (
                                  <div className="d-flex flex-column align-items-center">
                                    <div
                                      className="attachments"
                                      style={{
                                        position: "relative",
                                      }}
                                    >
                                      <a
                                        href={`${apiPath}/Home/Download/JobAttachment?id=${item.id}`}
                                        target="_blank"
                                      >
                                        <img
                                          src={
                                            item.fileExtension === ""
                                              ? item.filePath
                                              : placeholdericon
                                          }
                                          alt={item.fileName}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                          }}
                                        />

                                        <p
                                          className="fileextension"
                                          style={{
                                            top: "32px",
                                            left: "10px",
                                          }}
                                        >
                                          {item.fileExtension &&
                                            item.fileExtension.toUpperCase()}
                                        </p>
                                      </a>
                                    </div>
                                    <a
                                      href={`${apiPath}/Home/Download/JobAttachment?id=${item.id}`}
                                      target="_blank"
                                    >
                                      {" "}
                                      <p className="pb-0 black">
                                        {item &&
                                          item.fileName &&
                                          item.fileName.slice(0, 10)}
                                        {item.fileName.length > 10 ? "..." : ""}
                                      </p>
                                    </a>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*limitapp*/}

                  <div className="header" ref="test">
                    <h4>Applicants ({this.state.applicantsCount})</h4>

                    <select
                      onChange={(e) => this.sortapplicants(e.target.value)}
                    >
                      <option>Sort by</option>
                      <option value="best-rating">Best Rating</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  {jobdetails.allowedApplicantions <
                    jobdetails.applicationCount && (
                    <div
                      className="max-app-warning row d-flex align-items-center"
                      style={{
                        background: "#ED7B18",
                        padding: "25px 10px 25px 13px",
                        marginTop: "20px",
                        position: "relative",
                      }}
                    >
                      <div className="col-2">
                        <div className="imgsign">
                          <img
                            src={require("../../../assets/blueox.png")}
                            className="imgsign1"
                            alt=""
                          />
                          <img
                            src={require("../../../assets/sign.png")}
                            className="imgsign2"
                            alt=""
                          />
                        </div>
                      </div>
                      <MediaQuery maxDeviceWidth="767px">
                        <div className="col-7 text-new-desing">
                          <p>
                            You have reached your maximum of{" "}
                            {jobdetails && jobdetails.allowedApplicantions}{" "}
                            applicants.{" "}
                            <b style={{ fontWeight: "900" }}>
                              {jobdetails.applicationCount} candidates
                            </b>{" "}
                            have applied on this job post. Upgrade your current
                            plan to get access to all candidates.
                          </p>
                        </div>
                      </MediaQuery>
                      <MediaQuery minDeviceWidth="768px">
                        <div className="col-7 text-new-desing">
                          <p>
                            You have reached your maximum of{" "}
                            {jobdetails && jobdetails.allowedApplicantions}{" "}
                            applicants.
                          </p>
                          <p>
                            <b style={{ fontWeight: "900" }}>
                              {jobdetails.applicationCount} candidates
                            </b>{" "}
                            have applied on this job post.
                          </p>
                          <p>
                            Upgrade your current plan to get access to all
                            candidates.
                          </p>
                        </div>
                      </MediaQuery>

                      <div className="col-3">
                        <button
                          className="btn detailhire-upg text-uppercase"
                          onClick={() => {
                            this.props.history.push("/pricing");
                          }}
                        >
                          upgrade now
                        </button>
                      </div>

                      <div className={`applicants-alert-corner-wrapper`}>
                        <span className={`welcome-to-ghn-corner`} />
                      </div>
                    </div>
                  )}

                  {applicants ? (
                    <div
                      ref="results"
                      className="row bottom"
                      id="applicants"
                      style={{
                        background:
                          applicants.length !== 0 ? "white" : "#f8f8f8",
                        border:
                          applicants.length !== 0
                            ? "1px solid rgb(225,225,225)"
                            : "none",
                      }}
                    >
                      {applicants.map((item, index) => {
                        return (
                          <div className="col-md-12 p-0">
                            <div className="inner">
                              {item && item.featured ? (
                                <span className="recommend-badge recommend-badge-absolute">
                                  Recommended
                                </span>
                              ) : (
                                ""
                              )}
                              <div className="inner-inner">
                                <div className="first">
                                  <div className="image-div pointer">
                                    <Link
                                      target="_blank"
                                      to={"/work-profile/" + item.userId}
                                    >
                                      <img
                                        src={
                                          item.profilePicturePath
                                            ? item.profilePicturePath
                                            : placeholder1
                                        }
                                      />
                                    </Link>
                                  </div>
                                  <div className="job-details-skills">
                                    <div className="d-flex flex-column mb-1">
                                      <Link
                                        target="_blank"
                                        to={"/work-profile/" + item.userId}
                                      >
                                        <h4>{item.name}</h4>{" "}
                                      </Link>
                                      <StarRating
                                        rating={item ? item.rating : 0}
                                      />
                                    </div>

                                    <h4>{<TextParser text={item.title} />}</h4>

                                    <p>
                                      <span>
                                        {item.userSkills &&
                                          item.userSkills.map((ite, index) => {
                                            return item.userSkills.length -
                                              1 !==
                                              index
                                              ? ite.name + ", "
                                              : ite.name;
                                          })}
                                      </span>
                                      <p>
                                        {item.countryName}{" "}
                                        {item.education
                                          ? " | " + item.education
                                          : ""}{" "}
                                        {item.experience
                                          ? " | Experience " + item.experience
                                          : ""}
                                      </p>
                                    </p>
                                  </div>
                                </div>
                                {/*
																<div className="second right-info">
																	{item.lastLoginDateTime && ([
																		<MediaQuery maxDeviceWidth="767px">
																			<span>
																			<p className="m-0">Last logged:</p>
																			<p style={{ textAlign: 'center', marginTop: '0' }}>
																				<Moment fromNow ago>
																					{this.localdate(
																						new Date(item.lastLoginDateTime)
																					)}
																				</Moment>{" "}
																				ago
																			</p></span>
																			<span>
																				<p className="m-0">Member since:</p>
																				<p style={{ textAlign: 'center', marginTop: '0' }}>
																					<Moment format=" MMM D YYYY">
																						{item.createDate}
																					</Moment>
																				</p>
																			</span>
																			<p className="m-0">{item.countryName}</p>
																		</MediaQuery>,
																		<MediaQuery minDeviceWidth="768px">
																			<h4 style={{ textAlign: 'center' }}>
																				Logged:{" "}
																				<Moment fromNow ago>
																					{this.localdate(
																						new Date(item.lastLoginDateTime)
																					)}
																				</Moment>{" "}
																				ago
																			</h4>
																			<p>
																				Member Since:{" "}
																				<Moment format=" MMM D YYYY">
																					{item.createDate}
																				</Moment>
																			</p>
																			<p>{item.countryName}</p>
																		</MediaQuery>
																	])}
																</div>*/}
                                <div className="button">
                                  <button
                                    className="btn text-uppercase"
                                    onClick={() =>
                                      this.openMessageModal(
                                        jobdetails.userId,
                                        item.userId,
                                        item.name
                                      )
                                    }
                                  >
                                    Message
                                  </button>
                                  <Link
                                    target="_blank"
                                    to={"/work-profile/" + item.userId}
                                  >
                                    <button className="btn text-uppercase">
                                      View
                                    </button>
                                  </Link>
                                  <button
                                    className="btn text-uppercase"
                                    onClick={() =>
                                      this.deleteapplicant(item.userId, index)
                                    }
                                  >
                                    {this.state.deltloader[index] === false ? (
                                      "Delete"
                                    ) : (
                                      <Spinner />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/*
														<div
															className={
																"bottom-bot " + this.state.showMore[index]
															}
															onClick={() => this.change(index, "more")}
														>
															<i className="fa fa-angle-down" />
															<p>Show more</p>
														</div>
*/}
                            <div
                              className={
                                "bottom-down " + this.state.showMore[index]
                              }
                            >
                              <p>
                                <TextParser text={item.coverLetter} />
                              </p>
                            </div>
                            {/*
														<div
															className={
																"bottom-down " + this.state.showLess[index]
															}
														>
															<h4>Hi Sir/Ma'am,</h4>

															<p><TextParser text={item.coverLetter}/></p>

															<div
																className="bottom-bott"
																onClick={() => this.change(index, "less")}
															>
																<i className="fa fa-angle-down" />
																<p>Show less</p>
															</div>
														</div>
														*/}
                          </div>
                        );
                      })}
                      {applicants.length === 0 && (
                        <p className="mb-0">
                          Your applicants will appear here when they apply on
                          your job posting,
                          <br />
                          we will also send you an e-mail notification.
                        </p>
                      )}
                      {jobdetails.applicants &&
                        jobdetails.applicants.length > 10 && (
                          <div className="col-md-12 p-0">
                            <Pagination
                              forcedPage={parseInt(currentPage) || 1}
                              pageSize={10}
                              countItems={jobdetails.applicants.length}
                              initialPage={parseInt(currentPage) || 1}
                              onChangePage={this.handleChangePage.bind(this)}
                            />
                          </div>
                        )}
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <MediaQuery minDeviceWidth="768px">
                    <RecruiteDesktop />
                  </MediaQuery>
                  <MediaQuery maxDeviceWidth="767px">
                    <RecruiteMobile />
                  </MediaQuery>
                </div>
                <div className="col-md-4 pl-0 pr-0 specifics2 maring-neg">
                  <div className="right-side">
                    <div className="img-div">
                      <Link to="/profile-hire">
                        {" "}
                        <img src={placeholding} alt="" />
                      </Link>
                    </div>

                    <Link to={"/profile-hire"}>
                      <h2>
                        {this.props.user &&
                          this.props.user.companyName &&
                          this.props.user.companyName}
                      </h2>
                    </Link>

                    <p>
                      Member Since :{" "}
                      <span>
                        {" "}
                        <Moment format=" MMM D YYYY">
                          {
                            // 	this.localdate(
                            // 	new Date(
                            // 		this.props.profile &&
                            // 			this.props.profile.memberSince &&
                            // 			this.props.profile.memberSince
                            // 	)
                            // )
                            this.props.profile &&
                              this.props.profile.memberSince &&
                              this.props.profile.memberSince
                          }
                        </Moment>
                      </span>
                    </p>
                    <table>
                      <tr>
                        <td>STATUS:</td>
                        <td>{jobdetails && jobdetails.status} </td>
                      </tr>
                      <tr>
                        <td>APPLICANTS:</td>

                        <td>
                          {jobdetails && jobdetails.applicationCount} of{" "}
                          {jobdetails && jobdetails.allowedApplicantions}
                        </td>
                      </tr>
                      {/*<tr>*/}
                      {/*<td>AVERAGE SALARY:</td>*/}
                      {/*<td>$12/hour</td>*/}
                      {/*</tr>*/}
                      {/*<tr>*/}
                      {/*<td>CONTACTS:</td>*/}
                      {/*<td>*/}
                      {/*{" "}*/}
                      {/*{jobdetails &&*/}
                      {/*jobdetails.jobContacts &&*/}
                      {/*jobdetails.jobContacts}{" "}*/}
                      {/*of*/}
                      {/*{jobdetails &&*/}
                      {/*jobdetails.JobContactsMax &&*/}
                      {/*jobdetails.JobContactsMax}*/}
                      {/*</td>*/}
                      {/*</tr>*/}
                      {/*<tr>*/}
                      {/*<td>EXPIRES IN:</td>*/}
                      {/*<td>23:04:23</td>*/}
                      {/*</tr>*/}
                    </table>
                    <div>
                      <Link to="/pricing">
                        <button className="btn text-uppercase">
                          Upgrade Plan
                        </button>
                      </Link>
                    </div>
                    <div style={{ margin: 0 }}>Share this job</div>
                    <div
                      className="d-flex  "
                      style={{
                        justifyContent: "space-evenly",
                        width: "70%",
                        margin: "10px",
                      }}
                    >
                      <FacebookProvider appId="2305648766322451">
                        <Share href={`www.gohirenow.com${location.pathname}`}>
                          {({ handleClick, loading }) => (
                            <div className="footer-icon1 medium-fa pointer">
                              <i
                                className="fa fa-facebook medium-fa-inner fa-xs"
                                onClick={handleClick}
                                src={FbWelcome}
                              />
                            </div>
                          )}
                        </Share>
                      </FacebookProvider>
                      <div className="footer-icon1 medium-fa pointer">
                        <ShareLink
                          link={`https://www.gohirenow.com${location.pathname}`}
                        >
                          {(link) => (
                            <a
                              className={"unstyled-link"}
                              href={link}
                              target="_blank"
                            >
                              <i className="fa fa-twitter medium-fa-inner" />
                            </a>
                          )}
                        </ShareLink>
                      </div>
                      <CopyToClipboard
                        text={`www.gohirenow.com${location.pathname}`}
                        onCopy={() => this.clipboardcpot()}
                      >
                        <div className="medium-fa footer-icon1 pointer">
                          <p style={{ color: "white" }}>www</p>
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <Modal
          show={this.state.showModal}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Message to {this.state.message.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              name="message"
              className="form-control"
              rows="10"
              onChange={this.setMessage}
              placeholder="Type your message..."
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="button">
              <button className="btn-orange" onClick={this.sendMessage}>
                Send Message
              </button>
              <span className="margin-lr-2"></span>
              <button className="btn-white" onClick={this.handleClose}>
                Close
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, account, billing }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    profile: account.profile,
    trans_subs: billing && billing.subscripiotnandtrans,
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
export default connect(mapStateToProps, mapDispachToProps)(withRouter(JobHire));
