import {
  POST_A_JOB,
  GET_ACTIVE_JOBS,
  JOBS_ERROR,
  CLEAR_JOB_POST,
  GET_SKILLS,
  GET_JOB_DETAIL,
  GET_APPLIED_JOBS,
  GET_MATCHING_JOBS,
  GET_LATEST_JOBS,
  GET_APPLIED_JOBS_ERROR,
} from "../../store/actionTypes";
import { LOADER, JOB_DETAIL_WORKER } from "./actionTypes";
import producer from "immer";

const initialState = {
  active_posts: [],
  suggestions: [],
  job: null,
  jobApplied: [],
  jobMatching: [],
  jobLatest: [],
  // posttxt:"",
  // title:"",
  // description:"",
  // salary:0,
  //skills:[],
  job_detail_worker: {},
  loading: true,
  errors: "",
  messageerror: "",
  Rloading: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  return producer(state, (draft) => {
    switch (type) {
      case LOADER:
        draft.loading = payload;
      case POST_A_JOB:
        break;
      case GET_ACTIVE_JOBS:
        draft.active_posts = payload;
        draft.loading = false;
        break;
      case "loading":
        draft.loading = payload;
        break;
      case "Rloading":
        draft.Rloading = payload;
        break;
      case "error":
        draft.messageerror = payload;
        break;
      case JOBS_ERROR:
        draft.errors = payload;
        draft.loading = false;
        break;

      case CLEAR_JOB_POST:
        draft.active_posts = null;
        draft.loading = false;
        break;

      // Javed Added
      case GET_SKILLS:
        draft.suggestions = payload;
        draft.loading = false;
        break;
      case GET_JOB_DETAIL:
        draft.job = payload;
        break;
      case JOB_DETAIL_WORKER:
        draft.job = payload;
        draft.loading = false;
        break;
      case GET_APPLIED_JOBS:
        draft.jobApplied = payload;
        draft.loading = false;
        break;
      case GET_APPLIED_JOBS_ERROR:
        draft.jobApplied = payload;
        draft.loading = false;
        break;
      case GET_MATCHING_JOBS:
        draft.jobMatching = payload;
        draft.loading = false;
        break;
      case GET_LATEST_JOBS:
        draft.jobLatest = payload;
        draft.loading = false;
        break;
      default:
        return state;
    }
  });
};
