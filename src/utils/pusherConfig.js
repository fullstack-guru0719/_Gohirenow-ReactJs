import store from "../store/configureStore";
import { getReceivedMessages } from "../containers/messages/action";
import { initialCount, unreadMessageCount } from "../components/header/action";
import { apiPath, appCluster, appKey } from "../services/config";
import axios from "axios";

var pusher;

const loadPusher = () => {
		var s = window.document.createElement("script");
		s.id = "pusher-script";
		s.type = "text/javascript";
		s.src = "https://js.pusher.com/5.0/pusher.min.js";
		s.onload = () => {

			setUpChatScript();
		};
		window.document.body.appendChild(s);
};

const setUpChatScript = () => {
	const Pusher = window.Pusher;
	let token = localStorage.getItem("token");
	// Pusher.logToConsole = true;
	if (token) {
		//loadUnreadChats();
		store.dispatch(unreadMessageCount());
		var userinfo = parseJwt(token);
		const userId =
			userinfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
		pusher = new Pusher(appKey, {
			cluster: appCluster,
			forceTLS: true,
			authEndpoint: `${apiPath}/messages/auth`,
			auth: {
				type: "Post",
				headers: {

					Authorization: `Bearer ${token}`
				}
			}
		});
		//var state = pusher.connection.state;
		var channel = pusher.subscribe(`private-${userId}`);
		channel.bind("message", function(data) {

			store.dispatch(getReceivedMessages(data));
			store.dispatch(unreadMessageCount());
			//loadUnreadChats();
			//store.dispatch(unreadMessage(1));
		});
	}
};

export const setUpChat = () => {
	if(window.document.getElementById('pusher-script') && pusher) {
		setUpChatScript();
	} else {
		loadPusher();
	}
};

export const endChat = () => {
	let token = localStorage.getItem("token");
	if (token && pusher) {
		var userinfo = parseJwt(token);
		const userId =
			userinfo[
				"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
			];
		pusher.unsubscribe(`private-${userId}`);
	}
};

export const parseJwt = (token) => {
	if (!token) {
		return;
	}
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	return JSON.parse(jsonPayload);
};

const config = {
	headers: {
		"Content-Type": "application/json"
	}
};

// const loadUnreadChats = () => {
// 	axios
// 		.get(`${apiPath}/messages/unreadmailcount`, config)
// 		.then((res) => {
// 			if (res.status === 200 && res.data.status === "success") {
// 				store.dispatch(initialCount(res.data.count));
// 			}
// 		})
// 		.catch((err) => {
//
// 		});
// };
