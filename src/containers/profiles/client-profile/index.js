import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { apiPath } from "../../../services/config";
import Moment from "react-moment";
import Spinner from "../../../components/spinner";
import placeholder from "../../../assets/employer_icon.svg";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import MediaQuery from "react-responsive";
import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";
import DeletePage from "../../DeletedComponent";
import TextParser from "../../../utils/TextParser";
import {ShortSalaryTypeById} from "../../../utils/constants/SalaryTypes";

const config = {
	headers: {
		"Content-Type": "application/json"
	}
};
const CompanyProfileview = ({ history, match, auth: { user }, isAuthenticated }) => {
	const [profileData, setProfile] = useState(null);
	const [loader, setLoader] = useState(true);
    const [ NotFound , SetNotFound ] = useState(false);
	const [messages, setMesssges] = useState({
		fromUserId: "",
		toUserId: "",
		message: "",
		jobId: "",
		name: "",
		mailId: ""
	});
	const [modal, setModal] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);
	useEffect(() => {
		window.scrollTo(0, 0);

		const { location }  = history;
		const profileId =  match.params.id || localStorage.getItem("profileId");
		if (profileId) {
			axios
				.get(`${apiPath}/worker/client-profile/${profileId}`, config)
				.then((res) => {
					setProfile(res.data);
					setLoader(false);
				})
				.catch((err) => {
                    setLoader(false);
                    SetNotFound(true);
				});
		} else {
			history.push("/dashboard-work");
		}
	}, []);
	const gotohriewith = (value, red) => {
		if (red === "editjob") {
			localStorage.setItem("jobId", value);
			history.push(`/edit-job/${value}`);
		} else if (red === "viewjob") {
			localStorage.setItem("jobId", value);
			history.push(`/job-details-hire/${value}`);
		}
	};
	const localdate = (date) => {
		if (mobileVendor == "Apple") {
			return date
		} else {
			return new Date(
				date.getTime() - date.getTimezoneOffset() * 60 * 1000
			);
		}
	};
	const openMessageModal = (UserId, nam) => {
		let jobid = localStorage.getItem("jobId_Message");

		setMesssges({
			...messages,
			fromUserId: user.userId,
			toUserId: UserId,
			jobId: jobid,
			name: nam
		});
		setModal(true);
	};
	const handleClose = () => {
		setModal(false);
	};
	const setMessage = (event) => {
		let msg = event.target.value;
		event.preventDefault();
		setMesssges({ ...messages, message: msg });
	};
	const sendMessage = () => {
		let model = {
			fromUserId: messages.fromUserId,
			toUserId: messages.toUserId,
			mailId: 0,
			message: messages.message,
			jobId: messages.jobId
		};
		setSendingMessage(true);
		axios
			.post(apiPath + "/messages/sendmessageByJob", model, config)
			.then((res) => {
				setSendingMessage(false);
				if (res.data.status === "success") {
					Swal.fire(
						"Sent!",
						`Message has been sent to ${messages.name}`,
						"success"
					);
					setMesssges({
						fromUserId: "",
						toUserId: "",
						message: "",
						jobId: "",
						name: "",
						mailId: ""
					});
					setModal(false);
				} else {
					setModal(false);
					Swal.fire("Error!", `Error has been occured.`, "error");
				}
			})
			.catch((err) => {
				alert(err.statusText);
			});
	};


	const placehold =
		profileData &&
		profileData.profilePicturePath &&
		profileData.profilePicturePath
			? profileData.profilePicturePath
			: placeholder;

    if(NotFound){
        return  <DeletePage text={"This company is no longer available."}/>;
    }
    else{
        return (
			<div className="registration" id="company-profile">
				{/*<MetaTags>*/}
					{/*<title>GoHireNow</title>*/}
					{/*<meta name="description" content="" />*/}
				{/*</MetaTags>*/}
                {loader ? (
					<div className="container">
						<Spinner />
					</div>
                ) : (
					<div className="container   " style={{}}>
						<div
							className="row  top-div pl-0"
							style={{ padding: "5% 0px 2% 0px" }}
						>
							<h2>Company Profile</h2>
							<div className="button">
                                {user && user.userTypeId === 1 && (
									<button
										className="btn text-uppercase"
										onClick={() => history.push(`/profile-edit-client/`)}
									>
										Edit
									</button>
                                )}
                                {user &&
                                user.userTypeId === 2 &&
                                profileData &&
                                profileData.enableMessage && (
									<button
										className="btn text-uppercase"
										onClick={() =>
                                            openMessageModal(
                                                profileData.userId,
                                                profileData.companyName
                                            )
                                        }
									>
										Message
									</button>
                                )}
							</div>
						</div>
						<div className="row margin-div">
							<div className=" col-md-4 pl-0">
								<div className="row left-side-outer">
									<div className="col-sm-12 pl-0 left-side-inner">
										<div>
											<div className="user-div">
												<div className="user-pic">
													<img src={placehold} alt="" />
												</div>
												<h4>{profileData !== null && profileData.companyName}</h4>
												<p>{profileData !== null && profileData.countryName}</p>
											</div>
											<div className="member-details">
												<p>
													Member since:&nbsp;{" "}
													<span>
													{profileData !== null &&
                                                    profileData.memberSince !== null && (
														<Moment format="MMM D YYYY">
                                                            {
                                                                // localdate(new Date(profileData.memberSince))
                                                                profileData.memberSince
                                                            }
														</Moment>
                                                    )}
												</span>
												</p>
												<p>
													Last logged: &nbsp;{" "}
                                                    {profileData !== null &&
                                                    profileData.lastLoginTime !== null && (
														<span>
															{" "}
															<Moment fromNow ago>
																{localdate(new Date(profileData.lastLoginTime))}
															</Moment>{" "}
															ago
														</span>
                                                    )}
												</p>
											</div>
											<div className="button">
                                                {/*{*/}
                                                {/*user && user.userTypeId ===2 &&*/}
                                                {/*<button className="btn text-uppercase">Report</button>*/}
                                                {/*}*/}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className=" col-md-8 right-side pr-0">
								<div className="right-side-top">
                                    {profileData !== null && profileData.introduction !== null && (
										<h4><TextParser text={profileData.introduction}/></h4>
                                    )}

                                    {profileData !== null &&
                                    (profileData.introduction === null ||
                                    profileData.introduction === "") && <p>Title: N/A</p>}

                                    {profileData !== null &&
                                    profileData.description &&
                                    profileData.description && (
										<div className="d-flex">
											<p style={{ height: "100%" }}><TextParser text={profileData.description}/></p>
										</div>
                                    )}
                                    {profileData !== null &&
                                    (profileData.description === null ||
                                    profileData.description === "") && (
										<p className="">Description: N/A</p>
                                    )}
								</div>
								<div className="bottom-head">
									<h4>Active Jobs</h4>
								</div>
								<MediaQuery maxDeviceWidth="767px">
                                    {
                                        profileData!== null && profileData.activeJobs.length > 0 &&
                                        profileData.activeJobs.filter(job=> job.status!=="NotApproved").map((item, index) => {
                                            return (
												<div key={index + "title"} className='active-job-posts-mobile-container'>
													<div className='a-j-p-avatitle'>
														<div onClick={() => { history.push(`/job-details-work/${item.id}`) }} className='a-j-p-ava-container'>
															<img src={profileData.profilePicturePath
                                                                ? profileData.profilePicturePath
                                                                : placeholder} alt="" />
														</div>
														<div onClick={() => { history.push(`/job-details-work/${item.id}`) }} className='a-j-p-title'>
															<TextParser text={item.title}/>
														</div>
													</div>
													<div className='a-j-p-details'>
														<div className='a-j-p-details-row'>
															<span className='a-j-p-details-row-header'>TYPE</span>
															<span>{item.type}</span>
														</div>
														<div className='a-j-p-details-row'>
															<span className='a-j-p-details-row-header'>SALARY</span>
															<span  className="pointer">
                                                                                 ${item.salary}{ShortSalaryTypeById(item.salaryTypeId)}
                                                                             </span>
														</div>
														<div className='a-j-p-details-row'>
															<span className='a-j-p-details-row-header'>DATE</span>
															<span>
                                                                                <Moment fromNow ago>
                                                                                {localdate(new Date(item.createDate))}
                                                                                </Moment>
																&nbsp;ago
                                                                             </span>
														</div>
													</div>
												</div>)
                                        })
                                    }
								</MediaQuery>
								<MediaQuery minDeviceWidth="768px">
									<table>
										<thead>
										<tr>
											<th
												style={{
                                                    minWidth: "250px",
                                                    maxWidth: "250px",
                                                    width: "250px"
                                                }}
											>
												JOB TITLE
											</th>
											<th
												style={{
                                                    minWidth: "100px",
                                                    maxWidth: "100px",
                                                    width: "100px",
                                                    textAlign: "center"
                                                }}
											>
                                                {" "}
												TITLE
											</th>
											<th
												style={{
                                                    minWidth: "100px",
                                                    maxWidth: "100px",
                                                    width: "100px",
                                                    textAlign: "center"
                                                }}
											>
												SALARY
											</th>
											<th
												style={{
                                                    minWidth: "100px",
                                                    maxWidth: "100px",
                                                    width: "100px",
                                                    textAlign: "center"
                                                }}
											>
												DATE
											</th>
										</tr>
										</thead>
										<tbody>
                                        {profileData !== null && profileData.activeJobs.length > 0 ? (
                                            profileData.activeJobs.map((item) => {
                                                return (
													<tr>
														<td
															style={{
                                                                minWidth: "250px",
                                                                maxWidth: "250px",
                                                                width: "250px",
                                                                fontWeight: "bold"
                                                            }}
														>
															<span
																onClick={() =>
                                                                    history.push(`/job-details-work/${item.id}`)
                                                                }
																className="pointer"
															><TextParser text={item.title}/></span>

														</td>
														<td
															style={{
                                                                minWidth: "100px",
                                                                maxWidth: "100px",
                                                                width: "100px",
                                                                textAlign: "center"
                                                            }}
														>
                                                            {item.type}
														</td>
														<td
															style={{
                                                                minWidth: "100px",
                                                                maxWidth: "100px",
                                                                width: "100px",
                                                                textAlign: "center"
                                                            }}
														>
															${item.salary}
														</td>
														<td
															style={{
                                                                minWidth: "100px",
                                                                maxWidth: "100px",
                                                                width: "100px",
                                                                textAlign: "center"
                                                            }}
														>
															<Moment fromNow ago>
                                                                {localdate(new Date(item.activeDate))}

															</Moment>{" "}
															ago
														</td>
													</tr>
                                                );
                                            })
                                        ) : (
											<tr>
												<td>No active job posts.</td>
											</tr>
                                        )}
										</tbody>
									</table>
								</MediaQuery>
							</div>
						</div>
					</div>
                )}
				<Modal
					show={modal}
					onHide={() => handleClose()}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>Message to {messages.name}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					<textarea
						name="message"
						className="form-control"
						rows="10"
						// onChange={(event) => setMessage(event.target.value)}
						onChange={(e) => setMessage(e)}
						placeholder="Type your message..."
					/>
					</Modal.Body>
					<Modal.Footer>
						<div className="button">
                            {sendingMessage && sendingMessage === true ? (
								<button className="btn-orange">Wait....</button>
                            ) : (
								<button className="btn-orange" onClick={() => sendMessage()}>
									Send Message
								</button>
                            )}
							<span className="margin-lr-2"></span>
							<button className="btn-white" onClick={() => handleClose()}>
								Close
							</button>
						</div>
					</Modal.Footer>
				</Modal>
			</div>
        );
	}

};

const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(CompanyProfileview);
