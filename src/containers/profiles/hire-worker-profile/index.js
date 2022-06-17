import React, { Component, useState, useEffect, useCallback } from "react";
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
import { useCookies } from "react-cookie";
import MediaQuery from "react-responsive";
import { mobileVendor } from "react-device-detect";
import DeletePage from "../../DeletedComponent";
import onHiddenClickSwal from "../../../utils/onHiddenClickSwal";
import TextParser from "../../../utils/TextParser";
import { Helmet } from "react-helmet";
import StarRating from "../../../components/starRating";
import {
  JoinForFreeDesktop2,
  JoinForFreeMobile,
} from "../../../components/JoinForFree";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

function popup() {
  Swal.fire({
    // title: "Are you sure you want to delete this candidate?",
    html: `<h2>You need to create an account to message candidates.</h2>
            <p style="margin-top: 50px;"></p>`,
    type: "warning",
    width: "950px",
    showCancelButton: true,
    confirmButtonColor: "#ED7B18",
    confirmButtonText: "Sign Up",
  }).then((result) => {
    if (result.value) {
      window.location.href = "/register";
    }
  });
}

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

const ProfileWork = (
  { history, match, isAuthenticated, auth: { user }, trans_subs },
  props
) => {
  const [cookies, setCookie, removeCookie] = useCookies(["LandingPage"]);
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullName, setFullname] = useState("");

  const [relatedCandidates, setRelatedCandidats] = useState([]);

  const getRelatedCandidates = useCallback(
    ({ id, name }) => {
      // axios
      //   .get(apiPath + `/Client/worker-profile-related-skill/${id}`)
      //   .then((res) => {
      //     console.log("[res]", res);
      //   });

      let formData = new FormData();
      formData.append("SkillId", id);
      axios
        .post(apiPath + "/client/worker-profile-related-skill", formData)
        .then((res) => {
          console.log("[res]", res);
        });
    },
    [setRelatedCandidats]
  );

  useEffect(() => {
    if (!cookies || !cookies.LandingPage) {
      setCookie("LandingPage", 102, {
        expires: new Date("Thu, 18 Dec 2050 12:00:00 UTC"),
        path: "/",
      });
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    const { location } = history;
    let id = match.params.id;
    if (id) {
      axios.get(apiPath + `/hire/worker-profile/${id}`).then((res) => {
        setProfile(res.data);
        res.data.skills && getRelatedCandidates(res.data.skills[0]);
        setLoader(false);
        let portfolios = [];
        if (res.data) {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setFullname(res.data.fullName);
        }
        res.data &&
          res.data.portfolios &&
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
      });
    }
    // else {
    // 	history.push("/dashboard");
    // }
  }, []);

  let { dispatch, loggedIn } = props;
  const localdate = (date) => {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const renderJoinForFree = () => {
    if (!isAuthenticated) {
      return;
    }
  };

  const trimTitle =
    "Hire " + fullName + " - " + trimString(title) + " - Virtual Assistant";
  const trimDesc = trimString(description);

  const placehold =
    profileData &&
    profileData.profilePicturePath &&
    profileData.profilePicturePath
      ? profileData.profilePicturePath
      : placeholder1;
  if (NotFound === true) {
    return <DeletePage text={"This worker is no longer available."} />;
  } else {
    return (
      <div className="registration worker-profile" id="edit-profile">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{trimTitle}</title>
          <meta name="title" content={trimTitle} />
          <meta property="og:title" content={trimTitle} />
          <meta name="description" content={trimDesc} />
          <meta property="description" content={trimDesc} />
          <meta property="og:description" content={trimDesc} />
        </Helmet>
        {loader ? (
          <Spinner />
        ) : (
          <div className="container pt-3 row-padd">
            <MediaQuery minDeviceWidth="768px">
              {!isAuthenticated && <JoinForFreeDesktop2 />}
            </MediaQuery>
            <div className=" row inner-div pl-0 pt-5">
              <h1>Candidate</h1>
              <div className="work-profile" style={{}}>
                <button
                  className="btn save-btn text-uppercase"
                  onClick={() => popup()}
                >
                  Message
                </button>
                {/*{user && user.userTypeId === 2 && (*/}
                {/*<button*/}
                {/*className="btn save-btn text-uppercase"*/}
                {/*onClick={() => history.push(`/edit-profile`)}*/}
                {/*>*/}
                {/*Edit*/}
                {/*</button>*/}
                {/*)}*/}
                {user && user.userTypeId === 1 && (
                  <div className="web-line">
                    {/*<button*/}
                    {/*className="btn save-btn text-uppercase button"*/}
                    {/*onClick={() => addtofac(profileData.userId)}*/}
                    {/*disabled={!showfav}*/}
                    {/*>*/}
                    {/*{showfav ? "Add to favorites" : "Added to favorites"}*/}
                    {/*</button>*/}
                    {/*<button*/}
                    {/*className="btn save-btn text-uppercase "*/}
                    {/*onClick={() =>*/}
                    {/*openMessageModal(profileData.userId, profileData.fullName)*/}
                    {/*}*/}
                    {/*>*/}
                    {/*Message*/}
                    {/*</button>*/}
                  </div>
                )}
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
                            {profileData !== null &&
                              profileData.fullName &&
                              profileData.fullName}
                          </h4>
                        </span>
                        <h3
                          style={{
                            fontWeight: "200",
                            fontSize: "16px",
                          }}
                          className="text-center"
                        >
                          {profileData !== null && profileData.countryName}
                        </h3>
                      </div>
                    </div>

                    <div className="member-details second-profile">
                      <p>
                        Member since:{" "}
                        <span>
                          {" "}
                          <Moment format="MMM D YYYY">
                            {/*{profileData !== null &&*/}
                            {/*localdate(new Date(profileData.memberSince))}*/}
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
                      <h1
                        style={{
                          fontSize: "18px",
                          fontFamily: "lato",
                          color: "rgb(0, 0, 0)",
                          lineHeight: "1.652",
                          fontWeight: "bold",
                          marginBottom: 0,
                        }}
                      >
                        <TextParser text={profileData.title} />
                      </h1>
                    )}
                    {profileData !== null &&
                      (profileData.title === null ||
                        profileData.title === "") && (
                        <h1
                          style={{
                            fontWeight: "200",
                            fontSize: "16px",
                          }}
                          className="text-center"
                        >
                          Title: N/A
                        </h1>
                      )}
                  </div>
                  <div className="mb-3">
                    <StarRating rating={profileData ? profileData.rating : 0} />
                  </div>
                  {profileData !== null && profileData.description && (
                    <h2
                      onClick={(e) => onHiddenClickSwal(e, history)}
                      style={{
                        height: "100%",
                        fontWeight: "200",
                        fontSize: "16px",
                      }}
                    >
                      <TextParser text={profileData.description} />
                    </h2>
                  )}
                  {profileData !== null &&
                    (profileData.description === null ||
                      profileData.description === "") && (
                      <h2
                        className=""
                        style={{
                          fontWeight: "200",
                          fontSize: "16px",
                        }}
                      >
                        Description: N/A
                      </h2>
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
                            console.error("ISAAAA", isAuthenticated);
                            return (
                              <a
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
                                      className={`portfolio-file-picture ${
                                        (trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                        !isAuthenticated
                                          ? "portfolio-wrapper"
                                          : ""
                                      }`}
                                      src={item.filePath}
                                      alt={item.fileName}
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
                                        ((trans_subs &&
                                          trans_subs.subscriptionStatus &&
                                          trans_subs.subscriptionStatus
                                            .planName === "Free") ||
                                          !isAuthenticated) &&
                                          e.preventDefault() &&
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
                                      ((trans_subs &&
                                        trans_subs.subscriptionStatus &&
                                        trans_subs.subscriptionStatus
                                          .planName === "Free") ||
                                        !isAuthenticated) &&
                                        e.preventDefault() &&
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
                                    ((trans_subs &&
                                      trans_subs.subscriptionStatus &&
                                      trans_subs.subscriptionStatus.planName ===
                                        "Free") ||
                                      !isAuthenticated) &&
                                      e.preventDefault() &&
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

                <MediaQuery maxDeviceWidth="767px">
                  {!isAuthenticated && <JoinForFreeMobile />}
                </MediaQuery>
              </div>
            </div>
          </div>
        )}

        {/*<Modal*/}
        {/*show={modal}*/}
        {/*onHide={() => handleClose()}*/}
        {/*size="lg"*/}
        {/*aria-labelledby="contained-modal-title-vcenter"*/}
        {/*centered*/}
        {/*>*/}
        {/*<Modal.Header closeButton>*/}
        {/*<Modal.Title>Message to {messages.name}</Modal.Title>*/}
        {/*</Modal.Header>*/}
        {/*<Modal.Body>*/}
        {/*<textarea*/}
        {/*name="message"*/}
        {/*className="form-control"*/}
        {/*rows="10"*/}
        {/*onChange={(e) => setMessage(e)}*/}
        {/*placeholder="Type your message..."*/}
        {/*/>*/}
        {/*</Modal.Body>*/}
        {/*<Modal.Footer>*/}
        {/*<div className="button">*/}
        {/*{sendingMessage ? (*/}
        {/*<button className="btn-orange">Wait.....</button>*/}
        {/*) : (*/}
        {/*<button className="btn-orange" onClick={() => sendMessage()}>*/}
        {/*Send Message*/}
        {/*</button>*/}
        {/*)}*/}
        {/*<span className="margin-lr-2"></span>*/}
        {/*<button className="btn-white" onClick={() => handleClose()}>*/}
        {/*Close*/}
        {/*</button>*/}
        {/*</div>*/}
        {/*</Modal.Footer>*/}
        {/*</Modal>*/}
      </div>
    );
  }
};

const mapStateToProps = ({ auth, billing }) => {
  return {
    auth: auth,
    user: auth.user,
    trans_subs: billing && billing.subscripiotnandtrans,
    isAuthenticated: auth.isAuthenticated,
  };
};

export default connect(mapStateToProps)(ProfileWork);
