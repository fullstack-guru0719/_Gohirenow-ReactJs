import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import axios from "axios";
import { apiPath } from "../../../services/config";
import MetaTags from 'react-meta-tags';

class PassRecovery extends Component {
  state = {
    Update: "Update",
    password: "",
      isChecked: false,
      errmessage:""
  };
    toggleChange = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }
    componentDidMount(){
        window.scroll(0,0);
        const urlParams = new URLSearchParams(this.props.history.location.search);

    }
  handleSubmit = () => {
       if(this.state.password===""){
          this.setState({errmessage:"Please enter a password"})
      }
        else if(this.state.password!==""){
           this.setState({errmessage:""});
          const urlParams = new URLSearchParams(this.props.history.location.search);

          const code = urlParams.get("code");
          const email = urlParams.get("email");
          this.setState({ Update: "Updating" });
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", this.state.password);
          formData.append("code", code);
          axios.post(
              apiPath + "/account/resetpassword",
              formData
          ).then(res => {
              this.setState({ Update: "Update" });
              if(res.data.includes("Success"))
              {
                  this.props.history.push("/sign-in");
              }

          })
              .catch(err => {
                  this.setState({ Update: "Update" });
                  if (err.response && err.response.status === 401) {
                      this.setState({ loading: false });
                  }
              });
      }
  };

  render() {
    let { dispatch, loggedIn } = this.props;
    let {isChecked}= this.state;
    let input=isChecked ? "text": "password";
    return (
        <div className="registration" id="reset-confirm">
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
          <div className="container pt-3">
            <div className="inner-div">
              <div className="row flex-column top-text">
                <h2 className="text-center">Reset your password</h2>
              </div>
              <div className="register-work-form">
                <div className="inner-pass-form">
                  <p className="text-center">Please enter1 a new password </p>
                  <input
                    type={input}
                    name="password"
                    placeholder="Password"
                    onChange={event =>
                      this.setState({ password: event.target.value })
                    }
                    required
                  />
                    <p style={{color:"red"}}>{this.state.errmessage}</p>
                  <div className="checkbox-div">
                    <input type="checkbox" checked={this.state.isChecked}
                           onChange={this.toggleChange} />
                    <p>Show password</p>
                  </div>
                </div>
                <div className="sign-up-btn">
                  <button
                    className="btn text-uppercase"
                    onClick={this.handleSubmit}
                  >
                    {this.state.Update}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ main }) => {
    return {
        loggedIn: main.loggedIn,
        userStoreData: main.userStoreData
    };
};

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(PassRecovery);
