import {
  GET_FAV_WORKERS,
  FAV_ERROR
} from '../../store/actionTypes';
import axios from 'axios';

import {apiPath} from '../../services/config';


export const getFavoriteWorkers = (_Id) => async dispatch => {
    dispatch({
        type: "loader",
        payload: true
    });
  try {
    const res = await axios.get(`${apiPath}/favorites/client/workers`);
    dispatch({
      type: GET_FAV_WORKERS,
      payload: res.data
    });
  }
  catch (err) {
    dispatch({
      type: FAV_ERROR,
      payload: err
    });
  }
}