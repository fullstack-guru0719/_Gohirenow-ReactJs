import axios from "axios";
import { setAlert } from "../alerts/actions";
import cookie from "react-cookies";

import {
	GET_PROFILE,
	PROFILE_ERROR,
	GET_PROGRESS,
	GET_COUNTIRES_LIST,
	GET_COUNTIRES_LIST_ERROR,
	UPDATE_PROFILE
} from "../../store/actionTypes";
import { apiPath } from "../../services/config";
// const apiPath = "https://apiv1.gohirenow.com";

// Get current users profile
// Token will be sent automatically in header => check util setAuthToken
// User will be loaded as long as token exist and App loads.
const user = cookie.load("user");

export const getProfileInfo = (Id) => async (dispatch) => {
	try {
		const res = await axios.get(`${apiPath}/account/profile`);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: err
		});
	}
};
export const getProgress = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(`${apiPath}/account/progress`);
		dispatch({
			type: GET_PROGRESS,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: err
		});
	}
};

export const updateprofile = ({ userId, cname, countryId, email }) => async (
	dispatch
) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const formData = new FormData();
		formData.append("FullName", cname);
		formData.append("UserId", userId);
		formData.append("CountryId", countryId);
		formData.append("EmailAddress", email);

		const res = await axios.post(`${apiPath}/Account/update`, formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: err
		});
	}
};

export const getCountriesList = () => async (dispatch) => {
	try {
		const res = await axios.get(`${apiPath}/lookup/countries`);
		dispatch({
			type: GET_COUNTIRES_LIST,
			payload: res.data
		});
	} catch (err) {

		// dispatch({
		//     type: GET_COUNTIRES_LIST_ERROR,
		//     payload: err
		// })
	}
};
