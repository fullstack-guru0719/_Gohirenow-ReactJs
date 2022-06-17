
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
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL
} from '../../store/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  user: JSON.parse(localStorage.getItem("user")) ,
  countires : [],
    usertype:1,
    passwordReset:false,
    errmessage:"",
    regmessage:"",
    forgotpassworderr:"",
    resetbtn:"Send",
    extratexts:""
};


export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user:  JSON.parse(localStorage.getItem("user"))
      };
      case "setusertype":
          return{
              ...state, usertype:payload
          }
      case "emailnotfound":
        return{
            ...state,
            forgotpassworderr:payload
        }
      case "emailfound":
       return {
        ...state,
           extratexts:payload
      }
      case "resetbtn":
        return{
            ...state,
            resetbtn:payload
        }
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return{
        ...state,
        loading: true
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        payload,
      };
      case LOGIN_FAIL:
        return{
            ...state,errmessage:payload,
            loading: false
        }
    case REGISTER_FAIL:
     
          return {
              ...state,
              regmessage:payload,
              loading: false
          };
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case GET_COUNTIRES_LIST:
        return {
          ...state,
          countires : payload
        }
    case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          passwordReset: true,
          loading: false
        }
        break;
    case RESET_PASSWORD_FAIL:
        return {
          ...state,
          passwordReset: false,
          loading: false
        }
        break;
    default:
      return state;
  }
}
