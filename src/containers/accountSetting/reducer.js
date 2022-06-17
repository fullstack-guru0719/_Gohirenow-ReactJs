import { GET_PROFILE, PROFILE_ERROR, GET_PROGRESS, GET_COUNTIRES_LIST, UPDATE_PROFILE } from '../../store/actionTypes';
const initialState = {
    profile : null,
    progress : null,
    loading: true,
    error: null,
    countryList:[]
};


export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile : payload,
                loading: false
            }
        case UPDATE_PROFILE:
            return {
                ...state,
                profile : payload,
                loading: false
            }
        case PROFILE_ERROR:
            return{
                ...state,
                error : payload,
                loading : false
            }
        case GET_PROGRESS:
            return{
                ...state,
                progress : payload,
                loading : false
            }
        case GET_COUNTIRES_LIST:
            return{
                ...state,
                countryList : payload,
                loading : false
            }
        default:
            return state;
    }
}
