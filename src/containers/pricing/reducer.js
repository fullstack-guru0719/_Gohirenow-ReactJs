import producer from "immer";
import {
  GET_PLAN_LIST,
  GET_PLAN_LIST_ERROR
} from '../../store/actionTypes';

let initialState = {
  planList: [],
}
export default (state = initialState, action) => {
  const { type, payload } = action

  return producer(state, draft => {
    switch (type) {

      case GET_PLAN_LIST:
        draft.planList = payload
        break;
      case GET_PLAN_LIST_ERROR:
        draft.planList = payload
        break;
        
      default:
        return state;
    }

  })
};