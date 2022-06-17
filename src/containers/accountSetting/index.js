import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { apiPath } from "../../services/config";
import placeholder1 from "../../assets/img_avatar.svg";
import placeholder2 from "../../assets/employer_icon.svg";
import UploadResume from "./UploadResume";
import Modal from "react-responsive-modal";
import cookie from "react-cookies";
import ACTIONS from "../../store/actionTypes";
import Spinner from "../../components/spinner/index";
import store from "../../store/configureStore";
import { setAlert } from "../alerts/actions";
import { logout } from "../auth/actions";
import { loadUser } from "../auth/actions";
import Swal from "sweetalert2";
import MetaTags from "react-meta-tags";

class AccountSettings extends Component {
  state = {
    userName: "",
    countryId: "",
    profileimage: null,
    countriesList: [],
    Save: false,
    email: "",
    isLoading: true,
    open: false,
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
    passwordbtn: false,
    isChecked: false,
    imageprocess: true,
    messageerr: "",
  };
  toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };
  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    store.dispatch(loadUser());
    axios.get(apiPath + "/lookup/countries").then((res) => {
      this.setState({ countriesList: res.data });
    });

    // let { loggedIn } = this.props;
    // if (!loggedIn) {
    // localStorage.setItem("route", this.props.location.pathname);
    // this.props.history.push("/sign-in");
    // }
    this.getProfileInfo();
  }
  getProfileInfo = () => {
    this.setState({ imageprocess: true });
    axios
      .get(apiPath + `/Account/profile`)
      .then((res) => {
        this.setState({
          userName: res.data.fullName || res.data.companyName || "",
          countryId: res.data.countryId,
          email: this.props.user && this.props.user.email,
          profileimage: res.data.profilePicturePath
            ? res.data.profilePicturePath
            : "",
          isLoading: false,
          imageprocess: false,
        });
      })
      .catch((err) => {});
  };
  handlesubmit = (e) => {
    e.preventDefault();
    this.setState({ Save: true });
    // const formData = {
    //     "userId": this.props.user.userTypeId,
    //     "fullName":  this.state.userName,
    //     "emailAddress":  this.state.email,
    //     "countryId": this.state.countryId
    // }
    const formData = new FormData();
    this.props.user.userTypeId === 1
      ? formData.append("CompanyName", this.state.userName)
      : formData.append("FullName", this.state.userName);
    formData.append("UserId", this.props.user.userId);
    formData.append("CountryId", this.state.countryId);
    formData.append("EmailAddress", this.state.email);
    axios
      .post(apiPath + `/Account/update`, formData)
      .then((res) => {
        // setAlert(('Account updated', 'success'))
        this.setState({ Save: false });
        this.props.user.userTypeId === 1
          ? this.props.history.push("/profile-hire")
          : this.props.history.push("/profile-work");
        store.dispatch(loadUser());
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          this.setState({ Save: false, messageerr: err.response.data });
        }

        this.setState({ Save: false });
      });
  };
  handleDelete = (e) => {
    Swal.fire({
      title:
        "Are you sure you want to permanently delete your account and lose all your data?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ED7B18",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const { user } = this.props;
        if (user && user.userId) {
          const formData = new FormData();
          formData.append("userId", user.userId);
          formData.append("roleId", user.userTypeId);
          axios
            .post(apiPath + "/Account/deleteaccount/", formData)
            .then((res) => {
              this.props.logout && this.props.logout();
            })
            .catch((err) => {
              console.log("delete response err", err);
            });
        }
      }
    });
  };
  handleCountryChange = (event) => {
    this.setState({ countryId: event.target.value });
  };
  changepassword() {
    this.setState({ passwordbtn: true });
    if (this.state.oldpassword === "") {
      this.setState({ passwordbtn: false });
      this.setState({ errorshow: "Please fill all the fields" });
    } else if (this.state.newpassword === "") {
      this.setState({ passwordbtn: false });
      this.setState({ errorshow: "Please match your new password" });
    } else if (this.state.confirmpassword === "") {
      this.setState({ passwordbtn: false });
      this.setState({ errorshow: "Please match your new password" });
    } else if (this.state.newpassword !== this.state.confirmpassword) {
      this.setState({ passwordbtn: false });
      this.setState({ errorshow: "Please match your new password" });
    }
    // else if(this.state.oldpassword === this.state.newpassword){
    //     this.setState({passwordbtn:false})
    //     this.setState({errorshow: "Please enter a new password"});
    // }
    else {
      // const formData =  {
      //     "userId":this.props.user.userTypeId,
      //     "FullName":  this.state.userName,
      //     "emailAddress":  this.state.email,
      //     "oldPassword": this.state.oldpassword,
      //     "newPassword": this.state.newpassword,
      //     "countryId": this.state.countryId
      // }
      const formData = new FormData();
      formData.append("FullName", this.state.userName);
      formData.append("UserId", this.props.user.userTypeId);
      formData.append("CountryId", this.state.countryId);
      formData.append("EmailAddress", this.state.email);
      formData.append("oldPassword", this.state.oldpassword);
      formData.append("newPassword", this.state.newpassword);
      // formData.append("fullName",);
      // formData.append("userId", this.props.user.userTypeId);
      // formData.append("countryId", );
      // formData.append("emailAddress",);
      // formData.append("oldPassword", );
      // formData.append("newPassword", );
      axios
        .post(apiPath + `/Account/update`, formData)
        .then((res) => {
          this.onCloseModal();
          this.setState({ passwordbtn: false });
          this.setState({ menushow: false });
          Swal.fire("", `Password has been updated successfully`, "success");

          // localStorage.clear();
          //   if(!localStorage.token && !localStorage.user){
          // this.props.history.push('/sign-In')
          // }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
          }
          this.setState({ passwordbtn: false });
          this.setState({ errorshow: err.response.data });
        });
    }
  }

  render() {
    let {
      countriesList,
      isLoading,
      profileimage,
      open,
      isChecked,
    } = this.state;
    let { dispatch, isAuthenticated } = this.props;

    let placeholder =
      this.props.user && this.props.user.userTypeId === 2
        ? placeholder1
        : placeholder2;
    let image = !isLoading && profileimage ? profileimage : placeholder;

    let input = isChecked ? "text" : "password";
    return (
      <div
        className={isAuthenticated ? "registration greybf" : "registration "}
        id="account-setting"
      >
        {/*<MetaTags>*/}
        {/*<title>GoHireNow</title>*/}
        {/*<meta name="description" content="" />*/}
        {/*</MetaTags>*/}
        <div className="container ">
          <div
            className="row flex-column top-text  "
            style={{ padding: "5% 0px 2% 0px" }}
          >
            <h2>Account Settings</h2>
          </div>
          {isLoading ? (
            <div className="row">
              <div className="col-md-12 pl-0 custom-padd">
                <Spinner />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6 custom-padd">
                <div className="register-form">
                  <div className="inner-form">
                    <input
                      type="text"
                      placeholder={
                        this.props.user &&
                        parseInt(this.props.user.userTypeId) === 2
                          ? "Full Name"
                          : "Company Name"
                      }
                      name="cname"
                      value={this.state.userName}
                      onChange={(e) =>
                        this.setState({ userName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Email Address"
                      name="email"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      //   onChange={e => this.setState({ email: e.target.value })}
                    />
                    <select
                      placeholder="Country"
                      name="country"
                      onChange={(e) =>
                        this.setState({ countryId: e.target.value })
                      }
                      value={this.state.countryId}
                      // onChange={<this className="handleCountryChange"></this>}
                    >
                      {countriesList.length > 0 &&
                        countriesList.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                    </select>

                    <button
                      className="btn special-btn"
                      onClick={this.onOpenModal}
                    >
                      Change Password
                    </button>
                    <div>
                      <Modal
                        classNames={{ modal: "modal-popup" }}
                        open={open}
                        onClose={this.onCloseModal}
                        center
                      >
                        <h4
                          style={{
                            width: "100%",
                            marginBottom: "18px",
                          }}
                        >
                          Change Password
                        </h4>
                        <input
                          type={input}
                          onChange={(e) =>
                            this.setState({ oldpassword: e.target.value })
                          }
                          placeholder="Old Password"
                          required
                        />
                        <input
                          type={input}
                          onChange={(e) =>
                            this.setState({ newpassword: e.target.value })
                          }
                          placeholder="New Password"
                          required
                        />
                        <input
                          type={input}
                          onChange={(e) =>
                            this.setState({
                              confirmpassword: e.target.value,
                            })
                          }
                          placeholder="Confirm Password"
                          required
                        />
                        <div className="d-flex justify-content-start align-items-center w-100">
                          <input
                            type="checkbox"
                            style={{ width: "6%", height: "55%" }}
                            className="mb-0"
                            checked={this.state.isChecked}
                            onChange={this.toggleChange}
                          />
                          <p className="mb-0">Show password</p>
                        </div>
                        <p className="redcolor">{this.state.errorshow}</p>
                        <button
                          className="btn text-uppercase"
                          onClick={() => this.changepassword()}
                        >
                          {!this.state.passwordbtn ? "Save" : <Spinner />}
                        </button>
                      </Modal>
                    </div>
                  </div>
                  <div className="sign-up-btn">
                    <p className="text-center" style={{ color: "Red" }}>
                      {this.state.messageerr}
                    </p>
                    <button
                      className="btn text-uppercase"
                      type="submit"
                      onClick={this.handlesubmit}
                    >
                      {!this.state.Save ? "Save" : <Spinner />}
                    </button>
                    <button
                      className="btn text-uppercase btn-danger mt-5"
                      onClick={this.handleDelete}
                    >
                      Delete my account
                    </button>
                  </div>
                  <div className="already-member"></div>
                </div>
              </div>
              <div className="col-md-6 custom-padd">
                <div
                  className="right-side"
                  style={{
                    height: "83%",
                  }}
                >
                  {this.state.imageprocess ? (
                    <Spinner />
                  ) : (
                    <div className="profile-image">
                      <img src={image} alt="" />
                    </div>
                  )}

                  <UploadResume getProfileInfo={this.getProfileInfo} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    user: auth.user,
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    dispatch: dispatch,
  };
};
export default connect(mapStateToProps, { setAlert, logout })(AccountSettings);
