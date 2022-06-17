import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiPath } from "../../services/config";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import MetaTags from "react-meta-tags";

import { Helmet } from "react-helmet";

const initialState = {
  fullName: "",
  email: "",
  message: "",
  title: "",
  fullNameErr: "",
  emailErr: "",
  messageErr: "",
  titleErr: "",
  contactpageonoff: "",
  btnSend: "Send",
};

class PassRecovery extends Component {
  state = initialState;
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { contactpageonoff } = this.state;
    const { contactpageonoff: prevContactpageonoff } = prevState;
    if (
      contactpageonoff === "success" &&
      contactpageonoff !== prevContactpageonoff
    ) {
      window.scrollTo(0, 0);
    }
  }

  handleChange = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    });
  };

  validate = () => {
    let fullNameErr = "";
    let emailErr = "";
    let messageErr = "";
    let titleErr = "";
    if (!this.state.fullName) {
      fullNameErr = "Please add your full name.";
    }
    if (!this.state.message) {
      messageErr = "Please add your message";
    }
    if (!this.state.title) {
      titleErr = "Please add a subject title.";
    }
    if (this.state.email === "") {
      emailErr = "Please add an Email Address ";
    }
    if (this.state.email !== "" && !this.state.email.includes("@")) {
      emailErr = "Please add a right Email Address";
    }
    if (fullNameErr || emailErr || messageErr || titleErr) {
      this.setState({ fullNameErr, emailErr, messageErr, titleErr });
      return false;
    }
    return true;
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.setState({ btnSend: "Sending" });

      const formData = {
        id: 2,
        name: this.state.fullName,
        email: this.state.email,
        title: this.state.title,
        comment:
          this.state.message +
          "<br/>" +
          navigator.userAgent +
          (this.props.loggedIn &&
          this.props.userStoreData &&
          this.props.userStoreData.userId
            ? `<br/>uid: ${this.props.userStoreData.userId}`
            : ""),
      };
      //   formData.append('id', 2);
      //   formData.append('Name', this.state.fullName);
      //   formData.append('Email', this.state.email);
      //   formData.append('Title', this.state.title);
      //   formData.append('Comment', this.state.message);
      axios
        .post(
          apiPath + "/Home/ContactUs",
          formData
          // "Home/ContactUs?Id=3&Name="+this.state.fullName+"&Email="+this.state.email+"&Title="+this.state.title+"&Comment="+this.state.message
        )
        .then((res) => {
          if (res.data === "Success") {
            this.setState({ btnSend: "Send" });
            this.setState({ contactpageonoff: "success" });
          }
        })
        .catch((err) => {
          this.setState({ btnSend: "Send" });
          if (err.response && err.response.status === 401) {
            this.setState({ invalidMessage: true, loading: false });
            window.confirm("email or password is incorrect");
          }
        });
    }
  };

  render() {
    let { dispatch, loggedIn } = this.props;
    return (
      <div
        className={loggedIn ? "registration greybf" : "registration whitebg"}
        id="contact"
      >
        <Helmet>
          <title>GoHireNow - Contact Us</title>
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
            <div className="row flex-column top-text ">
              <h2 className="text-center head">Contact Us</h2>
              <p className="text-center">
                Feel free to contact us with any questions or requests you may
                have.
              </p>
            </div>
            {this.state.contactpageonoff !== "success" && (
              <div className="register-work-form">
                <form className="inner-pass-form">
                  <div>
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="fullName"
                        value={this.state.fullName}
                        onChange={this.handleChange}
                      />
                      <div className="form-error">{this.state.fullNameErr}</div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Email Address"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                      <div className="form-error">{this.state.emailErr}</div>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Subject"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                  <div className="form-error">{this.state.titleErr}</div>
                  <textarea
                    placeholder="Message"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}
                  />
                  <div className="form-error">{this.state.messageErr}</div>
                </form>
                <div className="sign-up-btn">
                  <button
                    className="btn text-uppercase"
                    onClick={this.handleSubmit}
                  >
                    {this.state.btnSend}
                  </button>
                </div>
                <div className="already-member contact-us">
                  <p>Our team answers support ticket within 24 hours.</p>
                </div>
              </div>
            )}
            {this.state.contactpageonoff === "success" && (
              <div className="already-member">
                <h1 className="contact-form-fw mobile-mb-0 received-contact-req text-center">
                  We have received your request.
                </h1>
                <p className="contact-form-fw">
                  Our team answers support ticket within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

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
)(PassRecovery);
