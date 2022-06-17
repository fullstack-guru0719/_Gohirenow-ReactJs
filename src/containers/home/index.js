import React, { Component, Fragment, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { useCookies } from "react-cookie";
import PropTypes from "prop-types";
import TrustedCompany from "../../components/trustedcompany/index";

import MetaTags from "react-meta-tags";

import { setUserType } from "../auth/actions";
import { Helmet } from "react-helmet";

const MainLayout = ({ isAuthenticated, user, setUserType, history }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["LandingPage"]);
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    if (!cookies || !cookies.LandingPage) {
      setCookie("LandingPage", 100, {
        expires: new Date("Thu, 18 Dec 2050 12:00:00 UTC"),
        path: "/",
      });
    }
  }, []);

  const gotowork = () => {
    setUserType(2);
    history.push("/register");
  };

  const gotohire = () => {
    setUserType(1);
    history.push("/register");
  };

  if (isAuthenticated) {
    if (user && user.userTypeId === 1) return <Redirect to="/dashboard" />;
    if (user && user.userTypeId === 2) return <Redirect to="/dashboard-work" />;
  }

  return (
    <Fragment>
      <Helmet>
        {/*<title>GoHireNow - Hire Top‑Quality Virtual Assistants</title>*/}
        {/*<meta property="og:title" content="GoHireNow" data-react-helmet="true"/>*/}
        {/*<meta property="og:site_name" content="GoHireNow" data-react-helmet="true"/>*/}
        {/*<meta property="og:image" content="images/Capture.PNG" data-react-helmet="true" />*/}
        {/*<meta property="og:type" content="text" data-react-helmet="true"/>*/}
        {/*<meta property="og:url" content="https://www.gohirenow.com" data-react-helmet="true"/>*/}
        {/*<meta property="og:description" content="Sign in to connect to your dashboard and start browsing jobs and candidates."*/}
        {/*data-react-helmet="true"/>*/}
      </Helmet>
      <div className="hire-want-section">
        <div className="container">
          <div className="row">
            <div
              className="col-6 second-two"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <div className="largetext">
                <h2>
                  Hire A Virtual Assistant In Philippines And Get Your Work Done
                </h2>
              </div>
              <div className="smalltext">
                <p>
                  Starting at $2/hour or $325/month | Full Time
                  <br />
                  100,000+ VA Waiting To Work For You{" "}
                </p>
              </div>
              <div className="hire-work-buttons ">
                <button
                  className="btn text-uppercase"
                  onClick={() => gotohire()}
                >
                  <Link to="/register">i want to hire</Link>
                </button>
                <button
                  className="btn text-uppercase"
                  onClick={() => gotowork()}
                >
                  <Link to="/register">i want to work</Link>
                </button>
              </div>
            </div>
            <div className="col-6 pr-0">
              <div className="voted-div-outer">
                <div className="voted-div">
                  <div>
                    <div className="top">
                      <p>VOTED</p>
                      <h4>#1</h4>
                    </div>
                    <p>
                      The leader in <br /> Virtual
                      <br />
                      Assistants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="as-seen-as">*/}
      {/*    <div className="container">*/}
      {/*        <div className="row black-back ">*/}
      {/*            <h2 className="text-uppercase">as seen on</h2>*/}
      {/*            <div className="black-circle-adj">*/}
      {/*                <div>*/}
      {/*                    <img src={require("../../assets/seen1.png")} alt="" />*/}
      {/*                </div>*/}
      {/*                <div>*/}
      {/*                    <img className='bottom-fixed' src={require("../../assets/seen2.png")} alt="" />*/}
      {/*                </div>*/}
      {/*                <div>*/}
      {/*                    <img src={require("../../assets/seen3.png")} alt="" />*/}
      {/*                </div>*/}
      {/*                <div>*/}
      {/*                    <img src={require("../../assets/seen4.png")} alt="" />*/}
      {/*                </div>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      <div className="what-are-you-looking">
        <div className="container">
          <div className="row flex-column top-text align-items-center margin-9">
            <h2>What are you looking for?</h2>
            <p>Choose a category of expertise</p>
          </div>
          <div className="row ovals">
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/social-media-managers/74`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group1.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/social-media-managers/74`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Social Media
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/virtual-assistants/60`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group2.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/virtual-assistants/60`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Virtual Assistant
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/wordpress/87`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group3.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/wordpress/87`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Wordpress
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/shopify/81`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group4.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>
              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/shopify/81`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Shopify
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/graphic-designers/33`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group5.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/graphic-designers/33`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Design & Creative
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/telemarketers/75`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group6.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p
                className="pointer"
                onClick={() =>
                  history.push(
                    "/hire-virtual-assistant/social-media-managers/74"
                  )
                }
              >
                Sales
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/customer-support-representatives/64`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group7.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/customer-support-representatives/64`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Customer Service
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/marketing-strategists/70`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group8.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p
                className="pointer"
                onClick={() =>
                  history.push(
                    "/hire-virtual-assistant/marketing-strategists/70"
                  )
                }
              >
                <Link
                  to={`/hire-virtual-assistant/social-media-managers/74`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Marketing
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/blog-writers/41`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group9.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>

              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/blog-writers/41`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Writing
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/virtual-assistants/60`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group10.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>
              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/virtual-assistants/60`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Admin support
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/management-consultants/79`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group11.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>
              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/management-consultants/79`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Management
                </Link>
              </p>
            </div>
            <div className="single-oval col-md-2">
              <Link
                to={`/hire-virtual-assistant/mobile-app-developers/4`}
                className="d-flex justify-content-center"
              >
                <img
                  src={require("../../assets/group12.png")}
                  style={{ height: "65%" }}
                  alt=""
                  className="pointer"
                />
              </Link>
              <p className="pointer">
                <Link
                  to={`/hire-virtual-assistant/mobile-app-developers/4`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Web, Mobile & Software Dev
                </Link>
              </p>
            </div>
          </div>
          <div className="post-a-job-btn">
            <Link
              className="unstyled-link-improved"
              to="/hire-virtual-assistant"
            >
              <button
                className="btn text-uppercase "
                style={{ backgroundColor: "rgb(237, 123, 24)" }}
              >
                VIEW ALL SKILLS
              </button>
            </Link>
          </div>
          <div className="row flex-column top-text align-items-center margin-9">
            <h2>Why a virtual assistant</h2>
            <p>We call them virtual assistant because they work from home </p>

            <div className="video-container">
              <center>
                <iframe
                  src="https://www.youtube.com/embed/XWlvs7fjOZY?cc_load_policy=1"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </center>
            </div>
          </div>
        </div>
      </div>
      <div className="available-services">
        <div class="why-virtual container">
          <div class="row extra-margin-imp mobile-m-0">
            <section class="cstm-assistant-images">
              <div class="container">
                <h3 className="text-center service-title">
                  Monthly salary examples in the Philippines based on 40 hours a
                  week
                </h3>
                <p className="text-center cstm-assistant-images-heading-pragraph">
                  As low as <b>$325 a month</b>, you can find a full-time
                  virtual assistant. This is the greatest value you will find to
                  delegate your work.
                </p>
                <div className="row">
                  <div className="col-12">
                    <ul>
                      <li>
                        <img
                          src={require("../../assets/graphic-icon.png")}
                          alt="image"
                        />
                        <p>Graphic Designer</p>
                        <b>$350-$900</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/developers-icon.png")}
                          alt="image"
                        />
                        <p>Web Developers</p>
                        <b>$550-$1200</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/social-icon.png")}
                          alt="image"
                        />
                        <p>Social Media Experts</p>
                        <b>$350-$700</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/officeassitant-icon.png")}
                          alt="image"
                        />
                        <p>Office Assistant</p>
                        <b>$325-$500</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/shopfiy-icon.png")}
                          alt="image"
                        />
                        <p>Shopify Assistant</p>
                        <b>$350-$700</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/realstate-icon.png")}
                          alt="image"
                        />
                        <p>Real estate Assistant</p>
                        <b>$400-$900</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/FBAassitant-icon.png")}
                          alt="image"
                        />
                        <p>FBA Amazon Assistant</p>
                        <b>$400-$800</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/support-icon.png")}
                          alt="image"
                        />
                        <p>Support Assistant</p>
                        <b>$325-$500</b>
                      </li>
                      <li>
                        <img
                          src={require("../../assets/dataentry-icon.png")}
                          alt="image"
                        />
                        <p>Data Entry</p>
                        <b>$325-$400</b>
                      </li>
                      <li>
                        <p>
                          <br />
                          Hire for any scope of work...
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="why-gohirenow">
        <div className="container pt-3">
          <div className="inner-div">
            <div className="row">
              <div className="gohire-why">
                <h2>Why GoHireNow</h2>
                <p>We are the leading experts in direct outsourcing</p>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/searchglass1.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">
                        Find Experts in Minutes
                      </span>{" "}
                      <br />
                      It's so easy to find experts, post a job, get applicants
                      within minutes and hire.
                    </p>
                  </div>
                </div>
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/people3.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">
                        Create a Dream Team
                      </span>
                      <br />
                      Our experts have degrees in their expertise. It's the best
                      place to create your dream team.
                    </p>
                  </div>
                </div>
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/graph5.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">
                        Grow Your Company
                      </span>
                      <br />
                      Our talent pool will give you the leverage to grow your
                      company. We have over 1,500 skill sets.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/upping2.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">Reduce Payroll</span>
                      <br />
                      Outsourcing is the future, cut on office space, benefits,
                      equipment, insurance by hiring online.
                    </p>
                  </div>
                </div>
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/dollarhand4.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">Save Money</span>
                      <br />
                      We put you directly in contact with your worker. You
                      manage and pay your team directly.
                    </p>
                  </div>
                </div>
                <div className="black-ovals">
                  <img
                    src="/images/whygohirenow/handshake1.png"
                    className="black-ovalwhy"
                  />
                  <div className="oval-paragraph">
                    <p className="dummy-text">
                      <span className="font-weight-bold">
                        Save & Change Their Lives
                      </span>
                      <br />
                      Not only you reduce your expenses. You also create
                      opportunities for families in emerging countries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center mt-5  mb-5 ">
              <Link to="/register">
                <button className="btn text-uppercase post-a-job">
                  post a job{" "}
                </button>
              </Link>
            </div>
            <TrustedCompany />
            <div className="row flex-column align-items-center many-ovals quotes ">
              <h2>They saved a lot!</h2>
              <div className="save-a-lot">
                <div className="save-a-lot-item">
                  <img
                    src={"images/compabny/boda.jpg"}
                    className="orange-oval "
                  />
                  <div className="header">
                    <h1>MesureX</h1>
                  </div>
                  <div className="para">
                    <p>
                      We found a great app developer at a lower salary. It
                      really gave us the leverage we needed to grow our company.
                      There is no way we could have find a developer at this
                      rate in United States.
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Joseph P. Owner</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/compabny/larja.jpg"}
                    className="orange-oval "
                  />
                  <div className="header">
                    <h1>PetsDirectn</h1>
                  </div>
                  <div className="para">
                    <p>
                      We were struggling to have 24h/7 live chat support. Within
                      48 hours we hired truly amazing virtual assistants, they
                      are now doing our live chat 24/7. Not only our Live Chat
                      is always online, we have also increased our sales.{" "}
                    </p>
                  </div>
                  <div className="author">
                    <h1>- William W. CEO</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/compabny/ahmad.jpg"}
                    className="orange-oval "
                  />
                  <div className="header">
                    <h1>The Virtual Force</h1>
                  </div>
                  <div className="para">
                    <p>
                      Being a digital agency is really hard to make profit. Our
                      salaries expenses were too high. We have turned expenses
                      into profit by hiring remote employees. It really helped
                      us to go from a break even point to profitable!
                    </p>
                  </div>
                  <div className="author">
                    <h1>- M.Ahmad Owner</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/compabny/larki.jpg"}
                    className="orange-oval "
                  />
                  <div className="header">
                    <h1>Lab Sellers</h1>
                  </div>
                  <div className="para">
                    <p>
                      I am a passive income lover. I have automated all my
                      Shopify stores using virtual assistants. I went from 28
                      hours per week of work to less than 1 hour per day. They
                      manage everything, orders, inventory, management and
                      support.
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Shaina S. Owner</h1>
                  </div>
                </div>
              </div>
              <h2>We changed their lives!</h2>
              <div className="save-a-lot">
                <div className="save-a-lot-item">
                  <img
                    src={"images/01.png"}
                    className="orange-oval blue-ovals"
                  />

                  <div className="header">
                    <h1>Sales Manager</h1>
                  </div>
                  <div className="para">
                    <p>
                      As a sales manager in real estate, I have the best jobs in
                      the world! I work anytime that I can right at the comfort
                      of my home while being a full-time mom.
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Mafe F</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/02.png"}
                    className="orange-oval blue-ovals"
                  />
                  <div className="header">
                    <h1>Real Estate</h1>
                  </div>
                  <div className="para">
                    <p>
                      Working from home helps me to work smart. Value in time
                      management less travel expenses. More time for me and my
                      Family
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Julie Christie F</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/03.jpg"}
                    className="orange-oval blue-ovals"
                  />
                  <div className="header">
                    <h1>Social Media</h1>
                  </div>
                  <div className="para">
                    <p>
                      Freelancing has helped me a ton especially when it comes
                      to managing my time. I can take care and give more time to
                      my family and maintain good health
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Aldrin L</h1>
                  </div>
                </div>
                <div className="save-a-lot-item">
                  <img
                    src={"images/04.jpg"}
                    className="orange-oval blue-ovals"
                  />
                  <div className="header">
                    <h1>Affiliate Marketing</h1>
                  </div>
                  <div className="para">
                    <p>
                      Working from home enables me to gain full control of my
                      time. I can be beyond 100% productive as I pursue my
                      passion. The most important thing is that I get to spend
                      more time with my loved ones.
                    </p>
                  </div>
                  <div className="author">
                    <h1>- Yna Isabelle F</h1>
                  </div>
                </div>
              </div>
              <div className="post-a-job-btn">
                <Link to="/register">
                  <button className="btn text-uppercase post-a-job">
                    post a job
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});
export default connect(mapStateToProps, { setUserType })(MainLayout);
