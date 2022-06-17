import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Spinner from "../../../components/spinner/index";
import { register, GetCountriesList } from "../actions";
import { setAlert } from "../../alerts/actions";
import queryString from "query-string";
import MetaTags from "react-meta-tags";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";

const Register = ({
  register,
  usertype,
  setAlert,
  loading,
  isAuthenticated,
  user,
  GetCountriesList,
  countires,
  regmessage,
  history,
}) => {
  const [cookies] = useCookies(["LandingPage"]);
  const [formData, setFormData] = useState({
    cname: "",
    fullname: "",
    email: "",
    country: "",
    countryId: null,
    password: "",
    userType: usertype,
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    const { location } = history;
    const currentUrl = queryString.parse(location.search);
    if (currentUrl.account && currentUrl.account === "worker") {
      renderRegisterType(2);
    }
    window.scroll(0, 0);
    GetCountriesList();

    if (regmessage !== "") {
      setErr(regmessage);
    }
  }, [GetCountriesList, regmessage]);

  const {
    cname,
    fullname,
    email,
    country,
    countryId,
    password,
    userType,
  } = formData;

  const renderRegisterType = (type) => {
    setFormData({
      ...formData,
      userType: type,
      cname: "",
      fullname: "",
    });
    setErr("");
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const re = new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$");
    const isOkpass = re.test(password);

    if (
      parseInt(userType) === 1 &&
      (email === "" || password === "" || cname === "" || countryId === null)
    ) {
      setErr("All fields must be filled");
      // setAlert("All fields must be filled", 'danger');
    } else if (
      parseInt(userType) === 2 &&
      (email === "" || password === "" || fullname === "" || countryId === null)
    ) {
      setErr("All fields must be filled");
      // setAlert("All fields must be filled", 'danger');
    } else if (email && !email.includes("@")) {
      setErr("Invalid email address");
      // setAlert("check your email", 'danger');
    } else {
      setErr("");
      let cookieL;
      if (cookies && cookies.LandingPage) cookieL = cookies.LandingPage;
      userType === 1
        ? register({
            cname,
            email,
            country,
            countryId,
            password,
            userType,
            cookieL,
          })
        : register({
            fullname,
            email,
            country,
            countryId,
            password,
            userType,
            cookieL,
          });
    }
  };

  const handleChangeSelect = (event) => {
    if (event.target.value !== "") {
      countires.map((item) => {
        if (item.name === event.target.value) {
          setFormData({ ...formData, countryId: item.id, country: item.name });
        }
      });
    } else {
      setFormData({ ...formData, countryId: null, country: "" });
    }
  };

  if (isAuthenticated) {
    let payments = !!localStorage.getItem("plan");
    if (payments && user.userTypeId === 1) {
      return <Redirect to="/payment-details" />;
    } else {
      if (user && user.userTypeId === 2) {
        const { location } = history;
        const currentUrl = queryString.parse(location.search);
        const backto = currentUrl.backto;
        return (
          <Redirect
            to={backto ? `/edit-profile?backto=${backto}` : "edit-profile"}
          />
        );
      } else if (user && user.userTypeId === 1)
        return <Redirect to="/post-job" />;
    }
  }

  return (
    <Fragment>
      {/*<Helmet>*/}
      {/*<title>GoHireNow - Sign Up </title>*/}
      {/*<meta property="og:title" content="GoHireNow" data-react-helmet="true"/>*/}
      {/*<meta property="og:site_name" content="GoHireNow" data-react-helmet="true"/>*/}
      {/*<meta property="og:image" content="images/Capture.PNG" data-react-helmet="true" />*/}
      {/*<meta property="og:type" content="text" data-react-helmet="true"/>*/}
      {/*<meta property="og:url" content="https://www.gohirenow.com" data-react-helmet="true"/>*/}
      {/*<meta property="og:description" content="Create a FREE account today, it takes only 30 seconds."*/}
      {/*data-react-helmet="true"/>*/}
      {/*</Helmet>*/}

      <MetaTags>
        <title>GoHireNow - Sign up</title>
        <meta name="description" content="register description." />
        {/*<meta property="og:site_name" content="sign_in" />*/}
        <meta property="og:url" content="sign_up" />
        <meta property="og:description" content="blach blach " />
      </MetaTags>

      <div className="registration">
        <div className="container pt-3">
          <div className="inner-div" style={{ padding: "50px 50px" }}>
            <div className="row flex-column top-text ">
              <h2 className="text-center">{`${
                userType === 1
                  ? "Sign up to Browse or Post a free job!"
                  : "Find Your Dream Job Today"
              }`}</h2>
              <p className="text-center">{`${
                userType === 1
                  ? "It only takes 2 minutes to post your job and start browsing candidates."
                  : "You are one step away of getting an online job from home."
              }`}</p>
            </div>
            <div className="register-form">
              <div className="hire-work-buttons ">
                <a
                  className={`${userType === 1 ? "active" : "inactive"}`}
                  onClick={() => renderRegisterType(1)}
                >
                  I want to hire
                </a>
                <a
                  className={`${userType === 2 ? "active" : "inactive"}`}
                  onClick={() => renderRegisterType(2)}
                >
                  I want to work
                </a>
              </div>
              <div className="inner-form">
                {userType === 1 ? (
                  <input
                    type="text"
                    placeholder="Company Name"
                    name="cname"
                    onChange={(e) => onChange(e)}
                    value={formData.cname}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullname"
                    onChange={(e) => onChange(e)}
                    value={formData.fullname}
                    required
                  />
                )}
                <input
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={(e) => onChange(e)}
                  required
                />

                <select
                  placeholder="Conutry"
                  name="countryId"
                  onChange={(e) => handleChangeSelect(e)}
                >
                  <option value="">Choose your country</option>
                  {countires.length > 0 &&
                    countires.map((item, index) => {
                      return <option key={index}>{item.name}</option>;
                    })}
                </select>

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => onChange(e)}
                  value={formData.password}
                  required
                />
              </div>
              <p style={{ color: "red" }}>{err}</p>
              <div className="sign-up-btn">
                <button
                  className="btn text-uppercase"
                  type="submit"
                  onClick={(e) => onSubmit(e)}
                >
                  {" "}
                  {loading ? <Spinner /> : "SIGN UP"}{" "}
                </button>
              </div>
              <div className="already-member">
                <p>
                  Already a member? <Link to="/sign-in">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    loading: state.auth.loading,
    countires: state.auth.countires,
    regmessage: state.auth.regmessage,
    usertype: state.auth.usertype,
  };
};

export default connect(mapStateToProps, {
  register,
  setAlert,
  GetCountriesList,
})(Register);
