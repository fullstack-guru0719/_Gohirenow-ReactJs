import React, { Component, Fragment, useEffect, useState } from "react";
import TrustedCompany from "../../components/trustedcompany/index";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setAlert } from "../alerts/actions";

import { compose } from "redux";

import { withRouter } from "react-router-dom";
import { setUserType } from "../auth/actions";

import MetaTags from "react-meta-tags";

import { Helmet } from "react-helmet";
import Faq from "../../components/faq";

const Howitworks = ({ isAuthenticated, user, setUserType, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    work: false,
    hire: true,
  });
  const { hire, work } = formData;

  const gotowork = () => {
    setUserType(2);
    history.push("/register");
  };
  const gotohire = () => {
    setUserType(1);
    history.push("/register");
  };
  return (
    <Fragment>
      <Helmet>
        <title>GoHireNow - How it Works</title>
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
          content="Learn how GoHireNow works, find out how we connect companies with candidates!"
          data-react-helmet="true"
        />
        <meta property="description" content="How it workss" />
      </Helmet>
      <div
        className={
          isAuthenticated
            ? "how-it-works how-it-works-page greybg"
            : "how-it-works how-it-works-page whitebg"
        }
      >
        <div className="container pt-3">
          <div className="inner-div">
            <div className="row flex-column top-text ">
              <h2 className="text-center">
                The Fastest Way To Find Virtual Assistants
              </h2>
              <h4 className="text-center">100,000+ VA are waiting for you!</h4>
              <div className="hire-work-buttons ">
                <button
                  className={
                    hire === true
                      ? "btn text-uppercase activebtn"
                      : "btn text-uppercase "
                  }
                  onClick={() => setFormData({ hire: true, work: false })}
                >
                  i want to hire
                </button>
                <button
                  className={
                    work === true
                      ? "btn text-uppercase activebtn"
                      : "btn text-uppercase "
                  }
                  onClick={() => setFormData({ work: true, hire: false })}
                >
                  i want to work
                </button>
              </div>
            </div>
            {work && (
              <div className="works-content">
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksWork/create-account.png"
                        alt="create-account.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Create an account</h2>
                      <p>
                        It takes 20 seconds to create an account and it's
                        totally free. Once you create account you can start
                        applying on thousands of jobs waiting for you.
                        Everything is totally free for our workers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksWork/craft-ur-profile.png"
                        alt="craft-ur-profile.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Craft your profile</h2>
                      <p>
                        You can create a custom profile with your picture and
                        your portfolio. You can also specify your desired
                        salary, education, availability and much more. Make sure
                        to put as much information as you can.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img src="/images/howItWorksWork/job.png" alt="job.png" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Browse jobs</h2>
                      <p>
                        Once your profile is looking awesome, start browsing
                        jobs. You can search for jobs by the expertise and you
                        will get job offers on your dashboard. Follow companies
                        and set alerts to receive daily jobs
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksWork/apply.png"
                        alt="apply.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Apply</h2>
                      <p>
                        Once you have found that perfect job, you can simply
                        apply with a click of a button. Attach your resume,
                        write your introduction and you're done. The company
                        will review your application.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksWork/message-and-discuss.png"
                        alt="message-and-discuss.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Message & discuss</h2>
                      <p>
                        Our real-time chat makes it really easy to discuss with
                        your future employer. We do not have any restriction for
                        you to exchange contacts or use any different platform
                        to communicate.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksWork/hire-directly.png"
                        alt="hire-directly.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Get hired directly!</h2>
                      <p>
                        We take no commissions. You get hired, manage and pay
                        directly by your employer. This is the beauty of online
                        jobs! Work from home and change your life today!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {hire && (
              <div className="works-content">
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/create-an-account.png"
                        alt="create-an-account.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Create an account</h2>
                      <p>
                        It takes 20 seconds to create an account and it's{" "}
                        <b>totally free</b>. Once you create an account you can
                        put your company logo and your company description.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/post-a-job.png"
                        alt="post-a-job.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Post a job</h2>
                      <p>
                        Posting a job is really <b>easy and free</b>. It takes
                        about two minutes to create a great job post. All you
                        need is a title, description, skill sets, and the
                        offered salary.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/recieve-app.png"
                        alt="recieve-app.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Receive applicants </h2>
                      <p>
                        <b>Within minutes</b> you will start receiving
                        applicants. You can screen applicants by skills,
                        application date and experience. You can also hide the
                        less interesting candidates.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/recieve-app.png"
                        alt="recieve-app.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Review their profiles</h2>
                      <p>
                        Each applicant has a <b>detailed profile</b>. You can
                        review their country, desired salary, description,
                        education, skill sets, and much more information.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/message-and-discuss.png"
                        alt="message-and-discuss.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="cont-div">
                      <h2>Message & discuss</h2>
                      <p>
                        Our <b>real-time chat</b> makes it really easy to
                        discuss with your candidates. It's the best way to know
                        more about your candidates expectations!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="sota row ">
                  <div className="col-sm-6">
                    <div className="pic-div">
                      <img
                        src="/images/howItWorksEmployer/hire-directly.png"
                        alt="hire-directly.png"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mobile-pt-0 cont-div">
                      <h2>Hire directly!</h2>
                      <p>
                        We take <b>$0 commissions</b>. You hire and manage
                        directly your workers. This is the beauty of online
                        jobs! Start saving today and get your work dones!
                      </p>
                    </div>
                  </div>
                </div>
                <Faq />
              </div>
            )}
            <div className="post-a-job-btn">
              {isAuthenticated ? (
                <Link to={user.userTypeId === 1 ? "/post-job" : "/Search-work"}>
                  <button className="btn text-uppercase">
                    {hire === true ? "Post a Job" : "Get a Job"}
                  </button>
                </Link>
              ) : (
                <div>
                  {hire !== true ? (
                    <Link to="/register">
                      <button
                        onClick={() => gotowork()}
                        className="btn text-uppercase"
                      >
                        Get a Job
                      </button>
                    </Link>
                  ) : (
                    <Link to="/register">
                      <button
                        onClick={() => gotohire()}
                        className="btn text-uppercase"
                      >
                        Sign Up
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
            <TrustedCompany />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ auth, user }) => ({
  isAuthenticated: auth.isAuthenticated,
  user: auth.user,
});

// export default connect(
// mapStateToProps,
// { setAlert }
// )(Howitworks);
//
//

export default compose(
  withRouter,
  connect(mapStateToProps, { setAlert, setUserType })
)(Howitworks);
