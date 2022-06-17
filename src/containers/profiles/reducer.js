import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_FREELANCER_INFO
} from '../../store/actionTypes';

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
    vpnpas:"XD87DAPJ!"
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {

    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    default:
      return state;
  }
}
