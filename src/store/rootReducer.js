import { combineReducers } from "redux";
import globalReducer from "./globalState";
import jobReducer from "../containers/jobs/reducer";
import authReducer from "../containers/auth/reducer";
import alertReducer from "../containers/alerts/reducer";
import profileReducer from "../containers/profiles/reducer";
import favoriteReducer from "../containers/favorites/reducers";
import accountsReducer from "../containers/accountSetting/reducer";
import billingReducer from "../containers/billing/reducer";
import pricingReducer from "../containers/pricing/reducer";
import messageReducer from "../containers/messages/reducer";
import unreadCountReducer from "../components/header/reducer";

const rootReducer = combineReducers({
	main: globalReducer,
	jobs: jobReducer,
	auth: authReducer,
	alert: alertReducer,
	profile: profileReducer,
	favorites: favoriteReducer,
	account: accountsReducer,
	billing: billingReducer,
	pricing: pricingReducer,
	messages: messageReducer,
	unreadCount: unreadCountReducer
});

export default rootReducer;
