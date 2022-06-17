import producer from "immer";
import {
  USER_TRANSECTION_DETAILS, 
  BILLING_ERROR 
} from '../../store/actionTypes';

let initialState = {  
  transaction_detail: [],
  loading: true,
    subscripiotnandtrans:null,
    error: null
}
export default (state = initialState, action) => {
    const { type, payload} = action

  return producer(state, draft => {
    switch (type) {
     
      case USER_TRANSECTION_DETAILS:
            draft.transaction_detail = payload                
            draft.loading=false;
        break;
        case "subscription":
            draft.subscripiotnandtrans = payload
            draft.loading=false;
        break;
        case BILLING_ERROR:
            draft.error = payload                
            draft.loading=false;
        break;
        default:
            return state;
    }

  })
};
/*
import { 
  USER_TRANSECTION_DETAILS, 
  BILLING_ERROR 

} from '../../store/actionTypes';

const initialState = {
  transaction_detail: null,
  loading: true,
  error: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_TRANSECTION_DETAILS:
      return {
        ...state,
        transaction_detail: payload,
        loading: false
      }
    case BILLING_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    default:
      return state;
  }
}


//** */