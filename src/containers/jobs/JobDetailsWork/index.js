import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import clientplacehold from "../../../assets/employer_icon.svg";
import Moment from "react-moment";
import Spinner from "../../../components/spinner/index";
import JobDetails from "../../../components/jobDetails";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiPath } from "../../../services/config";
import MediaQuery from "react-responsive";
import employer from "../../../assets/employer_icon.svg";
import MetaTags from "react-meta-tags";
import { mobileVendor } from "react-device-detect";
import DeletePage from "../../DeletedComponent";
import { FacebookProvider, Share } from "react-facebook";
import FbWelcome from "../../../assets/FbWelcome.svg";
import ShareLink from "react-twitter-share-link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TextParser from "../../../utils/TextParser";
import { ShortSalaryTypeById } from "../../../utils/constants/SalaryTypes";

const config = {
  headers: { "Content-Type": "application/json" },
};

const Client = ({
  jobdetails,
  disabled,
  localdate,
  addfav,
  openMessageModal,
  gotoprofile,
  isAuthenticated,
  history: { location },
}) => {
  const clipboardcpot = () => {
    const { pathname } = location;
    Swal.fire({
      title: `www.gohirenow.com${pathname} has been copied`,
      // text: ``,,
      type: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then((result) => {});
  };
  return (
    <div className="col-md-4 specifics2 maring-neg pr-0 pl-0">
      {/*<MetaTags>*/}
      {/*<title>GoHireNow</title>*/}
      {/*<meta name="description" content="" />*/}
      {/*</MetaTags>*/}
      <div className="right-side">
        <Link
          to={`/client-profile/${
            jobdetails && jobdetails.client && jobdetails.client.id
          }`}
        >
          <div className="img-div">
            <img
              src={
                jobdetails &&
                jobdetails.client &&
                jobdetails.client.profilePicturePath
                  ? jobdetails.client.profilePicturePath
                  : clientplacehold
              }
              alt=""
              className="pointer"
              onClick={() =>
                gotoprofile(
                  jobdetails && jobdetails.client && jobdetails.client.id
                )
              }
            />
          </div>
        </Link>

        <Link
          to={`/client-profile/${
            jobdetails && jobdetails.client && jobdetails.client.id
          }`}
        >
          <h2
            onClick={() =>
              gotoprofile(
                jobdetails && jobdetails.client && jobdetails.client.id
              )
            }
            className="pointer"
          >
            {jobdetails &&
              jobdetails.client &&
              jobdetails.client.companyName &&
              jobdetails.client.companyName}
          </h2>
        </Link>
        <p>
          Member Since:{" "}
          <span>
            {jobdetails &&
              jobdetails.client &&
              jobdetails.client.memberSince !== null && (
                <Moment format=" MMM D YYYY">
                  {jobdetails.client.memberSince}
                </Moment>
              )}
          </span>
        </p>
        <p>
          Last logged:{"  "}
          {jobdetails && jobdetails.client && jobdetails.client.lastLoginDate && (
            <Moment fromNow ago>
              {jobdetails &&
                jobdetails.client &&
                jobdetails.client.lastLoginDate &&
                localdate(new Date(jobdetails.client.lastLoginDate))}
            </Moment>
          )}
          {jobdetails && jobdetails.client && jobdetails.client.lastLoginDate
            ? " ago"
            : ""}
        </p>
        <div className="work-button">
          <Link
            to={`/client-profile/${
              jobdetails && jobdetails.client && jobdetails.client.id
            }`}
          >
            <button
              onClick={() =>
                gotoprofile(
                  jobdetails && jobdetails.client && jobdetails.client.id
                )
              }
              className="btn text-uppercase client-profile-button"
            >
              View profile
            </button>
          </Link>
          {jobdetails &&
          jobdetails.client &&
          jobdetails.client.enableMessage ? (
            <button
              className="btn text-uppercase"
              onClick={() =>
                openMessageModal(
                  jobdetails.userId,
                  jobdetails.client.id,
                  jobdetails.client.companyName,
                  jobdetails.client.mailId
                )
              }
            >
              Message
            </button>
          ) : (
            <div></div>
          )}
          <button
            className="btn text-uppercase button1 button"
            onClick={() => addfav()}
            disabled={disabled === false}
          >
            {disabled === true ? "Add to favorites" : "Added to favorites"}
          </button>
          <div className="work-share-wrapper">
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
                    <a className={"unstyled-link"} href={link} target="_blank">
                      <i className="fa fa-twitter medium-fa-inner" />
                    </a>
                  )}
                </ShareLink>
              </div>
              <CopyToClipboard
                text={`www.gohirenow.com${location.pathname}`}
                onCopy={() => clipboardcpot()}
              >
                <div className="medium-fa footer-icon1 pointer">
                  <p style={{ color: "white" }}>www</p>
                </div>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

class JobHire extends Component {
  state = {
    showMore: "",
    showLess: "display",
    jobdetails: null,
    loading: false,
    favid: true,
    applied: false,
    sendingMessage: false,
    message: {
      fromUserId: "",
      toUserId: "",
      message: "",
      jobId: "",
      name: "",
      mailId: "",
    },
    showModal: false,
    applymodal: false,
    notFound: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const {
      props: {
        history: { location },
      },
    } = this;
    let jobid = this.props.match.params.id;

    if (jobid) {
      this.setState({ loading: true });
      localStorage.setItem("jobId", jobid);
      axios
        .get(apiPath + "/worker/jobs/detail/" + jobid, config)
        .then((res) => {
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
          this.setState({ jobdetails: res.data, loading: false });
        })
        .catch((err) => {
          this.setState({ loading: false, notFound: true });
          console.log("console", err.response);
        });
      axios
        .get(apiPath + "/favorites/worker/jobs")
        .then((res) => {
          res.data.map((item) => {
            if (parseInt(item.id) === parseInt(jobid)) {
              this.setState({ favid: false });
            }
          });
        })
        .catch((err) => {});
      axios.get(`${apiPath}/worker/jobs/applied`, config).then((res) => {
        res.data.map((item) => {
          if (parseInt(item.id) === parseInt(jobid)) {
            this.setState({ applied: true });
          }
        });
      });
    }
    // }
  }

  addfav = () => {
    let { profile, history } = this.props;
    if (profile) {
      let jobid = localStorage.getItem("jobId");
      axios
        .post(apiPath + "/favorites/worker/add/" + jobid)
        .then((res) => {
          this.setState({ favid: false });
        })
        .catch((err) => {});
    } else {
      history.push(`/register/?account=worker`);
    }
  };

  change = (c) => {
    switch (c) {
      case 1:
        this.setState({ showLess: "", showMore: "display" });
        break;
      case 2:
        this.setState({ showLess: "display", showMore: "" });
        break;
      default:
        break;
    }
  };

  localdate = (date) => {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  };

  openMessageModal = (fromUserId, toUserId, name, mailId) => {
    this.setState((prevState) => ({
      message: {
        ...prevState.message,
        toUserId: toUserId,
        fromUserId: fromUserId,
        jobId: prevState.jobdetails.id,
        name: name,
        mailId: mailId,
      },
    }));
    this.setState({ showModal: true });
  };

  handleClose = (sh) => {
    this.setState({ showModal: false });
  };

  handleCloseapply = () => {
    this.setState({ applymodal: false });
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
    let jobid = this.props.match.params.id;
    var model = {
      fromUserId: this.state.message.fromUserId,
      toUserId: this.state.message.toUserId,
      mailId: this.state.message.mailId,
      message: this.state.message.message,
      JobId: jobid,
    };
    this.setState({ sendingMessage: true });
    axios
      .post(apiPath + "/messages/sendmessageByJob", model, config)
      .then((res) => {
        this.setState({ sendingMessage: false });
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

  gotoprofile = (id) => {
    let jobid = this.props.match.params.id;
    localStorage.setItem("profileId", id);
    localStorage.setItem("jobId_Message", jobid);
  };

  apply = () => {
    let { profile, history } = this.props;
    if (
      profile &&
      profile.title !== null &&
      profile.title !== "" &&
      profile.profilePicturePath &&
      profile.skills.length > 0
    ) {
      localStorage.setItem("jobId", this.props.match.params.id);
      this.props.history.push("/job-application");
    } else {
      if (profile) {
        Swal.fire({
          title: "You need to complete your profile",
          // text: "A picture,Your expertise,title At least one skill",
          html:
            "<p>You must have:<br/><br/>A picture, your expertise title and at least one skill.</p> ",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ED7B18",
          confirmButtonText: "Edit my profile",
        }).then((result) => {
          if (result.value) {
            this.props.history.push("/edit-profile");
          }
        });
      } else {
        history.push(
          `/register/?account=worker&backto=job-details-work/${this.props.match.params.id}`
        );
      }
    }
  };

  render() {
    let { dispatch, isAuthenticated, history } = this.props;
    let { jobdetails, loading, notFound } = this.state;
    let styl = { justifyContent: "flex-end" };
    let styleappy = !this.state.favid ? styl : {};
    return (
      <div>
        {notFound ? (
          <DeletePage text={"This job is no longer available."} />
        ) : (
          <div className={"registration greybf"} id="job-details-hire">
            <div className="container pt-3 ">
              {loading ? (
                <div className="row">
                  <Spinner />{" "}
                </div>
              ) : (
                <div className="row main-row" id="job-details-work">
                  <div className="row w-100">
                    <div
                      style={{
                        width: "72%",
                      }}
                    >
                      <h4>
                        {jobdetails && <TextParser text={jobdetails.title} />}
                      </h4>
                    </div>
                    <div
                      className="header-mobile-button-wrapper"
                      style={{
                        width: "27.9%",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: "10px",
                        paddingRight: "3px",
                      }}
                    >
                      {!this.state.applied ? (
                        <button
                          className="btn text-uppercase button apply"
                          onClick={() => this.apply()}
                        >
                          Apply
                        </button>
                      ) : (
                        <button className="btn text-uppercase button apply">
                          already Applied
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-8 specifics pl-0">
                    <JobDetails
                      data={jobdetails !== null && jobdetails}
                      loading={loading}
                      apiPath={apiPath}
                      history={history}
                      onClickHidden={this.apply}
                      isAuthenticated={isAuthenticated}
                    />
                    <div
                      className=""
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                      }}
                    >
                      <MediaQuery
                        minDeviceWidth="1025px"
                        minDeviceHeight="769px"
                      >
                        {!this.state.applied ? (
                          <button
                            onClick={() => this.apply()}
                            className="btn text-uppercase button apply"
                          >
                            Apply
                          </button>
                        ) : (
                          <button className="btn text-uppercase button apply">
                            already Applied
                          </button>
                        )}
                      </MediaQuery>
                    </div>
                    <MediaQuery maxDeviceWidth="767px">
                      <span className="freelancer-save-bottom-wrapper">
                        {!this.state.applied ? (
                          <button
                            onClick={() => this.apply()}
                            className="btn mb-3 text-uppercase button apply"
                          >
                            Apply
                          </button>
                        ) : (
                          <button className="btn mb-3 text-uppercase button apply">
                            already Applied
                          </button>
                        )}
                      </span>
                    </MediaQuery>
                    <MediaQuery maxDeviceWidth="1024px">
                      <Client
                        isAuthenticated={isAuthenticated}
                        disabled={this.state.favid}
                        jobdetails={jobdetails}
                        gotoprofile={this.gotoprofile}
                        localdate={this.localdate}
                        addfav={this.addfav}
                        openMessageModal={this.openMessageModal}
                        history={history}
                      />
                    </MediaQuery>
                    {jobdetails &&
                      jobdetails.otherJobsByClient &&
                      jobdetails.otherJobsByClient.length > 0 && (
                        <div className="header">
                          <p>
                            Other jobs by{" "}
                            {jobdetails &&
                              jobdetails.client &&
                              jobdetails.client.companyName &&
                              jobdetails.client.companyName}
                          </p>
                        </div>
                      )}

                    {jobdetails &&
                      jobdetails.otherJobsByClient &&
                      jobdetails.otherJobsByClient.length > 0 && [
                        <MediaQuery maxDeviceWidth="767px">
                          {jobdetails &&
                            jobdetails.otherJobsByClient &&
                            jobdetails.otherJobsByClient.length > 0 &&
                            jobdetails.otherJobsByClient
                              .filter((job) => job.status !== "NotApproved")
                              .map((item, index) => {
                                return (
                                  <div
                                    key={index + "title"}
                                    className="active-job-posts-mobile-container"
                                  >
                                    <div className="a-j-p-avatitle">
                                      <div
                                        onClick={() => {
                                          this.props.history.push(
                                            `/job-details-work/${item.id}`
                                          );
                                          window.location.reload();
                                        }}
                                        className="a-j-p-ava-container"
                                      >
                                        <img
                                          src={
                                            jobdetails &&
                                            jobdetails.client &&
                                            jobdetails.client.profilePicturePath
                                              ? jobdetails.client
                                                  .profilePicturePath
                                              : clientplacehold
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div
                                        onClick={() => {
                                          this.props.history.push(
                                            `/job-details-work/${item.id}`
                                          );
                                          window.location.reload();
                                        }}
                                        className="a-j-p-title"
                                      >
                                        <TextParser text={item.title} />
                                      </div>
                                    </div>
                                    <div className="a-j-p-details">
                                      <div className="a-j-p-details-row">
                                        <span className="a-j-p-details-row-header">
                                          TYPE
                                        </span>
                                        <span>{item.type}</span>
                                      </div>
                                      <div className="a-j-p-details-row">
                                        <span className="a-j-p-details-row-header">
                                          SALARY
                                        </span>
                                        <span className="pointer">
                                          ${item.salary}/
                                          {ShortSalaryTypeById(
                                            item.salaryTypeId
                                          )}
                                        </span>
                                      </div>
                                      <div className="a-j-p-details-row">
                                        <span className="a-j-p-details-row-header">
                                          DATE
                                        </span>
                                        <span>
                                          <Moment fromNow ago>
                                            {this.localdate(
                                              new Date(item.activeDate)
                                            )}
                                          </Moment>
                                          &nbsp;ago
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                        </MediaQuery>,
                        <MediaQuery minDeviceWidth="768px">
                          <table className="work-table">
                            <thead>
                              <tr>
                                <th>JOB TITLE</th>
                                <th>TYPE</th>
                                <th>SALARY</th>
                                <th>DATE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobdetails &&
                                jobdetails.otherJobsByClient &&
                                jobdetails.otherJobsByClient.length > 0 &&
                                jobdetails.otherJobsByClient
                                  .filter((job) => job.status !== "NotApproved")
                                  .map((item, index) => {
                                    return (
                                      <tr>
                                        <td style={{ fontWeight: "900" }}>
                                          <span
                                            className="pointer"
                                            onClick={() => {
                                              this.props.history.push(
                                                `/job-details-work/${item.id}`
                                              );
                                              window.location.reload();
                                            }}
                                          >
                                            <TextParser text={item.title} />
                                          </span>
                                        </td>
                                        <td>{item.type}</td>
                                        <td>
                                          ${item.salary}/
                                          {item.salaryType &&
                                            item.salaryType
                                              .replace("ly", "")
                                              .replace("LY", "")}
                                        </td>
                                        <td>
                                          <Moment fromNow ago>
                                            {this.localdate(
                                              new Date(item.activeDate)
                                            )}
                                          </Moment>{" "}
                                          ago
                                        </td>
                                      </tr>
                                    );
                                  })}
                            </tbody>
                          </table>
                        </MediaQuery>,
                      ]}

                    {jobdetails &&
                      jobdetails.similarJobs &&
                      jobdetails.similarJobs.length > 0 && (
                        <div className="header">
                          <p>Similar Jobs</p>
                        </div>
                      )}
                    {jobdetails &&
                      jobdetails.similarJobs &&
                      jobdetails.similarJobs.length > 0 && [
                        <MediaQuery maxDeviceWidth="767px">
                          <div>
                            {jobdetails &&
                              jobdetails.similarJobs &&
                              jobdetails.similarJobs.length > 0 &&
                              jobdetails.similarJobs
                                .filter((job) => job.status !== "NotApproved")
                                .map((item, index) => {
                                  return (
                                    <div
                                      key={index + "title"}
                                      className="active-job-posts-mobile-container"
                                    >
                                      <div className="a-j-p-avatitle">
                                        <div
                                          onClick={() => {
                                            this.props.history.push(
                                              `/job-details-work/${item.id}`
                                            );
                                            window.location.reload();
                                          }}
                                          className="a-j-p-ava-container"
                                        >
                                          <img
                                            src={
                                              item.profilePicturePath
                                                ? item.profilePicturePath
                                                : employer
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <div
                                          onClick={() => {
                                            this.props.history.push(
                                              `/job-details-work/${item.id}`
                                            );
                                            window.location.reload();
                                          }}
                                          className="a-j-p-title"
                                        >
                                          <TextParser text={item.title} />
                                        </div>
                                      </div>
                                      <div className="a-j-p-details">
                                        <div className="a-j-p-details-row">
                                          <span className="a-j-p-details-row-header">
                                            TYPE
                                          </span>
                                          <span>{item.type}</span>
                                        </div>
                                        <div className="a-j-p-details-row">
                                          <span className="a-j-p-details-row-header">
                                            SALARY
                                          </span>
                                          <span className="pointer">
                                            ${item.salary}/
                                            {ShortSalaryTypeById(
                                              item.salaryTypeId
                                            )}
                                          </span>
                                        </div>
                                        <div className="a-j-p-details-row">
                                          <span className="a-j-p-details-row-header">
                                            DATE
                                          </span>
                                          <span>
                                            <Moment fromNow ago>
                                              {this.localdate(
                                                new Date(item.activeDate)
                                              )}
                                            </Moment>{" "}
                                            ago
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                          </div>
                        </MediaQuery>,
                        <MediaQuery minDeviceWidth="768px">
                          <table className="work-table">
                            <thead>
                              <tr>
                                <th>JOB TITLE</th>
                                <th>TYPE</th>
                                <th>SALARY</th>
                                <th>DATE</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobdetails &&
                                jobdetails.similarJobs &&
                                jobdetails.similarJobs.length > 0 &&
                                jobdetails.similarJobs
                                  .filter((job) => job.status !== "NotApproved")
                                  .map((item, index) => {
                                    return [
                                      <tr>
                                        <td style={{ fontWeight: "900" }}>
                                          <span
                                            className="pointer"
                                            onClick={() => {
                                              this.props.history.push(
                                                `/job-details-work/${item.id}`
                                              );
                                              window.location.reload();
                                            }}
                                          >
                                            <TextParser text={item.title} />
                                          </span>
                                        </td>
                                        <td>{item.type}</td>
                                        <td>
                                          ${item.salary}/
                                          {item.salaryType &&
                                            item.salaryType
                                              .replace("ly", "")
                                              .replace("LY", "")}
                                        </td>
                                        <td>
                                          <Moment fromNow ago>
                                            {this.localdate(
                                              new Date(item.activeDate)
                                            )}
                                          </Moment>{" "}
                                          ago
                                        </td>
                                      </tr>,
                                    ];
                                  })}
                              {jobdetails &&
                                jobdetails.similarJobs &&
                                jobdetails.similarJobs.length === 0 && (
                                  <tr>
                                    <td>No similar Jobs found</td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </MediaQuery>,
                      ]}
                  </div>

                  <MediaQuery minDeviceWidth="1025px">
                    <Client
                      isAuthenticated={isAuthenticated}
                      disabled={this.state.favid}
                      jobdetails={jobdetails}
                      gotoprofile={this.gotoprofile}
                      localdate={this.localdate}
                      addfav={this.addfav}
                      openMessageModal={this.openMessageModal}
                      history={history}
                    />
                  </MediaQuery>
                </div>
              )}
              <Modal
                show={this.state.showModal}
                onHide={this.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    Message to {this.state.message.name}
                  </Modal.Title>
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
                    {this.state.sendingMessage ? (
                      <button className="btn-orange">Wait....</button>
                    ) : (
                      <button className="btn-orange" onClick={this.sendMessage}>
                        Send Message
                      </button>
                    )}
                    <span className="margin-lr-2"></span>
                    <button className="btn-white" onClick={this.handleClose}>
                      Close
                    </button>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ auth, account }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    profile: account.profile,
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
export default connect(mapStateToProps, mapDispachToProps)(JobHire);
