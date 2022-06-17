import producer from "immer";

const initialState = {
	recerivedmessages: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	return producer(state, (draft) => {
		switch (type) {
			case "Received_Messages":
				draft.recerivedmessages = payload;
				break;
			case "Received_Messages_Remove":
				draft.recerivedmessages = {};
				break;
			default:
				return state;
		}
	});
};
