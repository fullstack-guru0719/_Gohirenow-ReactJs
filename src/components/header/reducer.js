import producer from "immer";

const initialState = {
	unreadMessages: 0,
	search:""
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	return producer(state, (draft) => {
		switch (type) {
			case "Initial_Unread_Message":
				draft.unreadMessages = payload;
				break;
			case "Add_Unread_Message":
				draft.unreadMessages++;
				break;
			case "Remove_Unread_Message":
				var count = draft.unreadMessages - 1;
				draft.unreadMessages = count < 0 ? 0 : count;
				break;
			case "search":
				draft.search = payload;
				break;
			default:
				return state;
		}
	});
};
