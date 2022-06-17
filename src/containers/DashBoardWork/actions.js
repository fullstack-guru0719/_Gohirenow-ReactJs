import axios from 'axios';
import { setAlert } from '../alerts/actions';
import cookie from "react-cookies";

import {     
    GET_SKILLS,
    GET_SKILLS_ERROR
} from '../../store/actionTypes';
import {apiPath} from '../../services/config'




export const getSkills = (userId) => async dispatch => {
    try{
        const res = await axios.get(`${apiPath}/Skills/${userId}`);
        dispatch({
            type: GET_SKILLS,
            payload: res.data
        })
    }
    catch(err) {

        dispatch({
            type: GET_SKILLS_ERROR,
            payload: err
        })
    }
}