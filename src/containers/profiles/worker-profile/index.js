import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import Modal from "react-bootstrap/Modal";
import Spinner from "../../../components/spinner";
import placeholder1 from "../../../assets/img_avatar.svg";
import Swal from "sweetalert2";
import { apiPath } from "../../../services/config";
import placeholdericon from "../../../assets/icons.png";
import { parsedSocialLink } from "../../../utils/parseSocialLink";
import queryString from "query-string";
import MetaTags from "react-meta-tags";
import MediaQuery from "react-responsive";
import { mobileVendor } from "react-device-detect";
import DeletePage from "../../DeletedComponent";
import onHiddenClickSwal from "../../../utils/onHiddenClickSwal";
import TextParser from "../../../utils/TextParser";
import StarRating from "../../../components/starRating";
import UpgradeSmall from "../../../components/UpgradeSmall";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const ProfileWork = (
  {
    history,
    match,
    billing,
    auth,
    isAuthenticated,
    auth: { user },
    trans_subs,
  },
  props
) => {
  const [profileData, setProfile] = useState(null);
  const [loader, setLoader] = useState(true);
  const [NotFound, SetNotFound] = useState(false);
  const [showfav, setfav] = useState(true);
  const [modal, setModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMesssges] = useState({
    fromUserId: "",
    toUserId: "",
    message: "",
    jobId: "",
    name: "",
    mailId: "",
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    const { location } = history;
    let id = match.params.id || localStorage.getItem("profileId");
    console.log("");
    if (id) {
      axios
        .get(apiPath + `/client/worker-profile/${id}`, config)
        .then((res) => {
          setProfile(res.data);
          setLoader(false);
          let portfolios = [];
          res.data.portfolios.map((item) => {
            const file = item.filePath;
            const fileType = file.substr(file.lastIndexOf(".") + 1);
            const validImageTypes = ["gif", "jpg", "png", "jpeg"];
            if (validImageTypes.includes(fileType)) {
              portfolios.push({
                fileExtension: "",
                fileName: item.fileName,
                filePath: item.filePath,
                id: item.id,
                thumbnail: item.thumbnail,
              });
            } else {
              portfolios.push({
                fileExtension: fileType,
                fileName: item.fileName,
                filePath: item.filePath,
                id: item.id,
                thumbnail: item.thumbnail,
              });
            }
          });
          setPortfolio(portfolios);
        })
        .catch((err) => {
          console.log("user error", err.response);

          setLoader(false);
          SetNotFound(true);
        });
      axios.get(apiPath + `/favorites/client/workers`, config).then((res) => {
        res.data.map((item) => {
          if (item.userId === id) {
            setfav(false);
          }
        });
      });
    }
    // else {
    // 	history.push("/dashboard");
    // }
  }, []);

  const addtofac = (userId) => {
    axios
      .post(apiPath + `/favorites/client/add/${userId}`, config)
      .then((res) => {
        setfav(false);
      });
  };
  let { dispatch, loggedIn } = props;
  const localdate = (date) => {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  };
  const openMessageModal = (UserId, name) => {
    const bodysender = {
      entryType: "Contacts",
      messageToUserId: UserId,
    };
    axios
      .post(apiPath + "/client/GetPricingPlanCapabilityStatus", bodysender)
      .then((res) => {
        if (res.data.result === true) {
          let jobid = localStorage.getItem("jobId_Message");
          setMesssges({
            ...messages,
            fromUserId: user.userId,
            toUserId: UserId,
            jobId: jobid,
            name: name,
          });
          setModal(true);
        } else {
          if (trans_subs.subscriptionStatus.planName.toUpperCase() === "FREE") {
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
                history.push("/pricing");
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
                history.push("/pricing");
              }
            });
          }
        }
      });
  };
  const paragraph = (value) => {
    return;
  };
  const handleClose = () => {
    setModal(false);
  };
  const setMessage = (event) => {
    let msg = event.target.value;
    event.preventDefault();
    setMesssges({ ...messages, message: msg });
  };
  const sendMessage = () => {
    let model = {
      fromUserId: messages.fromUserId,
      toUserId: messages.toUserId,
      message: messages.message,
      jobId: messages.jobId,
    };
    setSendingMessage(true);
    axios
      .post(apiPath + "/messages/intial/send", model, config)
      .then((res) => {
        setSendingMessage(false);
        if (res.data.status === "success") {
          Swal.fire(
            "Sent!",
            `Message has been sent to ${messages.name}`,
            "success"
          );
          setMesssges({
            fromUserId: "",
            toUserId: "",
            message: "",
            jobId: "",
            name: "",
            mailId: "",
          });
          setModal(false);
        }
      })
      .catch((err) => {
        setSendingMessage(false);
      });
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
    return false;
  };

  const placehold =
    profileData &&
    profileData.profilePicturePath &&
    profileData.profilePicturePath
      ? profileData.profilePicturePath
      : placeholder1;
  if (NotFound) {
    return <DeletePage text={"This worker is no longer available."} />;
  } else {
    return (
      <div className="registration worker-profile" id="edit-profile">
        {loader ? (
          <Spinner />
        ) : (
          <div className="container pt-3 row-padd">
            <div className=" row inner-div pl-0">
              <h1>Candidate</h1>
              <div
                className="work-profile d-flex flex-column align-items-end"
                style={{}}
              >
                <div className="work-profile-button-wrapper">
                  {user && user.userTypeId === 2 && (
                    <button
                      className="btn save-btn text-uppercase"
                      onClick={() => history.push(`/edit-profile`)}
                    >
                      Edit
                    </button>
                  )}
                  {user && user.userTypeId === 1 && (
                    <div className="web-line">
                      <button
                        className="btn save-btn text-uppercase button"
                        onClick={() => addtofac(profileData.userId)}
                        disabled={!showfav}
                      >
                        {showfav ? "Add to favorites" : "Added to favorites"}
                      </button>
                      <button
                        className="btn save-btn text-uppercase"
                        onClick={() =>
                          openMessageModal(
                            profileData.userId,
                            profileData.fullName
                          )
                        }
                      >
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className=" col-md-4 pl-0">
                <div className="row left-side-outer">
                  <div className="col-sm-12 left-side-inner">
                    <div className="user-div">
                      <div className="user-pic-upload p-0">
                        <img
                          src={placehold}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div className="user-pic">
                        <span>
                          <h4>
                            <TextParser
                              text={
                                profileData !== null && profileData.fullName
                              }
                            />
                          </h4>
                        </span>
                        <p className="text-center">
                          {profileData !== null && (
                            <TextParser text={profileData.countryName} />
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="member-details second-profile">
                      <p>
                        Member since:{" "}
                        <span>
                          {" "}
                          <Moment format="MMM D YYYY">
                            {profileData &&
                              profileData.memberSince &&
                              profileData.memberSince}
                          </Moment>
                        </span>
                      </p>
                      <p>
                        Last logged:
                        <span>
                          {" "}
                          <Moment fromNow ago>
                            {profileData !== null &&
                              localdate(new Date(profileData.lastLoginTime))}
                          </Moment>
                          &nbsp;ago
                        </span>
                      </p>
                    </div>
                    <div>
                      {profileData && profileData.enableMessage && (
                        <div className="social-links">
                          {profileData !== null &&
                            profileData.socialMediaLinks &&
                            profileData.socialMediaLinks.facebool && (
                              <div className="facebook">
                                <i className="fa fa-facebook" />
                                <p>
                                  <a
                                    target="_blank"
                                    href={parsedSocialLink(
                                      profileData.socialMediaLinks.facebool
                                    )}
                                  >
                                    View Facebook profile
                                  </a>{" "}
                                </p>
                              </div>
                            )}
                          {profileData !== null &&
                            profileData.socialMediaLinks &&
                            profileData.socialMediaLinks.linkedIn && (
                              <div className="linkedin">
                                <i className="fa fa-linkedin" />
                                <p>
                                  <a
                                    target="_blank"
                                    href={parsedSocialLink(
                                      profileData.socialMediaLinks.linkedIn
                                    )}
                                  >
                                    View LinkIn Profile
                                  </a>
                                </p>
                              </div>
                            )}
                          {profileData !== null &&
                            profileData.socialMediaLinks &&
                            profileData.socialMediaLinks.skype && (
                              <div className="skype">
                                <i className="fa fa-skype" />
                                <p>{profileData.socialMediaLinks.skype}</p>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  <MediaQuery minDeviceWidth="768px">
                    {isNeededUpgradeSmall() && <UpgradeSmall />}
                  </MediaQuery>
                </div>
              </div>
              <div className=" col-md-8 pr-0 pl-0 right-side">
                <div className="right-side-top ml-15">
                  {profileData && profileData.featured ? (
                    <span
                      className="recommend-badge recommend-badge-absolute"
                      style={{ top: 25 }}
                    >
                      Recommended
                    </span>
                  ) : (
                    ""
                  )}
                  <div style={{ marginTop: 20 }}>
                    {profileData !== null && profileData.title && (
                      <h4>
                        <TextParser text={profileData.title} />
                      </h4>
                    )}
                    {profileData !== null &&
                      (profileData.title === null ||
                        profileData.title === "") && <p>Title: N/A</p>}
                  </div>
                  <div className="mb-3">
                    <StarRating rating={profileData ? profileData.rating : 0} />
                  </div>
                  {profileData !== null && profileData.description && (
                    <p style={{ height: "100%" }}>
                      <TextParser text={profileData.description} />
                    </p>
                  )}
                  {profileData !== null &&
                    (profileData.description === null ||
                      profileData.description === "") && (
                      <p className="">Description: N/A</p>
                    )}
                </div>
                <MediaQuery minDeviceWidth="768px">
                  <table
                    style={{
                      marginLeft: "15px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>EXPECTED SALARY</th>
                        <th>AVAILABILTY</th>
                        <th>EDUCATION</th>
                        <th>EXPERIENCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className={
                            profileData !== null &&
                            profileData.salary &&
                            profileData.salary !== "Salary/Month (USD)"
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null &&
                          profileData.salary &&
                          profileData.salary !== "Salary/Month (USD)"
                            ? parseInt(profileData.salary) === 2000
                              ? "$" + profileData.salary + "+/Month"
                              : "$" + profileData.salary + "/Month"
                            : "N/A"}
                        </td>
                        <td
                          className={
                            profileData !== null &&
                            profileData.availability &&
                            profileData.availability !== "0"
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null &&
                          profileData.availability &&
                          profileData.availability !== "0"
                            ? profileData.availability
                            : "N/A"}
                        </td>
                        <td
                          className={
                            profileData !== null && profileData.education
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null && profileData.education
                            ? profileData.education
                            : "N/A"}
                        </td>
                        <td
                          className={
                            profileData !== null && profileData.experience
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null && profileData.experience
                            ? profileData.experience
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </MediaQuery>
                <MediaQuery maxDeviceWidth="767px">
                  <table>
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th style={{ width: "50%" }}>EXPECTED SALARY</th>
                        <th style={{ width: "50%" }}>AVAILABILTY</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ textAlign: "center" }}>
                        <td
                          className={
                            profileData !== null &&
                            profileData.salary &&
                            profileData.salary !== "Salary/Month (USD)"
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null &&
                          profileData.salary &&
                          profileData.salary !== "Salary/Month (USD)"
                            ? parseInt(profileData.salary) === 2000
                              ? "$" + profileData.salary + "+/Month"
                              : "$" + profileData.salary + "/Month"
                            : "N/A"}
                        </td>
                        <td
                          className={
                            profileData !== null &&
                            profileData.availability &&
                            profileData.availability !== "0"
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null &&
                          profileData.availability &&
                          profileData.availability !== "0"
                            ? profileData.availability
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <thead style={{ textAlign: "center" }}>
                      <tr>
                        <th style={{ width: "50%" }}>EDUCATION</th>
                        <th style={{ width: "50%" }}>EXPERIENCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ textAlign: "center" }}>
                        <td
                          className={
                            profileData !== null && profileData.education
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null && profileData.education
                            ? profileData.education
                            : "N/A"}
                        </td>
                        <td
                          className={
                            profileData !== null && profileData.experience
                              ? "pl-0 text-center"
                              : "pl-0 text-center font-weight-bold"
                          }
                        >
                          {profileData !== null && profileData.experience
                            ? profileData.experience
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </MediaQuery>
                <div className="row skills">
                  <div className="col-sm-12 pl-0">
                    <div className="mini-head">
                      <h4 className="ml-15">Skills</h4>
                      <div className="added-skills ">
                        {profileData !== null &&
                          profileData.skills &&
                          profileData.skills.map((item, index) => {
                            return (
                              <div
                                className={
                                  index === 0
                                    ? "skill mr-0 ml-15 mt-2 "
                                    : "skill mr-0 ml-15 mt-2"
                                }
                              >
                                <p className="mr-0  ">{item.name}</p>
                                &nbsp;
                              </div>
                            );
                          })}
                        {profileData !== null &&
                          profileData.skills &&
                          profileData.skills.length === 0 && (
                            <div className=" mr-0 ml-15 font-weight-bold">
                              N/A
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row skills">
                  <div className="col-sm-12 pl-0">
                    <div className="mini-head">
                      <h4 className="ml-15">Portfolio</h4>
                      <div className="added-portfolio ml-15">
                        {profileData &&
                          profileData.portfolios &&
                          profileData.portfolios.map((item, index) => {
                            return (
                              <a
                                className={`${
                                  (trans_subs &&
                                    trans_subs.subscriptionStatus &&
                                    trans_subs.subscriptionStatus.planName ===
                                      "Free") ||
                                  !user
                                    ? "portfolio-wrapper"
                                    : ""
                                }`}
                                onTouchStart={(e) => {
                                  if (
                                    (trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                    !isAuthenticated
                                  )
                                    e.preventDefault();
                                  onHiddenClickSwal(
                                    e,
                                    history,
                                    isAuthenticated
                                  );
                                }}
                                onTouchEnd={(e) => {
                                  if (
                                    (trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                    !isAuthenticated
                                  )
                                    e.preventDefault();
                                }}
                                onContextMenu={(e) => {
                                  if (
                                    (trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                    !isAuthenticated
                                  )
                                    e.preventDefault();
                                }}
                                onClick={(e) => {
                                  console.warn(isAuthenticated);
                                  ((trans_subs &&
                                    trans_subs.subscriptionStatus &&
                                    trans_subs.subscriptionStatus.planName ===
                                      "Free") ||
                                    !isAuthenticated) &&
                                    onHiddenClickSwal(
                                      e,
                                      history,
                                      isAuthenticated
                                    );
                                }}
                                href={item.filePath}
                                target="_blank"
                              >
                                <div className="portfolio-file">
                                  {item.fileExtension === "" ? (
                                    <img
                                      onTouchStart={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                        onHiddenClickSwal(
                                          e,
                                          history,
                                          isAuthenticated
                                        );
                                      }}
                                      onTouchEnd={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                      }}
                                      onContextMenu={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                      }}
                                      onClick={(e) => {
                                        console.warn(isAuthenticated);
                                        ((trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                          !isAuthenticated) &&
                                          onHiddenClickSwal(
                                            e,
                                            history,
                                            isAuthenticated
                                          );
                                      }}
                                      src={item.filePath}
                                      alt={item.fileName}
                                      className={`portfolio-file-picture ${
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                          ? "portfolio-wrapper"
                                          : ""
                                      }`}
                                    />
                                  ) : (
                                    <img
                                      onTouchStart={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                        onHiddenClickSwal(
                                          e,
                                          history,
                                          isAuthenticated
                                        );
                                      }}
                                      onTouchEnd={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                      }}
                                      onContextMenu={(e) => {
                                        if (
                                          (trans_subs &&
                                            trans_subs.subscriptionStatus &&
                                            trans_subs.subscriptionStatus
                                              .planName === "Free") ||
                                          !isAuthenticated
                                        )
                                          e.preventDefault();
                                      }}
                                      onClick={(e) => {
                                        console.warn(isAuthenticated);
                                        ((trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                          !isAuthenticated) &&
                                          onHiddenClickSwal(
                                            e,
                                            history,
                                            isAuthenticated
                                          );
                                      }}
                                      src={placeholdericon}
                                      alt={item.fileName}
                                      className={`portfolio-file-picture ${
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                          ? "portfolio-wrapper"
                                          : ""
                                      }`}
                                    />
                                  )}
                                  <p
                                    onTouchStart={(e) => {
                                      if (
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                      )
                                        e.preventDefault();
                                      onHiddenClickSwal(
                                        e,
                                        history,
                                        isAuthenticated
                                      );
                                    }}
                                    onTouchEnd={(e) => {
                                      if (
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                      )
                                        e.preventDefault();
                                    }}
                                    onContextMenu={(e) => {
                                      if (
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                      )
                                        e.preventDefault();
                                    }}
                                    onClick={(e) => {
                                      console.warn(isAuthenticated);
                                      ((trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                        !isAuthenticated) &&
                                        onHiddenClickSwal(
                                          e,
                                          history,
                                          isAuthenticated
                                        );
                                    }}
                                    className={`fileextension ${
                                      (trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                      !isAuthenticated
                                        ? "portfolio-wrapper"
                                        : ""
                                    }`}
                                  >
                                    {item.fileExtension !== "" &&
                                      item.fileExtension}
                                  </p>
                                </div>
                                <p
                                  onTouchStart={(e) => {
                                    if (
                                      (trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                      !isAuthenticated
                                    )
                                      e.preventDefault();
                                    onHiddenClickSwal(
                                      e,
                                      history,
                                      isAuthenticated
                                    );
                                  }}
                                  onTouchEnd={(e) => {
                                    if (
                                      (trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                      !isAuthenticated
                                    )
                                      e.preventDefault();
                                  }}
                                  onContextMenu={(e) => {
                                    if (
                                      (trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                      !isAuthenticated
                                    )
                                      e.preventDefault();
                                  }}
                                  onClick={(e) => {
                                    console.warn(isAuthenticated);
                                    ((trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                      !isAuthenticated) &&
                                      onHiddenClickSwal(
                                        e,
                                        history,
                                        isAuthenticated
                                      );
                                  }}
                                  className={`black ${
                                    (trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                    !isAuthenticated
                                      ? "portfolio-wrapper"
                                      : ""
                                  }`}
                                >
                                  {item &&
                                    item.fileName &&
                                    item.fileName.slice(0, 12)}
                                  {item.fileName.length > 12 ? "..." : ""}
                                </p>
                              </a>
                            );
                          })}
                        {profileData &&
                          profileData.portfolios &&
                          profileData.portfolios.length === 0 && (
                            <a className="font-weight-bold"> N/A</a>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <MediaQuery maxDeviceWidth="767px">
                {isNeededUpgradeSmall() && <UpgradeSmall />}
              </MediaQuery>
            </div>
          </div>
        )}

        <Modal
          show={modal}
          onHide={() => handleClose()}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Message to {messages.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea
              name="message"
              className="form-control"
              rows="10"
              onChange={(e) => setMessage(e)}
              placeholder="Type your message..."
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="button">
              {sendingMessage ? (
                <button className="btn-orange">Wait.....</button>
              ) : (
                <button className="btn-orange" onClick={() => sendMessage()}>
                  Send Message
                </button>
              )}
              <span className="margin-lr-2"></span>
              <button className="btn-white" onClick={() => handleClose()}>
                Close
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = ({ auth, billing }) => {
  return {
    auth: auth,
    user: auth.user,
    trans_subs: billing && billing.subscripiotnandtrans,
    billing,
    isAuthenticated: auth.isAuthenticated,
  };
};

export default connect(mapStateToProps)(ProfileWork);
