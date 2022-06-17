import axios from 'axios';
import { setAlert } from '../alerts/actions';
import {
  USER_TRANSECTION_DETAILS,
  BILLING_ERROR

} from '../../store/actionTypes';
import {apiPath} from '../../services/config';


export const getTransactionDetails = (email) => async dispatch => {
 
  try {

    const res = await axios.get(`${apiPath}/payment/transactions`);


    dispatch({
      type: USER_TRANSECTION_DETAILS,
      payload: res.data
    });

  }
  catch (err) {
     dispatch({
      type: BILLING_ERROR,
      payload: err
    });
  }
};export const getSubscriptionDetails = () => async dispatch => {

  try {

    const res = await axios.get(`${apiPath}/client/subscription`);


    dispatch({
      type: "subscription",
      payload: res.data
    });

  }
  catch (err) {

    dispatch({
      type: BILLING_ERROR,
      payload: err
    });
  }
};
