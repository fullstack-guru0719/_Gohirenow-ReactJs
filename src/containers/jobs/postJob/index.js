import React, { Component, Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiPath } from "../../../services/config";
import cookie from "react-cookies";
import Swal from "sweetalert2";
import ReactTags from "react-tag-autocomplete";
import { setAlert } from "../../alerts/actions";
import { getDataURL, isImage } from "../../../utils/common";
import placeholdericon from "../../../assets/icons.png";
import Spinner from "../../../components/spinner/index";
import {
  validatefile,
  postJob,
  getSkills,
  getJobDetail,
  removeerrs,
} from "../actions.js";

import store from "../../../store/configureStore";
import MetaTags from "react-meta-tags";

const PostJob = (props) => {
  const {
    user: { userId },
    postJob,
    validatefile,
    jobs,
    getSkills,
    getJobDetail,
    setAlert,
    user,
    loading,
    messageerror,
    history,
    trans_subs,
    match,
  } = props;
  const [formData, setFormData] = useState({
    postTitle: "",
    postDescription: "",
    activatedDate: "",
    closedDate: "",
    postSalary: "",
    salary: "",
    duration: "",
    status: "1",
    jobSkills: [],
    postbutton: "Post job",
    posttxt: "Post a Job",
    attachment: [],
    attachmentdata: [],
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    getSkills();
    let jobId = match.params.id;
    if (jobId) {
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
            // setJobdetail(res.data);

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
            // setLoader(false);
          })
          .catch((err) => {});
      }
    }
    axios.get(apiPath + "/client/subscription").then((res) => {
      if (
        res &&
        res.data &&
        res.data.subscriptionStatus &&
        res.data.subscriptionStatus.allowedJobs <=
          res.data.subscriptionStatus.postedJobs
      ) {
        Swal.fire({
          title: "You have reached your limit on job posts!",
          html: `<p style="margin-top: 50px">You are at ${res.data.subscriptionStatus.allowedJobs}
                            of ${res.data.subscriptionStatus.postedJobs} job posts</p>`,
          type: "warning",
          width: "650px",
          height: "650px",
          showCancelButton: true,
          confirmButtonColor: "#ED7B18",
          confirmButtonText: "Upgrade now!",
        }).then((result) => {
          store.dispatch(removeerrs());
          if (result.value) {
            history.push("/pricing");
          }
        });
      }
    });
  }, [getSkills, getJobDetail]);
  const [error, setError] = useState({
    title: "",
    description: "",
    Skills: "",
    salary: "",
    duration: "",
    salaryType: "",
  });
  const [filealfread, setfilealfread] = useState("");
  const [autoComplete, setAutoComplete] = useState({ tags: [] });
  const {
    postTitle,
    postDescription,
    activatedDate,
    closedDate,
    postSalary,
    status,
    salary,
    salaryType,
    jobSkills,
    posttxt,
    attachment,
    duration,
  } = formData;

  const { tags, suggestions } = autoComplete;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isFreeClientWithoutJobs =
    user &&
    user.userTypeId === 1 &&
    trans_subs &&
    trans_subs.subscriptionStatus &&
    trans_subs.subscriptionStatus.planName == "Free";
  const jobPost = async () => {
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
    let salare = salary.toString().includes("$")
      ? salary.toString().replace("$", "")
      : salary.toString();

    postJob({
      userId,
      postTitle,
      postDescription,
      salarytypes: duration,
      salare,
      jobstype: salaryType,
      status,
      jobSkills,
      attachment,
      history,
      isFreeClientWithoutJobs,
    });
    setError({
      ...error,
      salaryType: "",
      description: "",
      title: "",
      Skills: "",
      duration: "",
      salary: "",
    });
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
          if (filer[0]) {
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
  const deletefile = (index) => {
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
    // attach=formData.attachment.splice(index, 1);

    setFormData({
      ...formData,
      attachment: attach,
      attachmentdata: attachdata,
    });
  };
  const handleAddition = (tag) => {
    // const tags = [].concat(setAutoComplete({...tags, tag}))
    const newTags = [].concat(tags, tag);

    setAutoComplete({ tags: newTags });
    let ids = [];
    newTags.map((item) => {
      ids.push(item.id);
    });
    setFormData({ ...formData, jobSkills: ids });
  };
  if (messageerror) {
    Swal.fire({
      title: "You have reached your limit on job posts!",
      // text: ``,
      html: `<p style="margin-top: 50px">You are at ${messageerror.stat} job posts</p>`,
      type: "warning",
      width: "650px",
      height: "650px",
      showCancelButton: true,
      confirmButtonColor: "#ED7B18",
      confirmButtonText: "Upgrade now!",
    }).then((result) => {
      store.dispatch(removeerrs());
      if (result.value) {
        history.push("/pricing");
      }
    });
  }

  return (
    <Fragment>
      <div className="registration" id="post-job">
        <div className="container  extra-padd ">
          <div
            className="row flex-column top-text pl-0 "
            style={{ padding: "5% 0px 2% 0px" }}
          >
            <div className="col-md-12 pl-0">
              <h2>{posttxt}</h2>
              <p>
                Contact skilled virtual assistants within minutes. View
                profiles, portfolios and chat with them.
                <br />
                <br />
                24h Average Applications: <b>34.8 Candidates</b>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 pl-0 post-job-containers">
              <div className="left-side">
                <input
                  type="text"
                  name="postTitle"
                  placeholder="Choose a name for your job"
                  value={postTitle}
                  onChange={(e) => onChange(e)}
                />
                <p className="red-color pad-le">{error.title}</p>
                <textarea
                  name="postDescription"
                  placeholder="Tell us more about your job"
                  value={postDescription}
                  onChange={(e) => onChange(e)}
                />
                <p className="red-color pad-le">{error.description}</p>
                {/* <input type="text" name="jobSkills" placeholder="Required Skills" onChange={e => onChange(e)}/> */}
                <ReactTags
                  name="jobSkills"
                  placeholder="Type and chooses the required skills"
                  onChange={(e) => onChange(e)}
                  tags={tags}
                  suggestions={jobs && jobs.suggestions}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  allowBackspace={false}
                  autofocus={false}
                />
                <p className={"skills-advice"}>
                  *You must type them manually and select them from our list of
                  skills.
                </p>
                <p className="red-color pad-le">{error.Skills}</p>
                {/*<p><span>Suggested Skills : </span>*/}
                <p>
                  <span>Skills examples : </span>
                  Writting, Assistant, Designer, .NET, PHP, Shopify, WordPress,
                  Office, Data entry...
                  {/*{*/}
                  {/*jobs && jobs.suggestions.map((skill,index)=>{*/}
                  {/*return index < 10 ? `${skill['name']},`:null*/}
                  {/*})*/}
                  {/*}*/}
                </p>
              </div>
            </div>
            <div className="col-md-4 pr-0 post-job-containers">
              <div className="right-side">
                <select
                  value={salaryType}
                  name="salaryType"
                  onChange={(e) => onChange(e)}
                  placeholder="Full-time,Part-time"
                >
                  {/*<option disabled selected value="Full-Time, Part-Time">Full-Time, Part-Time</option>*/}
                  <option selected value="">
                    Choose job type
                  </option>
                  <option value="1">Full-Time</option>
                  <option value="2">Part-Time</option>
                  <option value="3">Freelance</option>
                </select>
                <p className="red-color pad-le">{error.salaryType}</p>
                <div className="input-icon">
                  <input
                    name="salary"
                    value={salary}
                    type="number"
                    placeholder="Salary ex($400) USD only"
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <p className="red-color pad-le">{error.salary}</p>
                <select
                  value={duration}
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
                <p className="red-color pad-le">{error.duration}</p>
                <div className="upload-div mt-0">
                  <input type="file" onChange={(e) => fileinput(e)} />
                  <p>Attach Files</p>
                  <img src={require("../../../assets/attach.png")} alt="" />
                </div>
                <p className="red-color">{filealfread}</p>
                <div>
                  {formData.attachmentdata.map((item, index) => {
                    return (
                      <div className="postjobport">
                        <div className="portfolio-file" key={index}>
                          {item.fileExtension === "" ? (
                            <img
                              src={item.src}
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
                          onClick={() => deletefile(index)}
                          style={{
                            zIndex: "2",
                          }}
                        />
                      </div>
                    );
                    {
                      /*<div key={index} className="item">{item.name}*/
                    }
                    {
                      /*<i onClick={()=>deletefile(index)} className="fa fa-close"></i>*/
                    }
                    {
                      /*</div>*/
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {/*{!!messageerror &&*/}
            {/*<p className="red-color mt-3">*/}
            {/*{*/}
            {/*messageerror !== "You have already posted maximum jobs allowed in your plan." ?*/}
            {/*messageerror:""*/}
            {/*}*/}
            {/*/!*<p>*!/*/}
            {/*/!*You have reached your limit on job posts!<br/><br/> You are at 5 of 5 job posts.*!/*/}
            {/*/!*</p>*!/*/}
            {/*&nbsp;*/}
            {/*/!*{messageerror==="You have already posted maximum jobs allowed in your plan."*!/*/}
            {/*/!*? <Link to="/pricing">Upgrade Now</Link>:""}*!/*/}
            {/*</p>*/}
            {/*}*/}
            {/*=======*/}
            {/*{!!messageerror &&*/}
            {/*<p className="red-color mt-3">{messageerror} &nbsp;*/}
            {/*{messageerror==="You have already posted maximum jobs allowed in your plan."*/}
            {/*? <Link to="/pricing">Upgrade Now </Link>*/}
            {/*:""}*/}
            {/*</p>*/}
            {/*}*/}
            {/*>>>>>>> origin/dev2*/}
            <div className="col-md-12 button">
              <button className="btn text-uppercase" onClick={jobPost}>
                {loading ? <Spinner /> : "post job"}
              </button>
            </div>
          </div>
          <div className="row bottom-div pl-0">
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

const mapStateToProps = ({ auth, jobs, billing }) => ({
  user: auth.user,
  postJob,
  jobs,
  loading: jobs.loading,
  messageerror: jobs.messageerror,
  trans_subs: billing && billing.subscripiotnandtrans,
});

export default connect(mapStateToProps, {
  postJob,
  getSkills,
  getJobDetail,
  setAlert,
  validatefile,
})(PostJob);
