import React, { Component, Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiPath } from "../../../services/config";
import cookie from "react-cookies";
import ReactTags from "react-tag-autocomplete";
import { setAlert } from "../../alerts/actions";

import Swal from "sweetalert2";

import store from "../../../store/configureStore";
import { LOADER } from "../actionTypes";
import Spinner from "../../../components/spinner/index";
import { getDataURL, isImage } from "../../../utils/common";

import placeholdericon from "../../../assets/icons.png";
import MetaTags from "react-meta-tags";

import {
  postJob,
  getSkills,
  getJobDetail,
  getJobDetailwork,
  editjob,
  removejob,
} from "../actions.js";

const PostJob = (
  {
    user: { userId },
    postJob,
    jobs,
    jobdetails,
    getSkills,
    getJobDetail,
    setAlert,
    loading,
    job,
    editjob,
    job_detail_worker,
    messageerror,
    removejob,
    history,
    Rloading,
  },
  props
) => {
  let [jobdetailsinside, setJobdetail] = useState({});
  const [filealfread, setfilealfread] = useState("");
  const [formData, setFormData] = useState({
    postTitle: "",
    postDescription: "",
    duration: "",
    activatedDate: "",
    closedDate: "",
    postSalary: "",
    salaryType: "",
    salary: "",
    dollarsign: "$",
    status: "1",
    jobSkills: [],
    postbutton: "Post job",
    posttxt: "Post a Job",
    attachment: [],
    attachmentdata: [],
    fileinbinary: [],
    statusofjob: "",
  });
  const [deleteatttach, setDelatach] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(
    () => {
      setLoader(true);
      window.scrollTo(0, 0);
      getSkills();
      let jobId = localStorage.getItem("jobId");
      if (jobId) {
        axios
          .get(apiPath + "/client/jobs/detail/" + jobId)
          .then((res) => {
            let attachments = [];
            res.data.attachments.map((item) => {
              const file = item.filePath;
              const fileType = file.substr(file.lastIndexOf(".") + 1);
              const validImageTypes = ["gif", "jpg", "png", "jpeg"];
              if (validImageTypes.includes(fileType.toLowerCase())) {
                attachments.push({
                  fileExtension: "",
                  fileName: item.fileName,
                  filePath: item.filePath,
                  id: item.id,
                });
              } else {
                attachments.push({
                  fileExtension: fileType,
                  fileName: item.fileName,
                  filePath: item.filePath,
                  id: item.id,
                });
              }
            });
            setJobdetail(res.data);

            let jobdata = res.data;
            setFormData({
              ...formData,
              postTitle: jobdata.title,
              postDescription: jobdata.description,
              salary: jobdata.salary,
              jobSkills: jobdata.skills,
              salaryType: jobdata.typeId,
              duration: jobdata.salaryTypeId,
              status: jobdata.statusId,
              statusofjob: jobdata.status,
              attachmentdata: attachments,
            });

            setAutoComplete({ tags: jobdata.skills });
            setLoader(false);
          })
          .catch((err) => {});
      }
    },
    [getSkills, getJobDetail],
    props
  );
  const [error, setError] = useState({
    title: "",
    description: "",
    Skills: "",
    salary: "",
    duration: "",
    salaryType: "",
  });
  const [autoComplete, setAutoComplete] = useState({ tags: [] });
  const {
    postTitle,
    postDescription,
    duration,
    activatedDate,
    closedDate,
    postSalary,
    salaryType,
    status,
    salary,
    jobSkills,
    posttxt,
    attachment,
    fileinbinary,
  } = formData;

  const { tags, suggestions } = autoComplete;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const jobremove = async () => {
    let jobid = localStorage.getItem("jobId");
    removejob({ jobid, history });
  };
  const jobPost = async (dispatch) => {
    if (
      postTitle === "" &&
      postDescription === "" &&
      salary === "" &&
      parseInt(jobSkills.length) === 0
    ) {
      setError({
        ...error,
        title: "Title is required ",
        description: " Description is required ",
        Skills: " Skill is required",
        salary: "Enter the salary",
        duration: "Duration  is required",
        salaryType: "Choose job type",
      });
      return;
    }
    if (postTitle === "") {
      setError({ ...error, title: "Title is required" });
      return;
    }
    if (postDescription === "") {
      setError({
        ...error,
        description: "Description is required ",
        title: "",
      });
      return;
    }
    if (parseInt(jobSkills.length) === 0) {
      setError({
        ...error,
        Skills: "Skill is required ",
        description: "",
        title: "",
      });
      return;
    }
    if (salaryType === "") {
      setError({
        ...error,
        salaryType: "Job type is required! Full time or Part time",
        description: "",
        title: "",
        Skills: "",
        duration: "",
      });
      return;
    }
    if (salaryType === 0) {
      setError({
        ...error,
        salaryType: "Choose job type",
        description: "",
        title: "",
        Skills: "",
        duration: "",
      });
      return;
    }
    if (salary === "") {
      setError({
        ...error,
        salary: "Enter the salary",
        description: "",
        title: "",
        Skills: "",
        duration: "",
        salaryType: "",
      });
      return;
    }
    if (duration === "") {
      setError({
        ...error,
        duration: "Duration  is required",
        description: "",
        title: "",
        Skills: "",
        salaryType: "",
        salary: "",
      });
      return;
    }
    if (duration === 0) {
      setError({
        ...error,
        duration: "Duration  is required",
        description: "",
        title: "",
        Skills: "",
        salaryType: "",
        salary: "",
      });
      return;
    }
    let jobid = localStorage.getItem("jobId");
    if (jobid) {
      let salari = salary.toString().includes("$")
        ? salary.toString().replace("$", "")
        : salary;
      if (formData.statusofjob !== "Active") {
        deleteatttach.map((item) => {
          axios
            .delete(`${apiPath}/client/jobs/${jobid}/attachment/delete/${item}`)
            .then((res) => {});
        });
        let attacher = formData.attachment;

        editjob({
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
        });
        setError({
          ...error,
          duration: "",
          description: "",
          title: "",
          Skills: "",
          salaryType: "",
          salary: "",
        });
      }
      if (formData.statusofjob === "Inactive") {
        store.dispatch({
          type: LOADER,
          payload: true,
        });
        deleteatttach.map((item) => {
          axios
            .delete(`${apiPath}/client/jobs/${jobid}/attachment/delete/${item}`)
            .then((res) => {});
        });
        axios
          .post(`${apiPath}/client/jobs/${jobid}/change-status/${2}`)
          .then((res) => {
            if (res) {
              editjob({
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
              });
              setError({
                ...error,
                duration: "",
                description: "",
                title: "",
                Skills: "",
                salaryType: "",
                salary: "",
              });
            }
          })
          .catch((err) => {});
      }
    }
  };

  const fileinput = (e) => {
    if (e.target.files) {
      let formDatafile = new FormData();
      formDatafile.append("file", e.target.files[0]);
      let filer = e.target.files;
      axios.post(apiPath + "/upload/validatefile", formDatafile).then((res) => {
        if (res.data.result === true) {
          let attach = formData.attachment;
          let addfile = true;
          formData.attachment.map((item, index) => {
            if (item.name === filer[0].name) {
              addfile = false;
            }
          });
          if (addfile === true) {
            attach.push(filer[0]);
            setfilealfread("");
            setFormData({ ...formData, attachment: attach });
          } else if (addfile === false) {
            setfilealfread("File already choosen");
          }

          const file = filer[0];
          const fileType = file["type"];
          const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
          let fileExtension = "";
          if (validImageTypes.includes(fileType.toLowerCase())) {
          } else {
            let fileName = filer[0].name;
            let ext = fileName.substr(fileName.lastIndexOf(".") + 1);
            fileExtension = ext;
          }
          if (filer) {
            let attac = [];
            let file = filer[0];
            let fileName = filer[0].name;
            getDataURL(filer[0]).then((data) => {
              if (data !== "error") {
                if (isImage) {
                  attac = [
                    ...formData.attachmentdata,
                    {
                      file: file,
                      fileName: fileName,
                      fileExtension: fileExtension,
                      src: data,
                    },
                  ];

                  setFormData({ ...formData, attachmentdata: attac });
                } else {
                  attac = [
                    ...formData.attachmentdata,
                    {
                      file: file,
                      fileName: fileName,
                      fileExtension: fileExtension,
                      src: data,
                    },
                  ];
                  setFormData({ ...formData, attachmentdata: attac });
                }
              }
            });
          }
        } else {
          Swal.fire(
            "Can't upload this file format type",
            "Only upload image, pdf or office files. ",
            "error"
          ).then((result) => {});
        }
      });
    }
  };

  const handleDelete = (i) => {
    if (tags) {
      const newTags = [];
      tags.map((item, index) => {
        if (index !== i) {
          newTags.push(item);
        }
      });

      setAutoComplete({ tags: newTags });
      setFormData({ ...formData, jobSkills: newTags });
    }
  };
  const handleAddition = (tag) => {
    // const tags = [].concat(setAutoComplete({...tags, tag}))
    const newTags = [].concat(tags, tag);
    setAutoComplete({ tags: newTags });
    setFormData({ ...formData, jobSkills: newTags });
  };
  const deletefile = (id, index) => {
    // let attach=[];
    // formData.attachment.map((item,inde)=>{
    //     if(index !==inde){
    //         attach.push(item)
    //     }
    // });
    // setDelatach([...deleteatttach,id])

    // // attach=formData.attachment.splice(index, 1);
    // setFormData({ ...formData, attachment: attach })
    let attach = [];
    let attachdata = [];
    formData.attachment.map((item, inde) => {
      if (index !== inde) {
        attach.push(item);
      }
    });
    formData.attachmentdata.map((item, inde) => {
      if (index !== inde) {
        attachdata.push(item);
      }
    });
    setDelatach([...deleteatttach, id]);
    // attach=formData.attachment.splice(index, 1);

    setFormData({
      ...formData,
      attachment: attach,
      attachmentdata: attachdata,
    });
  };
  const gotoPost = () => {
    let jobid = localStorage.getItem("jobId");
    history.push(`/post-job/${jobid}`);
  };
  return (
    <Fragment>
      {/*<MetaTags>*/}
      {/*<title>GoHireNow</title>*/}
      {/*<meta name="description" content="" />*/}
      {/*</MetaTags>*/}
      <div className="registration edit-job" id="post-job">
        <div className="container extra-padd ">
          <div
            className="row flex-column top-text "
            style={{ padding: "5% 0px 2% 0px" }}
          >
            <div className="col-md-12 pl-0">
              <h2>
                {formData.statusofjob === "Active" ? "Edit a job" : ""}
                {formData.statusofjob === "Inactive" ? "Edit a job" : ""}{" "}
              </h2>
            </div>
          </div>
          {loader ? (
            <div className="row">
              <Spinner />
            </div>
          ) : (
            <div className="row">
              <div className="col-md-8 pl-0">
                <div className="left-side">
                  <input
                    type="text"
                    name="postTitle"
                    placeholder="Title"
                    value={formData.postTitle}
                    onChange={(e) => onChange(e)}
                  />
                  <p className="red-color">{error.title}</p>
                  <textarea
                    name="postDescription"
                    placeholder="Description"
                    value={formData.postDescription}
                    onChange={(e) => onChange(e)}
                  />
                  <p className="red-color">{error.description}</p>
                  {/* <input type="text" name="jobSkills" placeholder="Required Skills" onChange={e => onChange(e)}/> */}
                  <ReactTags
                    name="jobSkills"
                    placeholder="Required Skills"
                    onChange={(e) => onChange(e)}
                    tags={tags}
                    suggestions={jobs && jobs.suggestions}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    allowBackspace={false}
                    autofocus={false}
                  />
                  <p className={"skills-advice"}>
                    *You must type them manually and select them from our list
                    of skills.
                  </p>
                  <p className="red-color">{error.Skills}</p>
                  {/*<p><span>Suggested Skills : </span>*/}
                  <p>
                    <span>Skills examples : </span>
                    Writting, Assistant, Designer, .NET, PHP, Shopify,
                    WordPress, Office, Data entry...
                    {/*{*/}
                    {/*jobs && jobs.suggestions.map((skill,index)=>{*/}
                    {/*return index < 10 ? `${skill['name']},`:null*/}
                    {/*})*/}
                    {/*}*/}
                  </p>
                </div>
              </div>
              <div className="col-md-4 pr-0 ">
                <div className="right-side">
                  <select
                    value={formData.salaryType}
                    name="salaryType"
                    onChange={(e) => onChange(e)}
                  >
                    {/*<option disabled selected value="Full-Time, Part-Time">Full-Time, Part-Time</option>*/}
                    <option selected value="">
                      Choose job type
                    </option>

                    <option selected value="1">
                      Full-Time
                    </option>
                    <option value="2">Part-Time</option>
                    <option value="3">Freelance</option>
                  </select>
                  <p className="red-color  pad-le">{error.salaryType}</p>
                  <div className="input-icon">
                    <input
                      name="salary"
                      type="text"
                      value={formData.salary}
                      placeholder=""
                      onChange={(e) => onChange(e)}
                    />
                    <i>$</i>
                  </div>
                  <p className="red-color pad-le">{error.salary}</p>
                  <select
                    value={formData.duration}
                    name="duration"
                    onChange={(e) => onChange(e)}
                  >
                    {/*<option disabled selected value="Monthly, Weekly, Hourly">Monthly, Weekly, Hourly</option>*/}
                    <option value="">Choose salary period</option>

                    <option value="1">Hourly</option>
                    <option value="2">Weekly</option>
                    <option selected value="3">
                      Monthly
                    </option>
                    <option value="4">Fixed</option>
                  </select>
                  <p className="red-color  pad-le">{error.duration}</p>
                  <div className="upload-div">
                    <input type="file" onChange={(e) => fileinput(e)} />
                    <p>Attach Files</p>
                    <img src={require("../../../assets/attach.png")} alt="" />
                  </div>
                  <div>
                    {formData.attachmentdata.map((item, index) => {
                      return (
                        <div className="postjobport">
                          <div className="portfolio-file" key={index}>
                            {item.fileExtension === "" ? (
                              <img
                                src={item.filePath ? item.filePath : item.src}
                                alt={item.src}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  zIndex: "1",
                                  float: "left",
                                  clear: "both",
                                }}
                              />
                            ) : (
                              <img
                                src={placeholdericon}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  zIndex: "1",
                                  float: "left",
                                  clear: "both",
                                }}
                              />
                            )}
                            <p
                              className="fileextension"
                              style={{
                                top: "41px",
                                wordBreak: "break",
                              }}
                            >
                              {item.fileExtension !== "" && item.fileExtension}
                            </p>
                          </div>
                          <p className="black">
                            {item.name
                              ? item.name.slice(0, 15)
                              : item.fileName.slice(0, 15)}
                          </p>
                          <i
                            className="fa fa-times-circle"
                            onClick={() => deletefile(item.id, index)}
                            style={{
                              zIndex: "2",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="red-color mt-3    ">{messageerror}</p>
          {!loader && formData.statusofjob !== "Inactive" && (
            <div className="row">
              <div className="col-md-12 button pl-0">
                <button className="btn text-uppercase " onClick={jobPost}>
                  {loading ? <Spinner /> : "update"}
                </button>
              </div>
            </div>
          )}
          {!loader && formData.statusofjob === "Inactive" && (
            <div className="row">
              <div className="col-md-12 button pl-0">
                <button className="btn text-uppercase " onClick={gotoPost}>
                  {loading ? <Spinner /> : "Repost"}
                </button>
              </div>
            </div>
          )}
          {!loader && (
            <div className="row">
              <div className="col-md-12 button pl-0">
                {(formData.status === 5 || formData.status === 2) && (
                  <button className="btn text-uppercase " onClick={jobremove}>
                    {Rloading ? <Spinner /> : "REMOVE JOB"}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="row bottom-div">
            <div className="col-md-12 pl-0">
              <h4 className="text-uppercase">Advices</h4>
              <p>
                Use a great job title.
                <br />
                Tell your company story and what makes your organization
                awesome.
                <br />
                Use clear, concise language to describe job responsibilities.
                <br />
                Clearly define essential duties.
                <br />
                Describe the work schedule and how flexible it is.
                <br />
                Include salary and benefit information.
                <br />
                Really sell the position.
                <br />
                Include documents that could help your candidates in the
                application process.
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ auth, jobs }) => ({
  user: auth.user,
  postJob,
  jobdetails: jobs.job,
  jobs,
  job_detail_worker: jobs.job_detail_worker,
  loading: jobs.loading,
  Rloading: jobs.Rloading,
  messageerror: jobs.messageerror,
});

export default connect(mapStateToProps, {
  postJob,
  getSkills,
  editjob,
  getJobDetail,
  setAlert,
  getJobDetailwork,
  removejob,
})(PostJob);
