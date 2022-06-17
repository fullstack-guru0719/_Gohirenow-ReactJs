import {
  GET_ACTIVE_JOBS,
  JOBS_ERROR,
  GET_SKILLS,
  GET_JOB_DETAIL,
  GET_APPLIED_JOBS,
  GET_MATCHING_JOBS,
  GET_LATEST_JOBS,
  GET_APPLIED_JOBS_ERROR,
  GET_MATCHING_JOBS_ERROR,
  GET_LATEST_JOBS_ERROR,
} from "../../store/actionTypes";
import axios from "axios";
import { setAlert } from "../alerts/actions";
import { LOADER, JOB_DETAIL_WORKER } from "./actionTypes";
import { apiPath } from "../../services/config";
import queryString from "query-string";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const removeerrs = () => async (dispatch) => {
  dispatch({
    type: "error",
    payload: "",
  });
};
export const validatefile = ({ file }) => async (dispatch) => {};
export const postJob = ({
  userId,
  postTitle,
  postDescription,
  salarytypes,
  salare,
  jobstype,
  status,
  jobSkills,
  attachment,
  history,
  isFreeClientWithoutJobs,
}) => async (dispatch) => {
  dispatch({
    type: LOADER,
    payload: true,
  });

  let formData = new FormData();
  // const formData = new FormData();
  let salari = salare.replace("$", "");
  formData.append("title", postTitle);
  formData.append("description", postDescription);
  formData.append("jobTypeId", jobstype);
  formData.append("salary", salari);
  formData.append("salaryTypeId", salarytypes);
  jobSkills.map((item, index) => {
    formData.append(`jobSkillIds[${index}]`, item.id ? item.id : item);
  });
  attachment.map((item, index) => {
    formData.append(`file[${index}]`, item);
  });

  const bodysender = {
    entryType: "Jobs",
    messageToUserId: null,
  };
  // axios.post(apiPath+"/client/GetPricingPlanCapabilityStatus",bodysender).then((res)=>{

  //     if(res.data.result===true){
  axios
    .post(apiPath + "/client/jobs/create", formData, config)
    .then((res) => {
      if (res.data.result === false) {
        dispatch({ type: "error", payload: res.data });
        dispatch({ type: LOADER, payload: false });
      } else {
        dispatch({
          type: "error",
          payload: "",
        });

        localStorage.setItem("jobId", res.data);
        isFreeClientWithoutJobs
          ? history.push(`/wait-approval/?jobId=${res.data}`)
          : history.push(`/posted-job/${res.data}`);
        dispatch();
        dispatch({ type: LOADER, payload: false });
      }
    })
    .catch((err) => {
      // if (err.response.status === 500) {
      //     const parsedQuery = queryString.parse(err.response.request.responseURL);
      //     const parsedResponseKey = Object.keys(queryString.parse(err.response.request.responseURL))[0];
      //     const error = parsedQuery[parsedResponseKey];
      // }
      // if(err && err.response && err.response.data  ){
      //     dispatch({type:LOADER, payload:false});
      //     dispatch({type:"error",payload:err.response.data.errorMessage});
      // }
    });
  // }
  // else{
  //     dispatch({type:"error",payload:res.data});
  //     dispatch({type:LOADER, payload:false});
  // }})
};

export const removejob = ({ jobid, history }) => async (dispatch) => {
  dispatch({
    type: "Rloading",
    payload: true,
  });

  axios
    .post(`${apiPath}/client/jobs/${jobid}/change-status/${3}`)
    .then((res) => {
      dispatch({
        type: "Rloading",
        payload: false,
      });
      history.push("/dashboard");
    })
    .catch((err) => {});
};

export const editjob = ({
  jobid,
  userId,
  postTitle,
  postDescription,
  duration,
  salari,
  salaryType,
  status,
  jobSkills,
  attachment,
  history,
}) => async (dispatch) => {
  dispatch({
    type: LOADER,
    payload: true,
  });

  let formData = new FormData();
  // const formData = new FormData();
  // let salarie=salary.replace("$","")

  formData.append("title", postTitle);
  formData.append("description", postDescription);
  formData.append("jobTypeId", salaryType);
  formData.append("salary", salari);
  formData.append("salaryTypeId", duration);
  jobSkills.map((item, index) => {
    formData.append(`jobSkillIds[${index}]`, item.id);
  });

  attachment.map((item, index) => {
    formData.append(`file[${index}]`, item);
  });

  axios
    .post(apiPath + `/client/jobs/${jobid}/update`, formData, config)
    .then((res) => {
      dispatch({
        type: "error",
        payload: "",
      });
      localStorage.setItem("jobId", jobid);
      history.push(`/job-details-hire/${jobid}`);
      dispatch();

      dispatch({
        type: LOADER,
        payload: false,
      });
    })
    .catch((err) => {
      if (
        err &&
        err.response &&
        err.response.status &&
        err.response.status !== 200
      ) {
        dispatch({
          type: "error",
          payload: err.response.data,
        });
      }

      dispatch({
        type: JOBS_ERROR,
        payload: err,
      });
    });
};

export const updateJob = ({
  userId,
  postTitle,
  postDescription,
  duration,
  salary,
  salaryType,
  status,
  jobSkills,
  attachment,
}) => async (dispatch) => {
  dispatch({
    type: LOADER,
    payload: true,
  });
  try {
    const config = {
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type':'multipart/form-data'
        "Content-Type": "application/json",
      },
    };

    const formData = new FormData();
    // const formData = new FormData();

    formData.append("title", postTitle);
    formData.append("description", postDescription);
    formData.append("jobTypeId ", duration);
    formData.append("salary", salary);
    formData.append("salaryTypeId ", salaryType);
    jobSkills.map((item, index) => {
      formData.append(`jobSkillIds[${index}]`, item);
    });

    // formData.append('Attachments', JSON.stringify(attachment));

    const res = await axios.post(
      apiPath + "/client/jobs/create",
      formData,
      config
    );

    if (res) {
      dispatch(setAlert("job posted", "danger"));
      dispatch({
        type: LOADER,
        payload: false,
      });
    }
  } catch (err) {
    dispatch(setAlert("job error", "danger"));
    dispatch({
      type: JOBS_ERROR,
      payload: err,
    });
  }
};

export const getActiveJobs = (statusId, active) => async (dispatch) => {
  dispatch({
    type: "loading",
    payload: true,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.get(
      `${apiPath}/client/jobs/list?status=${statusId}&isactive=${active}`
    );
    dispatch({
      type: GET_ACTIVE_JOBS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOBS_ERROR,
      payload: err,
    });
  }
};

export const getSkills = () => async (dispatch) => {
  dispatch({
    type: "error",
    payload: "",
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.get(`${apiPath}/lookup/skills`, config);
    dispatch({
      type: GET_SKILLS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOBS_ERROR,
      payload: err,
    });
  }
};

export const getJobDetail = (jobId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.get(
      `${apiPath}/client/jobs/detail/${jobId}`,
      config
    );
    dispatch({
      type: GET_JOB_DETAIL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOBS_ERROR,
      payload: err,
    });
  }
};

export const getJobDetailwork = (jobId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.get(
      `${apiPath}/worker/jobs/detail/${jobId}`,
      config
    );
    dispatch({
      type: GET_JOB_DETAIL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: JOBS_ERROR,
      payload: err,
    });
  }
};

export const getAppliedJobs = () => async (dispatch) => {
  try {
    // const config = {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   };
    const res = await axios.get(
      `${apiPath}/worker/jobs/appliedjobslist`,
      config
    );
    dispatch({
      type: GET_APPLIED_JOBS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_APPLIED_JOBS_ERROR,
      payload: err,
    });
  }
};

export const getMatchingJobs = () => async (dispatch) => {
  try {
    const res = await axios.get(`${apiPath}/worker/jobs/matching`, config);
    dispatch({
      type: GET_MATCHING_JOBS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_MATCHING_JOBS_ERROR,
      payload: err,
    });
  }
};

export const getLatestJobs = () => async (dispatch) => {
  try {
    const res = await axios.get(`${apiPath}/worker/jobs/latest`, config);
    dispatch({
      type: GET_LATEST_JOBS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: GET_LATEST_JOBS_ERROR,
      payload: err,
    });
  }
};
