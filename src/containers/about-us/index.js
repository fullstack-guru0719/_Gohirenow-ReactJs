import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiPath } from "../../services/config";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

const AboutUs = ({ loggedIn }) => {
  return (
    <div
      className={loggedIn ? "registration greybf" : "registration whitebg"}
      id="aboutus"
    >
      <Helmet>
        <title>GoHireNow - About Us</title>
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
          content="Our dedicated support team is waiting for your request. We answer within the next 24 hours!"
          data-react-helmet="true"
        />
      </Helmet>
      <div className="container pt-3">
        <div className="inner-div">
          <div className="row flex-column top-div ">
            <h2 className="text-center head">The Company</h2>
            <p className="text-center">
              GoHireNow is an all-in-one recruiting platform for small and
              medium-sized businesses. With thousands of talented workers around
              the world ready to grow your business, we are the one-stop for all
              your online recruiting needs. Founded in 2019 and growing
              successfully in 2020, GoHireNow is setting a high expectation for
              2021. We are a 100% founder-owned company and we thrive by hiring
              our own online resources.
            </p>
          </div>

          <div className="row center-div">
            <div className="col-sm-12 col-lg-7">
              <h3 className="founder-head">The Founder</h3>
              <p>
                GoHireNow was created by Ben Tessier who had an office with 15
                employees and costing him more than $120,000 every month in
                salaries. At some point he had to find a better way to grow his
                business, he couldn't afford high salaries and low availability
                of great candidates.
              </p>
              <p>
                After some research, he started to hire workers online from all
                over the world, especially in emerging countries. "This really
                helped us with the growth of our company". Unfortunately, there
                was one problem that needed to be solved, it was really
                difficult to find and manage candidates online. That's when he
                decided to start GoHireNow, to offer a better solution to other
                entrepreneurs.
              </p>
            </div>
            <div className="col-sm-12 col-lg-5 text-center avatar">
              <img
                src={require("../../assets/Ben.png")}
                style={{ width: "100%" }}
              />
              <span className="signature">Ben Signature</span>
              <span className="text-uppercase founder-footer">
                Gohirenow Founder
              </span>
            </div>
          </div>
          <div className="row flex-column footer-div ">
            <h2 className="text-center head">The Mission</h2>
            <p className="text-center">
              GoHireNow wants to bring the world together and remove boundaries
              set by distance. By allowing entrepreneurs to hire workers around
              the world, we not only provide access to better salaries and
              workers but we also help emerging countries to find work. There
              are so many talented workers with university degrees fluent in
              English around the world that we must have a platform to connect
              with them. We also want to be the all-in-one platform for all your
              overseas outsourcing needs, including hiring, managing and paying
              your workers. Everybody deserves a job so do entrepreneurs deserve
              talented workers with lower salaries.
              <br />
              <br />
              At GoHireNow, we thrive for a better world and changing people's
              lives!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    loggedIn: auth.isAuthenticated,
    userStoreData: auth.user,
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
// export default connect(
//     mapStateToProps,
//     mapDispachToProps
// )(PassRecovery);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispachToProps)
)(AboutUs);
