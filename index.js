import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setUserType } from "../../containers/auth/actions";

const Footer = ({ isAuthenticated, user, history, setUserType }) => {
  const gotowork = () => {
    setUserType(2);
    history.push("/register");
  };
  const gotohire = () => {
    setUserType(1);
    // history.push("/register")
  };
  const postajobs = () => {
    if (isAuthenticated) {
      if (user && user.userTypeId === 1) {
        return (
          <Link to="/post-job">
            <p>Post a job</p>
          </Link>
        );
      } else {
        return (
          <Link to={"/search-work"}>
            <p>Browse Jobs</p>
          </Link>
        );
      }
    } else {
      return (
        <Link to={"/register"} className="pointer" onClick={() => gotohire()}>
          Post a job
        </Link>
      );
    }
  };
  const getajobs = () => {
    if (isAuthenticated) {
      if (user && user.userTypeId === 1) {
        return (
          <Link to="/search-work">
            <p>Browse Workers</p>
          </Link>
        );
      } else {
        return (
          <Link to={"/search-work"}>
            <p>Get a job</p>
          </Link>
        );
      }
    } else {
      return (
        <Link to={"/register"} className="pointer" onClick={() => gotowork()}>
          Get a job
        </Link>
      );
    }
    // isAuthenticated ? <p>Get a job</p> :
  };

  return (
    <div
      className={
        !isAuthenticated ? "footer footer-logining" : "footer footer-login"
      }
    >
      <div className="container ">
        <div className="row info-div">
          <div className="col-sm-12 col-md-3 img-div">
            <img src={require("../../assets/chaticon.png")} alt="" />
          </div>
          <div className="col-sm-12 col-md-5 content-div">
            <h1>Want more Information?</h1>
            <p>We seek to create long-term relationships built on results.</p>
          </div>
          <div className="col-sm-12 col-md-4 btn-div">
            <Link to="/contact-us">
              {" "}
              <button className="btn text-uppercase get-a-quote">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        <div className="footer-main-wrapper">
          <div className="footer-link-container row">
            <div className="footer-link-column col-xs-12 col-sm-4 col-md-5">
              <Link
                className="text-uppercase footer-link-header"
                to="how-it-works "
              >
                Company
              </Link>
              <Link to="how-it-works">About Us</Link>
              <Link to="how-it-works">Press</Link>
              <Link to="how-it-works">Our Mission</Link>
              <Link to="how-it-works">Terms of Service</Link>
              <Link to="how-it-works">Privacy Policy</Link>
            </div>
            <div className="footer-link-column col-xs-12 col-sm-4 col-md-5">
              <Link
                className="text-uppercase footer-link-header"
                to="how-it-works"
              >
                Resources
              </Link>
              <Link to="how-it-works">How it Works</Link>
              <Link to="how-it-works">Pricing</Link>
              <Link to="how-it-works">Help</Link>
              <Link to="how-it-works">Contact Us</Link>
              <Link to="how-it-works">Affiliates Program</Link>
            </div>
            <div className="footer-link-column col-xs-12 col-sm-4 col-md-2">
              <Link
                className="text-uppercase footer-link-header"
                to="how-it-works"
              >
                Browse
              </Link>
              <Link to="how-it-works">VA by Skill</Link>
              <Link to="how-it-works">VA by Country</Link>
              <Link to="how-it-works">VA Blog</Link>
              <Link to="how-it-works">Hiring Blog</Link>
              <Link to="how-it-works">Get a Job</Link>
              <Link to="how-it-works">Post a Job</Link>
            </div>
          </div>
          <div className="footer-bottom-container row">
            <div className="footer-social-container col-sm-12 col-md-6">
              <span className="footer-follow-us text-uppercase">Follow Us</span>
              <div className="footer-social-icons">
                <a href="https://www.facebook.com/gohirenowcom" target="_blank">
                  {" "}
                  <i className="fa fa-facebook" />{" "}
                </a>
                <a href="https://twitter.com/GoHireNow" target="_blank">
                  <i className="fa fa-twitter" />{" "}
                </a>
                <a href="https://www.instagram.com/gohirenow/" target="_blank">
                  <i className="fa fa-instagram" />
                </a>
                <a href="https://www.linkedin.com/gohirenow/" target="_blank">
                  <i className="fa fa-linkedin" />
                </a>
                <a href="https://www.youtube.com/gohirenow/" target="_blank">
                  <i className="fa fa-youtube-play" />
                </a>
              </div>
            </div>
            <div className="footer-copy-right col-sm-12 col-md-6">
              <span>Copyright © 2020 - GoHireNow All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //     <div className={!isAuthenticated ? "footer footer-logining" : "footer footer-login"}>
  //         <div className="container ">
  //             <div className="row info-div">
  //                 <div className="col-sm-3 img-div">
  //                     <img src={require("../../assets/chaticon.png")} alt="" />
  //                 </div>
  //                 <div className="col-sm-5 content-div">
  //                     <h1>Want more Information?</h1>
  //                     <p>
  //                         We seek to create long-term relationships built on results.
  //                     </p>
  //                 </div>
  //                 <div className="col-sm-4 btn-div">
  //                     <Link to="/contact-us">   <button className="btn text-uppercase get-a-quote">Contact Us</button></Link>
  //                 </div>
  //             </div>
  //             <div className="footer-mid">
  //                 <div className="row footer-anchors">
  //                     <div className="col-sm-3">
  //                     </div>
  //                     <div className="col-sm-2">
  //                         <Link to="how-it-works">How it works</Link>
  //                     </div>
  //                     <div className="col-sm-2">
  //                         {
  //                             postajobs()
  //                         }

  //                     </div>
  //                     <div className="col-sm-2">
  //                         <a href="https://www.gohirenow.com/virtual-assistants/" target="_blank">Blog</a>
  //                     </div>
  //                     <div className="col-sm-3">
  //                     </div>
  //                 </div>
  //                 <div className="row footer-anchors">
  //                     <div className="col-sm-3">
  //                     </div>
  //                     <div className="col-sm-2">
  //                         {
  //                             isAuthenticated && user && user.userTypeId === 1 &&
  //                             <Link to="/pricing">Pricing</Link>
  //                         }
  //                         {
  //                             isAuthenticated && user && user.userTypeId === 2 &&
  //                             <p>Pricing</p>
  //                         }
  //                         {
  //                             !isAuthenticated &&
  //                             <Link to="/pricing">Pricing</Link>
  //                         }
  //                     </div>
  //                     <div className="col-sm-2">
  //                         {
  //                            getajobs()
  //                         }
  //                     </div>
  //                     <div className="col-sm-2">
  //                         <Link to="/contact-us">Contact us</Link>
  //                     </div>
  //                     <div className="col-sm-3">
  //                     </div>
  //                 </div>
  //             </div>
  //             <div className="footer-bottom">
  //                 <div className="row">
  //                     <div className="cont-center">
  //                         <hr />
  //                         <p>Copyright © 2020 - GoHireNow All Rights Reserved.</p>
  //                         <p>276 5th Avenue Suite 704-3182 New York, NY 10001</p>

  //                     </div>
  //                 </div>
  //                 <div className="row">
  //                     <div className="cont-center">
  //                         <div className="footer-icon">
  //                             <a href="https://www.facebook.com/gohirenowcom" target="_blank" > <i className="fa fa-facebook" /> </a>
  //                             <a href="https://twitter.com/GoHireNow" target="_blank"><i className="fa fa-twitter" /> </a>
  //                             <a href="https://www.instagram.com/gohirenow/" target="_blank"><i className="fa fa-instagram" /></a>
  //                         </div>
  //                     </div>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  // )
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { setUserType })(withRouter(Footer));
