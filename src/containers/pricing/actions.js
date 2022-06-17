import axios from 'axios';
import { setAlert } from '../alerts/actions';
import cookie from "react-cookies";

import {
  GET_PLAN_LIST,
  GET_PLAN_LIST_ERROR
} from '../../store/actionTypes';
import {apiPath} from '../../services/config';


export const getPlanList = () => async dispatch => {
  try {
    const res = await axios.get(`${apiPath}/lookup/plans-details`);
    dispatch({
      type: GET_PLAN_LIST,
      payload: res.data
    })
  }
  catch (err) {

    dispatch({
      type: GET_PLAN_LIST_ERROR,
      payload: err
    })
  }
}