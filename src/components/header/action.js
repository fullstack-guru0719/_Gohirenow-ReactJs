import { apiPath } from "../../services/config";
import axios from "axios";
const config = {
	headers: {
		"Content-Type": "application/json"
	}
};

export const initialCount = (message) => async (dispatch) => {
	dispatch({
		type: "Initial_Unread_Message",
		payload: message
	});
};
export const unreadMessageCount = () => async (dispatch) => {
	axios
		.get(`${apiPath}/messages/unreadmailcount`, config)
		.then((res) => {
			if (res.status === 200 && res.data.status === "success") {
				dispatch({
					type: "Initial_Unread_Message",
					payload: res.data.count
				});
			}
		})
		.catch((err) => {
		});
};

export const removeUnreadMessage = (message) => async (dispatch) => {
	dispatch({
		type: "Remove_Unread_Message",
		payload: message
	});
};
export const searchkey = (message) => async (dispatch) => {
	dispatch({
		type: "search",
		payload: message
	});
};
