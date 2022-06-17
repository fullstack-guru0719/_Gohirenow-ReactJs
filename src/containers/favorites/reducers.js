import {
  GET_FAV_WORKERS,
  FAV_ERROR
} from '../../store/actionTypes';

const initialState = {
  favorite_worker: [],
  loading: true,
  errors: ''
};
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
      case "loader":
        return{
          loading:payload
        }
    case GET_FAV_WORKERS:
      return{
        favorite_worker : payload,
        loading : false
      }
    case FAV_ERROR:
      return {
        errors : payload,
        loading: false
      }
    default:
      return state;
  
  }
}
