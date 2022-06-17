import cookie from "react-cookies";
import ACTIONS from "./actionTypes";

const initialState = {
  loggedIn: !!cookie.load("token"),
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  userStoreData: {
    userId: cookie.load("userId"),
    email: cookie.load("email"),
    password: "",
    token: localStorage.getItem("tokenunique"),
    userType: cookie.load("userType")
  },
  showAlert: false,
};

export default (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case ACTIONS.LOGGED_IN:
      newState.loggedIn = action.payLoad;
      break;

    case ACTIONS.USER_DATA:
      newState.user = action.payLoad;
      break;

    case ACTIONS.STORE_USER_DATA:
      newState.userStoreData = action.payLoad;
      break;

    case ACTIONS.ALERT:
      newState.showAlert = action.payLoad.Show;
      newState.alertType = action.payLoad.Type;
      newState.alertMessage = action.payLoad.Message;
      break;
      
    default:
      break;

  }
  return newState;
};
