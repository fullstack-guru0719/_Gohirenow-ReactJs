import React, { Component } from "react";
import { connect } from "react-redux";
import { Link,Redirect } from 'react-router-dom'
import axios from "axios";
import { apiPath } from "../../../services/config";
import PropTypes from 'prop-types';

import store from '../../../store/configureStore';
import {resetpasword} from '../actions';

import MetaTags from 'react-meta-tags';

class PassRecovery extends Component {
    state = {
        Update: "Update",
        password: "",
        isChecked: false,
        errmessage:"",
    };
    toggleChange = () => {
        this.setState({
            isChecked: !this.state.isChecked,
        });
    }
    handleSubmit = () => {
        if(this.state.password===""){
            this.setState({errmessage:"Please enter a password"})
        }
        else if(this.state.password!==""){
          this.setState({errmessage:""});
          const urlParams = new URLSearchParams(this.props.history.location.search);
          const code = urlParams.get("code");
          let newCode = encodeURIComponent(code);
          const email = urlParams.get("email");
          this.setState({ Update: "Updating" });
          axios.post(apiPath+ `/account/resetpassword?email=${email}&code=${newCode}&password=${this.state.password}`)
              .then(res => {
                  if ( res.data ) {
                      store.dispatch(resetpasword(res.data, this.props.history));
                      this.setState({ Update: "Update" });
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
        let { user, isAuthenticated } = this.props;
        let {isChecked}= this.state;
        let input=isChecked ? "text": "password";
        if (isAuthenticated) {
            if (user && user.userTypeId === 1) return <Redirect to='/dashboard' />
            if (user && user.userTypeId === 2) return <Redirect to='/dashboard-work' />
        }
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
                                <p className="text-center">Please enter a new password </p>
                                <input
                                    type={input}
                                    name="password"
                                    placeholder="Password"
                                    onChange={event =>
                                        this.setState({ password: event.target.value })
                                    }
                                    required
                                />
                                <p style={{color:"red",   textAlign: "center",
                                    paddingTop: "10px"}}>{this.state.errmessage}</p>
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

  const mapStateToProps = ({ auth,user }) => ({
    isAuthenticated: auth.isAuthenticated,
      user:auth.user
  });

  export default connect(
    mapStateToProps,
    {  }
  )(PassRecovery);

