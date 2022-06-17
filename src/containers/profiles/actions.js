import axios from 'axios';
import { setAlert } from '../alerts/actions';

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  PROFILE_REQUEST,
  GET_FREELANCER_INFO
} from '../../store/actionTypes';


import {apiPath} from '../../services/config';
const config = {
    headers: {

        'Content-Type':'application/json'
    }
};

// Get current users profile
// Token will be sent automatically in header => check util setAuthToken
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get(`${apiPath}/account/`, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get profile by ID
export const getProfileById = () => async dispatch => {
  
  try {
    const res = await axios.get(`${apiPath}/Account/profile`, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  }
  catch (err) {

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Get all profiles
export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get(`${apiPath}/pathPlaceholder/`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const CreateClientProfile = (data, history, edit = false) => async dispatch => {
  dispatch({
    type: PROFILE_REQUEST,
  });
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const formData = new FormData();
    formData.append('Name', data.company);
    formData.append('CountryId', data.countryId);
    formData.append('user_email', data.email);

    // const res = await axios.post(`${apiPath}Account/hireupdate?CompanyName=${this.state.company}&CompanyIntroduction=${this.state.title}&CountryId=${this.state.country}&WhatWeDo=${this.state.describe}&UserId=${this.props.userStoreData.userId}`, formData, config   )

    dispatch(setAlert('Profile Updated Succesfully!', 'success'));

    if (!edit) {
      history.push('/profile-hire');
    }
  }
  catch (err) {
    dispatch(setAlert(err.messages, 'danger'));

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post(`${apiPath}/pathPlaceholder/`, formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Uplaod Picture

export const uploadProfile = (formData,token) => async dispatch => {

  axios
    .post(
      apiPath +
      `/Upload/file?countryId=${formData.countryId}&user_email=${formData.userName}&isProfilePicture=true`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      }
    )
    .then(res => {

      if (res && res.data) {
        dispatch({
          type: "SET_ALERT",
          payLoad: {
            Show: true,
            Type: "success",
            Message: "Image Uploaded Successfully!"
          }
        });

        setTimeout(() => {
          dispatch({
            type: "REMOVE_ALERT",
            payLoad: {
              Show: false,
              Type: "success",
              Message: ""
            }
          });
        }, 5000);
      }

    })
    .catch(err => {
      if (err.response && err.response.status) {

        //window.confirm("unauthorized");
        dispatch({
          type: "SET_ALERT",
          payLoad: {
            Show: true,
            Type: "error",
            Message: "Image Couldn't be Uploaded!"
          }
        });
        setTimeout(() => {
          dispatch({
            type: "REMOVE_ALERT",
            payLoad: {
              Show: false,
              Type: "error",
              Message: ""
            }
          });
        }, 5000);
      }
    });

}


