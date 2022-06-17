import "../../styles/faq.css";

import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../alerts/actions";
import { getPlanList } from "./actions";
import TrustedCompany from "../../components/trustedcompany/index";
import Spinner from "../../components/spinner/index";
import Faq from "../../components/faq";
import store from "../../store/configureStore";
import {
  getTransactionDetails,
  getSubscriptionDetails,
} from "../billing/actions";

import MetaTags from "react-meta-tags";

import { apiPath } from "../../services/config";
import axios from "axios";

import { Helmet } from "react-helmet";
import MediaQuery from "react-responsive";

const Pricing = ({
  isAuthenticated,
  data,
  getPlanList,
  history,
  userStoreData,
  props,
  email,
  subscripiotnandtrans,
}) => {
  console.log("data", data);
  useEffect(() => {
    window.scrollTo(0, 0);
    getPlanList();
    if (isAuthenticated) {
      axios.get(`${apiPath}/client/subscription`).then((res) => {
        if (res.data.subscriptionStatus) {
          if (res.data.subscriptionStatus.allowPromotion)
            setIsAllowedPromo(true); // check allowpromotion status from response and set
          switch (res.data.subscriptionStatus.planName.toLowerCase()) {
            case "free":
              setButton(["CURRENT PLAN", "upgrade", "upgrade", "upgrade"]);
              break;
            case "starter":
              setButton(["downgrade", "CURRENT PLAN", "upgrade", "upgrade"]);
              break;
            case "popular":
              setButton(["downgrade", "downgrade", "CURRENT PLAN", "upgrade"]);
              break;
            case "starter rebate":
              setButton(["downgrade", "downgrade", "CURRENT PLAN", "upgrade"]);
              break;
            case "business":
              setButton([
                "downgrade",
                "downgrade",
                "downgrade",
                "CURRENT PLAN",
              ]);
              break;
          }
        } else {
          setButton(["CURRENT PLAN", "upgrade", "upgrade", "upgrade"]);
        }
      });
    }
  }, [getPlanList, getSubscriptionDetails]);
  const [formData, setFormData] = useState({});

  const [indexvalue, setIndexValue] = useState(2);
  const [buttons, setButton] = useState([]);
  const [isAllowedPromo, setIsAllowedPromo] = useState(false); // shows if allowpromotion is 0 or 1

  const setplan = (plan, index) => {
    if (isAuthenticated && index !== 0) {
      localStorage.setItem("plan", index);
      history.push("/payment-details");
    }
    if (isAuthenticated && index === 0) {
      const formData = new FormData();
      formData.append("email", null);
      formData.append("stripeToken", null);
      formData.append("planId", data[index].accessId);
      axios.post(apiPath + "/payment/charge", formData).then((res) => {
        if (res) {
          store.dispatch(getTransactionDetails("formal"));
          store.dispatch(getSubscriptionDetails());
          history.push("/purchased-free");
        }
      });
    } else if (!isAuthenticated) {
      if (index !== 0) localStorage.setItem("plan", index);
      history.push("/register");
    }
  };

  const gotoLearnMore = () => {
    window.location.href =
      "https://www.gohirenow.com/p/virtual-assistant-recruiting-service.html";
  };
  if (isAuthenticated) {
  }

  return (
    <Fragment>
      <Helmet>
        <title>GoHireNow - Pricing</title>
        <meta
          property="og:title"
          content="GoHireNow"
          data-react-helmet="true"
        />
        <meta
          property="og:site_name"
          content="GoHireNow"
          data-react-helmet="true"
        />
        <meta
          property="og:image"
          content="images/Capture.PNG"
          data-react-helmet="true"
        />
        <meta property="og:type" content="text" data-react-helmet="true" />
        <meta
          property="og:url"
          content="https://www.gohirenow.com"
          data-react-helmet="true"
        />
        <meta
          property="og:description"
          content="Job posting is completely FREE. Browse through our applicants and candidates to find your next remote employee expert!"
          data-react-helmet="true"
        />
        <meta property="description" content="Pricing" />
      </Helmet>

      <div
        className={
          isAuthenticated ? "registration greybf" : "registration white"
        }
        id="pricing"
      >
        <div className="container pt-3">
          <div className="inner-div" style={{ padding: "50px 1px" }}>
            <div className="row flex-column top-text">
              <h2 className="text-center">
                Save Money And Get Your Work Done!
              </h2>
              <h5 className="text-center">
                Access the world's top Virtual Assistants!
              </h5>
              <h5 className="text-center">100,000+ VA are waiting for you!</h5>
            </div>
            <div className="row cards-row pricing-cards">
              {data && data.length > 0 ? (
                data
                  .filter((item) => item.isActive)
                  .map((itemOrg, index) => {
                    const isRebate = index === 1 && isAllowedPromo;
                    const item = !isRebate ? itemOrg : data[data.length - 1];
                    return (
                      <div
                        className={
                          index === data.length - 1
                            ? "price-card-mobile col-sm-3 pr-0"
                            : "price-card-mobile col-sm-3"
                        }
                        key={index}
                      >
                        <div
                          className={
                            indexvalue === index
                              ? "card notloggin"
                              : "card h100"
                          }
                        >
                          <div
                            className={
                              "card-head" + (isRebate ? " starter-rebase" : "")
                            }
                          >
                            <h1>
                              {" "}
                              {index === 0 ? "Try For " : ""}
                              {item.name}
                              {index === 1 && !isRebate ? "(SAVE 30%)" : ""}
                              {index === 1 && isRebate ? "(SAVE 58%)" : ""}
                            </h1>
                            <h4>
                              {index === 3 ? (
                                <span>
                                  ${item.price}{" "}
                                  <small>{index === 0 ? "" : ""}</small>
                                </span>
                              ) : index === 1 ? (
                                <span STYLE="text-decoration:line-through">
                                  $69.95<small>/mo</small>
                                </span>
                              ) : (
                                <span>
                                  ${item.price}{" "}
                                  <small>{index === 0 ? "" : "/mo"}</small>
                                </span>
                              )}
                              {index === 1 ? (
                                <span>
                                  <br /> ${item.price}
                                  <small>/mo</small>
                                </span>
                              ) : index === 3 ? (
                                <span>
                                  <br /> <small>One-Time Fee</small>
                                </span>
                              ) : (
                                <span>
                                  <br />
                                  <br />
                                </span>
                              )}
                            </h4>
                            <div className={index === 2 ? "white" : "black"}>
                              {index === 0
                                ? "No credit card required"
                                : index === 3
                                ? "We'll find for you the best VA"
                                : "Cancel when done recruiting"}
                            </div>
                          </div>
                          <div
                            className={
                              indexvalue === index
                                ? "card-bot padding-diferent"
                                : "card-bot"
                            }
                          >
                            {/*<p>2 Days Job Post Approval</p>*/}
                            {index === 0 ? (
                              <p
                                style={{
                                  color: "black",
                                  marginBottom: "8px",
                                  fontSize: "15px",
                                }}
                              >
                                Up To 24h Job Approval
                              </p>
                            ) : index === 3 ? (
                              <p
                                style={{
                                  color: "black",
                                  marginBottom: "8px",
                                  fontSize: "15px",
                                }}
                              >
                                Choose between top 3 resumes
                              </p>
                            ) : (
                              <p
                                style={{
                                  color: "black",
                                  marginBottom: "8px",
                                  fontSize: "15px",
                                }}
                              >
                                Instant Job Post Approval
                              </p>
                            )}

                            <table>
                              <tbody>
                                {index === 3 ? (
                                  <tr>
                                    <td>
                                      <b>100%</b>
                                    </td>
                                    <td>Hassle-free</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td>
                                      <b>{item.jobPosts}</b>
                                    </td>
                                    <td>Active Job Posts</td>
                                  </tr>
                                )}

                                {/*  <tr>
                                                            <td>{item.maxApplicants}</td>
                                                            <td>Max Applications Per Job</td>
                                                        </tr>
                                                        */}

                                {index === 3 ? (
                                  <tr>
                                    <td>
                                      <b>3</b>
                                    </td>
                                    <td>Resumes Presentation</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td>
                                      <b>{item.maxContacts}</b>
                                    </td>
                                    <td>Monthly Max Contacts</td>
                                  </tr>
                                )}

                                {index === 3 ? (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Background Check</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Browse Profiles</td>
                                  </tr>
                                )}

                                {index === 3 ? (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Hire Directly</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>View Applications</td>
                                  </tr>
                                )}

                                {index === 3 ? (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Manage Directly</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Favorites</td>
                                  </tr>
                                )}
                                {/*
                                                        <tr>
                                                            <td className={indexvalue===index ? "":""}>
                                                                {
                                                                    index !==0 ?
                                                                        <i className="fa fa-check"
                                                                           style={{
                                                                               color:indexvalue===index? "white":"green"
                                                                           }}
                                                                        ></i>:
                                                                        <i className="fa fa-close" style={{
                                                                            color:indexvalue===index? "white":"red"
                                                                        }}></i>
                                                                }
                                                                {item.viewApplicants}
                                                            </td>
                                                            <td>Contact Workers</td>
                                                        </tr>
                                                        */}
                                {index === 3 ? (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>

                                      {/*{ item.addFavorites }*/}
                                    </td>
                                    <td>Pre-Screening</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      {index !== 0 ? (
                                        <i
                                          className="fa fa-check"
                                          style={{
                                            color:
                                              indexvalue === index
                                                ? "white"
                                                : "green",
                                          }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fa fa-close"
                                          style={{
                                            color: "red",
                                          }}
                                        ></i>
                                      )}
                                    </td>
                                    <td>Direct Email Access</td>
                                  </tr>
                                )}
                                {index === 3 ? (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      {index !== 0 ? (
                                        <i
                                          className="fa fa-check"
                                          style={{
                                            color:
                                              indexvalue === index
                                                ? "white"
                                                : "green",
                                          }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fa fa-close"
                                          style={{
                                            color: "red",
                                          }}
                                        ></i>
                                      )}
                                      {/*{item.hire}*/}
                                    </td>
                                    <td>Pay Directly</td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      className={indexvalue === index ? "" : ""}
                                    >
                                      {index !== 0 ? (
                                        <i
                                          className="fa fa-check"
                                          style={{
                                            color:
                                              indexvalue === index
                                                ? "white"
                                                : "green",
                                          }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fa fa-close"
                                          style={{
                                            color: "red",
                                          }}
                                        ></i>
                                      )}
                                      {/*{item.hire}*/}
                                    </td>
                                    <td>Hire Workers</td>
                                  </tr>
                                )}
                                {index === 2 || index === 3 ? (
                                  <tr>
                                    <td>
                                      <i
                                        className="fa fa-check"
                                        style={{
                                          color:
                                            indexvalue === index
                                              ? "white"
                                              : "green",
                                        }}
                                      ></i>
                                    </td>
                                    <td>Dedicated account manager</td>
                                  </tr>
                                ) : (
                                  ""
                                )}
                              </tbody>
                            </table>
                          </div>
                          {!isAuthenticated && (
                            <>
                              <div className="card-btn job-post noPadtop">
                                <button
                                  className="btn"
                                  onClick={() => setplan(item, index)}
                                >
                                  {index === 0 ? "Try for free" : "Choose"}
                                </button>
                              </div>
                              {index === 3 && (
                                <div className="card-btn job-post noPadtop mt-3">
                                  <button
                                    className="btn"
                                    onClick={gotoLearnMore}
                                  >
                                    {"Learn More"}
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                          {isAuthenticated && (
                            <div>
                              <div className="card-btn job-post noPadtop">
                                <button
                                  className="btn"
                                  onClick={() =>
                                    setplan(
                                      item,
                                      !isRebate ? index : data.length - 1
                                    )
                                  }
                                  disabled={
                                    buttons[index] &&
                                    buttons[index].toLowerCase() ===
                                      "current plan"
                                  }
                                >
                                  {buttons && buttons[index]}
                                </button>
                              </div>
                              {index === 3 && (
                                <div className="card-btn job-post noPadtop mt-3">
                                  <button
                                    className="btn"
                                    onClick={gotoLearnMore}
                                  >
                                    {"Learn More"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <Spinner />
              )}
            </div>
            <div className="row" className="text-center">
              <p className="black">*All prices are in US dollars</p>
            </div>
            <div className="row mt-4 mb-5 money-back justify-content-center">
              <div className="d-flex justify-content-center ">
                <img src={require("../../assets/100gurantee.png")} alt="" />
              </div>
              <div className=" responsive-check-margin-left pricing-bottom responsive-of-100-gurantee">
                <h2 style={{ fontWeight: "900", marginTop: "2%" }}>
                  100% MONEY BACK GUARANTEE
                </h2>
                <h4 style={{ color: "black" }}>
                  If you are not satisfied, we'll give you your money back.
                </h4>
                <p style={{ textAlign: "left", marginTop: "4%" }}>
                  No contracts. No commitments. No extra fees. No commissions.
                  Cancel subscription anytime.
                </p>
                <p>
                  If you are not satisfied with GoHireNow within 30 days,
                  contact us and we'll happily refund you.
                </p>
              </div>
            </div>

            <Faq />
            <MediaQuery minDeviceWidth="768px">
              <TrustedCompany />
            </MediaQuery>
          </div>
          <MediaQuery maxDeviceWidth="767px">
            <TrustedCompany />
          </MediaQuery>
        </div>
      </div>
    </Fragment>
  );
};
const mapStateToProps = ({ auth, pricing, billing }) => ({
  isAuthenticated: auth.isAuthenticated,
  data: pricing.planList,
  userStoreData: auth.user,
  email: auth.user && auth.user.email,
  subscripiotnandtrans: billing.subscripiotnandtrans,
});

export default connect(mapStateToProps, { setAlert, getPlanList })(Pricing);
