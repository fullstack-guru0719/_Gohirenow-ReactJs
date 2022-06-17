import axios from "axios";
import { setAlert } from "../alerts/actions";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  GET_COUNTIRES_LIST,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_JOB_POST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from "../../store/actionTypes";
import { apiPath } from "../../services/config";
import setAuthToken from "../../utils/setAuthToken";
import { endChat } from "../../utils/pusherConfig";
import { loadHelpCrunch } from "../../utils/helpCrunch";
import { setUpChat } from "../../utils/pusherConfig";
import queryString from "query-string";
import LinkedInTag from "react-linkedin-insight";
import ReactPixel from "react-facebook-pixel";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Load User

export const setUserType = (value) => async (dispatch) => {
  dispatch({
    type: "setusertype",
    payload: value,
  });
};
export const loadUser = (history) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(`${apiPath}/account/detail`);
    if (res.status === 200) {
      setUpChat();
      if (res.data && res.data.userTypeId === 1) {
        if (
          window.document.getElementById("hc-script") &&
          typeof window.showChatWidget === "function"
        ) {
          window.showChatWidget();
        } else {
          loadHelpCrunch();
        }
      }

      localStorage.setItem("user", JSON.stringify(res.data));
      if (history) {
        const { location } = history;
        const currentUrl = queryString.parse(location.search);
        const backto = currentUrl.backto;
        if (backto) {
          history.push(backto);
        }
      }
      dispatch({
        type: USER_LOADED,
      });
    }
  } catch (err) {
    // dispatch(setAlert("Network Error ", 'danger'));
    dispatch({
      type: AUTH_ERROR,
      payload: err,
    });
  }
};

// Register User
export const register = ({
  email,
  password,
  countryId,
  userType,
  fullname,
  cname,
  cookieL: LandingPage,
}) => async (dispatch) => {
  dispatch({
    type: REGISTER_REQUEST,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let formData = {};
  if (userType === 1) {
    formData = {
      email: email,
      password: password,
      countryId: countryId,
      userType: userType,
      companyName: cname,
    };
  } else {
    formData = {
      email: email,
      password: password,
      countryId: countryId,
      userType: userType,
      fullName: fullname,
    };
  }

  if (LandingPage) formData = { ...formData, RefUrl: LandingPage };

  axios
    .post(`${apiPath}/Account/register`, formData, config)
    .then((res) => {
      if (res.status === 200) {
        if (userType === 1) {
          LinkedInTag.init("1773913");
          LinkedInTag.track("3107516");
        }
        ReactPixel.track("CompleteRegistration");
        window.gtag("event", "conversion", {
          send_to: "AW-693012316/JrvLCP3AhrYBENyOusoC",
        });

        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
        dispatch(loadUser());
      }
      // else if(res.status === 400){
      //     dispatch({
      //         type: REGISTER_FAIL,
      //         payload:res.data
      //     });
      // }
    })
    .catch((err) => {
      dispatch({
        type: REGISTER_FAIL,
        payload: "Email already exists",
      });
    });

  // setAlert(`Welcome ${userType === 1 ? cname : fullname }`, 'success')
};

//Login User

export const resetpasword = (token, history) => async (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: token,
  });

  dispatch(loadUser());
  dispatch({
    type: LOGIN_FAIL,
    payload: "",
  });
};
export const login = (email, password, history) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const formData = {
    email: email,
    password: password,
  };

  try {
    const res = await axios.post(`${apiPath}/account/login`, formData, config);
    if (res.status === 200) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data && res.data,
      });
    }

    dispatch(loadUser(history));
    dispatch({
      type: LOGIN_FAIL,
      payload: "",
    });
  } catch (err) {
    // dispatch(setAlert("Email or password is correct", 'danger'));
    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data === "Invalid login details."
    ) {
      dispatch({
        type: LOGIN_FAIL,
        payload: "Email or Password is incorrect.",
      });
    } else if (err && err.response && err.response.data) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data,
      });
    } else if (err && !err.response) {
      dispatch({
        type: LOGIN_FAIL,
        payload: "Please wait!",
      });
    }
  }
};

// Logout / Clear Profile relevent data
export const logout = () => (dispatch) => {
  endChat();
  window.HideChatWidget && window.HideChatWidget();

  localStorage.removeItem("token");
  localStorage.clear();

  dispatch({ type: CLEAR_JOB_POST });
  dispatch({ type: LOGOUT });
};

// Get Countries List
export const GetCountriesList = () => async (dispatch) => {
  try {
    const res = await axios.get(`${apiPath}/lookup/countries`, config);

    dispatch({
      type: GET_COUNTIRES_LIST,
      payload: res.data,
    });
  } catch (err) {}
};

//Reset password
export const restPassword = (email, oldPassword, newPassword) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const formData = new FormData();
  formData.append("email", email);
  formData.append("oldPassword", oldPassword);
  formData.append("password", newPassword);

  try {
    const res = await axios.post(
      `${apiPath}/account/changepassword`,
      formData,
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: null,
    });

    dispatch(setAlert("password reset successfully", "success"));
  } catch (err) {
    dispatch(setAlert(err.message, "danger"));
    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
  }
};

//Forgot password
export const resetForgot = () => async (dispatch) => {
  dispatch({
    type: "resetbtn",
    payload: "send",
  });
  dispatch({
    type: "emailnotfound",
    payload: "",
  });
};
export const passwordForgot = (email) => async (dispatch) => {
  dispatch({
    type: "resetbtn",
    payload: "Sending",
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const formData = new FormData();
  formData.append("email", email);

  try {
    const res = await axios.post(
      `${apiPath}/account/forgotpassword?email=${email}`,
      config
    );

    if (res) {
      if (res.data.includes("Email address not found")) {
        dispatch({
          type: "emailnotfound",
          payload: res.data,
        });

        dispatch({
          type: "resetbtn",
          payload: "send",
        });
      } else if (res.data.includes("Success")) {
        dispatch({
          type: "emailnotfound",
          payload:
            "An email has been sent to your email address to change your password.",
        });
        dispatch({
          type: "emailfound",
          payload: "NOTE: This email can be placed in your Spam/Junk folder.",
        });

        dispatch({
          type: "resetbtn",
          payload: "sent",
        });
      }
    }
    // dispatch(setAlert('Please Check Your Email', 'info'));
  } catch (err) {
    // dispatch(setAlert(err.message, 'danger'));
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: err,
    });
  }
};
