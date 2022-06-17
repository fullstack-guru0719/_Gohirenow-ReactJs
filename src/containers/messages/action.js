


export const getReceivedMessages = (message) => async (dispatch) => {
	dispatch({
		type: "Received_Messages",
		payload: message
	});
};

export const getReceivedMessages_Remove = () => async (dispatch) => {
	dispatch({
		type: "Received_Messages_Remove",
		payload: ""
	});
};
