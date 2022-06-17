import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { apiPath } from "../../../services/config";
import UploadProfile from "../../../components/uploadavatar";
import ReactTags from "react-tag-autocomplete";
import Moment from "react-moment";
import placeholdericon from "../../../assets/icons.png"
import Spinner from "../../../components/spinner";
import { getDataURL, isImage } from "../../../utils/common";
import Swal from "sweetalert2";
import MediaQuery from "react-responsive";

import MetaTags from 'react-meta-tags';
import queryString from "query-string";
import { getProfileInfo } from "../../accountSetting/actions";
import {mobileVendor} from "react-device-detect";

class Profile extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.handlesubmit = this.handlesubmit.bind(this);
	}
	state = {
		userName: "",
		countryId: "",
		title: "",
		describe: "",
		salary: "",
		availability: "0",
		education: "",
		experience: "",
		profileimage: "",
		file: null,
		countriesList: [],
		skillsArr: [],
		portfolio: null,
		portfolioName: "Select a file",
		portfolioArr: [],
		socialLinks: [],
		facebook: "",
		linkedin: "",
		skype: "",
		Save: "Save",
		appliedjob: false,
		isLoading: true,
		tags: [],
		jobSkills: [],
		lastLoginTime: 0,
		registerDate: 0,
		uploading: "",
		salaryrange: [
			"300",
			"400",
			"500",
			"600",
			"700",
			"800",
			"900",
			"1000",
			"1100",
			"1200",
			"1300",
			"1400",
			"1500",
			"1600",
			"1700",
			"1800",
			"1900",
			"2000"
		],
		selectedPortifolio: {},
		portflioFiles: [],
		skillrequire: false,
		titlerequire: false,
		imagerequire: false,

	};

	componentWillReceiveProps(nextProps) {
		let { loggedIn } = nextProps;
		if (!loggedIn) {
			localStorage.setItem("route", this.props.location.pathname);
			this.props.history.push("/sign-in");
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { userStoreData : { countryId }} = this.props;
		const { countryId: stateCountryId } = this.state;
		if (!stateCountryId && countryId){
			this.setState({
				countryId
			})
		}
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		let { loggedIn } = this.props;
		if (!loggedIn) {
			localStorage.setItem("route", this.props.location.pathname);
			this.props.history.push("/sign-in");
		}
		axios.get(apiPath + "/lookup/countries").then((res) => {
			this.setState({ countriesList: res.data });
		});
		this.getProfileInfo();
	}

	getProfileInfo = () => {
		axios
			.get(apiPath + `/account/profile`)
			.then((res) => {
				let avail = "";
				switch (res.data.availability) {
					case "Full-Time":
						avail = "1";
						break;
					case "Part-Time":
						avail = "2";
						break;
					case "Freelance":
						avail = "3";
						break;
					case "0":
						avail = "0";
						break;
				}
				let portfolios = [];

				res.data.portfolios.map((item) => {
					const file = item.filePath;
					const fileType = file.substr(file.lastIndexOf('.') + 1);
					const validImageTypes = ['gif', 'jpg', 'png', 'jpeg'];
					if (validImageTypes.includes(fileType.toLowerCase())) {
						portfolios.push({
							fileExtension: "",
							fileName: item.fileName,
							filePath: item.filePath,
							id: item.id,
							thumbnail: item.thumbnail
						})
					}
					else {
						portfolios.push({
							fileExtension: fileType,
							fileName: item.fileName,
							filePath: item.filePath,
							id: item.id,
							thumbnail: item.thumbnail
						})
					}
				})


				if (res.data) {
					this.setState({
						title: res.data.title || "",
						describe: res.data.description || "",
						userName: res.data.fullName || "",
						countryId: res.data.countryId,
						salary: res.data.salary || "",
						availability: avail,
						education: res.data.education || "",
						experience: res.data.experience || "",
						profileimage: res.data.profilePicturePath
							? res.data.profilePicturePath
							: "",
						skillsArr: res.data.skills,
						tags: res.data.skills,
						portfolioArr: portfolios, //for now it is coming as a string
						registerDate: res.data.memberSince,
						facebook: res.data.socialMediaLinks.facebool || "",
						linkedin: res.data.socialMediaLinks.linkedIn || "",
						skype: res.data.socialMediaLinks.skype || "",
						// appliedjob: false,
						isLoading: false,
						lastLoginTime: res.data.lastLoginTime
					});
				}
			})
			.catch((err) => {
				this.setState({
					isLoading: false
				});
			});
	};

	handleCountryChange = (event) => {
		this.setState({ countryId: event.target.value });
	};

	onChange(e) {
		if (e.target.files[0]) {
			this.setState({ file: e.target.files[0], profileimage: true });
		}
	}
	imageuoload = (data) => {
		this.setState({ imagerequire: false, profileimage:data})
	}

	handlesubmit = (e) => {
		let returner = false;
		const { history, dispatch } = this.props;
		if (this.state.title === "" && this.state.skillsArr.length === 0 && this.state.profileimage === "") {
			this.setState({ skillrequire: true, titlerequire: true, imagerequire: true });
			returner = true
		}
		else if (this.state.title === "") {
			this.setState({ titlerequire: true, skillrequire: this.state.skillsArr.length === 0 ? true : false });
			returner = true

		}
		else if (this.state.skillsArr.length === 0) {
			this.setState({ skillrequire: true, titlerequire: this.state.title === "" ? true : false });
			returner = true
		}
		else if (this.state.profileimage === "") {
			this.setState({imagerequire: true});
			returner = true;
			axios
				.get(apiPath + `/account/profile`).then((res) => {
					this.setState({
						imagerequire: res.data.profilePicturePath ? false : true,
						skillrequire: this.state.skillsArr.length === 0 ? true : false,
						titlerequire: this.state.title === "" ? true : false
					});

				})


		}
		if (returner===true) {
			return;
		}
		this.setState({ skillrequire: false, titlerequire: false });
		e.preventDefault();
		let { facebook, linkedin, skype } = this.state;
		this.setState({ Save: "Saving" });
		const formData = new FormData();

		formData.append("ProfileName", this.state.userName);
		formData.append("Title", this.state.title);
		formData.append("Description", this.state.describe);
		formData.append("UserId", this.props.userStoreData.userId);
		formData.append("Salary", this.state.salary);
		formData.append("Availiblity", this.state.availability);
		formData.append("Educations", this.state.education);
		formData.append("Experience", this.state.experience);
		formData.append("AppliedOnJob", this.state.appliedjob);
		formData.append("CountryId", this.state.countryId);
		formData.append("FacebookLink", facebook);
		formData.append("LinkedInLink", linkedin);
		formData.append("SkypeLink", skype);

		if (this.state.skillsArr && this.state.skillsArr.length > 0) {
			this.state.skillsArr.forEach((item, index) => {
				formData.append(`Skills[${index}]`, item.id);
			});
		}
		if (this.state.portflioFiles && this.state.portflioFiles.length > 0) {
			this.state.portflioFiles.forEach((item, index) => {
				formData.append(`Portfolio_${item.name}`, item.file);
			});
		}
		axios
			.post(`${apiPath}/Account/workerupdate`, formData)
			.then((res) => {
				dispatch(getProfileInfo(this.props.userStoreData.userId));
				const { location } = history;
				const currentUrl = queryString.parse(location.search);
				const backto = currentUrl.backto;
				this.setState({ Save: "Save" });
                this.props.history.push(backto ? backto : "/profile-work");
            })
			.catch((err) => {
				if (err.response && err.response.status === 401) {
				}
				this.setState({
					Save: "Save"
				});
			});
	};

	onChangePortFolio = (files) => {
		this.setState({
			portfolioArr: files
		});
	};
	onChangetag = (e) => {
		// setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	onChangeSkills = (skills) => {
		this.setState({
			skillsArr: skills
		});
	};

	handleDelete = (i) => {
		if (this.state.tags) {
			let newTags = [];
			this.state.tags.map((item, index) => {
				if (index !== i) {
					newTags.push(item);
				}
			});
			this.setState({ tags: newTags, jobSkills: newTags, skillsArr: newTags });
			// setFormData({...formData,jobSkills: newTags})
		}
	};

	handleAddition = (tag) => {
		if (this.state.tags.length < 10) {
			let { tags } = this.state;
			// let tagz=[tags];
			let tager = [...tags, tag];
			if (tag) {
				this.setState({ tags: tager });
				this.setState({ jobSkills: tager, skillsArr: tager });
			}
		} else {
			window.alert("You have reached your maximum of 10 skills. ");
		}
	};

	localdate = (date) => {
		if (mobileVendor == "Apple") {
			return date
		} else {
			return new Date(
				date.getTime() - date.getTimezoneOffset() * 60 * 1000
			);
		}
	};

	// portflio
	loadPortfolio = (e) => {

		if (e.target.files) {
			let formDatafile = new FormData();
			formDatafile.append('file', e.target.files[0]);
			let filer = e.target.files;
			axios.post(apiPath + "/upload/validatefile", formDatafile).then((res) => {
				if (res.data.result === true) {

					const file = filer[0];
					const fileType = file['type'];
					const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
					let fileExtension = "";
					if (validImageTypes.includes(fileType)) {

					} else {
						let fileName = filer[0].name;
						let ext = fileName.substr(fileName.lastIndexOf('.') + 1);
						fileExtension = ext;

					}
					if (filer) {
						this.setState({
							selectedPortifolio: {
								file: filer[0],
								filename: filer[0].name,
								fileExtension: fileExtension
							}
						});
					}
				}
				else {
					Swal.fire(
						"Can't upload this file format type",
						"Only upload image, pdf or office files. ",
						"error"
					).then((result) => {

					})
				}
			})
		}


	};

	setPortifolioName = (event) => {

		let name = event.target.value;
		event.preventDefault();
		this.setState((prevState) => ({
			selectedPortifolio: {
				...prevState.selectedPortifolio,
				name: name
			}
		}));
	};

	addPortfolio = () => {
		if (
			this.state.selectedPortifolio &&
			this.state.selectedPortifolio.file &&
			this.state.selectedPortifolio.name
		) {
			let items = this.state.portflioFiles;
			getDataURL(this.state.selectedPortifolio.file).then((data) => {
				if (data !== "error") {
					if (isImage) {
						this.setState((prevState) => ({
							selectedPortifolio: {
								...prevState.selectedPortifolio,
								src: data
							}
						}));
						items.push(this.state.selectedPortifolio);
						this.setState({ selectedPortifolio: {}, portflioFiles: items });
					} else {
						// Here you will code to display extension just like above set image src for custom
						// file image and extension is in the {{data}}
					}
				} else {
					Swal.fire(
						"Can't upload this file format type",
						"Only upload image, pdf or office files. ",
						"error"
					);
				}
			});
		}
	};

	loadPortfolios = (e) => {
		if (e.target.value && this.state.portfolio !== null) {
			let { portfolio } = this.state;
			// portfolio.name= e.target.value;
			// this.setState({ portfolio: portfolio });
			// this.setState({ portfolioName: e.target.value });
		}
	};

	removePortfolio = (value, id) => {
		let array = [...this.state.portflioFiles];
		array.splice(value, 1);
		this.setState({ portflioFiles: array });
		//this.props.onChangePortFolio(array);
	};
	deletePortifolioFromDatabase = (index, id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ED7B18",
			confirmButtonText: "Yes, delete it!"
		}).then((result) => {
			if (result.value) {
				axios
					.delete(`${apiPath}/account/worker/portifolio/delete/${id}`)
					.then((res) => {
						let array = [...this.state.portfolioArr];
						array.splice(index, 1);
						this.setState({ portfolioArr: array });
						Swal.fire("Deleted!", "Your file has been deleted.", "success");
					});
			}
		});
	};

	// portflio

	render() {
		let { dispatch, loggedIn, profile } = this.props;
		let { countriesList, isLoading, salaryrange } = this.state;
		return (
			<div className="registration" id="edit-profile">
				{/*<MetaTags>*/}
					{/*<title>GoHireNow</title>*/}
					{/*<meta name="description" content="" />*/}
				{/*</MetaTags>*/}
				<div className="container  row-padd ">
					<div className="row inner-div">
						<h1>Complete your profile</h1>
						<span className='header-mobile-button-wrapper'>
							<MediaQuery minDeviceWidth="768px">
								<button
									className="btn save-btn text-uppercase"
									onClick={this.handlesubmit}
									disabled={isLoading}
								>
									{this.state.Save}
								</button>
							</MediaQuery>
						</span>
					</div>
					{isLoading ? (
						<Spinner />
					) : (
							<div className="row">
								<div className=" col-md-4 pl-0">
									<div className="row left-side-outer">
										<div className="col-sm-12 left-side-inner">
											<UploadProfile
												requiredMark={profile && !profile.profilePicturePath}
												dispatch={this.props.dispatch}
												userStoreData={this.props.userStoreData}
												country={this.state.countryId}
												file={this.state.profileimage}
												edit={true}
												imageuoload={() => this.imageuoload()}
												pictureRequire={this.state.imagerequire}
											/>

											<div>
												<div className="edit-fields">
													<input
														type="text"
														placeholder="User Name"
														value={this.state.userName}
														onChange={(e) =>
															this.setState({ userName: e.target.value })
														}
													/>
													<select
														placeholder="Country"
														name="country"
														value={this.state.countryId}
														onChange={this.handleCountryChange.bind(this)}
													>
														{countriesList.length > 0 &&
															countriesList.map((item, index) => {
																return (
																	<option key={index} value={item.id}>
																		{item.name}
																	</option>
																);
															})}
													</select>
												</div>
												<div className="social-links">
													<div className="facebook">
														<i className="fa fa-facebook" />
														<input
															type="text"
															value={this.state.facebook}
															onChange={(e) =>
																this.setState({ facebook: e.target.value })
															}
															placeholder="Enter your URL"
														/>
													</div>
													<div className="linkedin">
														<i className="fa fa-linkedin" />
														<input
															type="text"
															value={this.state.linkedin}
															onChange={(e) =>
																this.setState({ linkedin: e.target.value })
															}
															placeholder="Enter your URL"
														/>
													</div>
													<div className="skype">
														<i className="fa fa-skype" />
														<input
															type="text"
															value={this.state.skype}
															onChange={(e) =>
																this.setState({ skype: e.target.value })
															}
															placeholder="Enter your ID"
														/>
													</div>
												</div>
												<div className="member-details">
													{this.state.registerDate !== 0 && (
														<p className="mt-2">
															Member since:{" "}
															<span>
																<Moment format=" MMM D YYYY">
																	{/*{this.localdate(*/}
																	{/*new Date(this.state.registerDate)*/}
																	{/*)}*/}
																	{this.state.registerDate}
																</Moment>
															</span>
														</p>
													)}
													{this.state.lastLoginTime !== 0 && (
														<p className="mt-2">
															Last logged:&nbsp;
														<span>
																{" "}
																<Moment fromNow ago>
																	{this.localdate(
																		new Date(this.state.lastLoginTime)
																	)}
																</Moment>{" "}
																ago
														</span>
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className=" col-md-8 pr-0 right-side" id="freelanceredi">
									<div className="row ">
										<div className="col-sm-12 pr-0 freelancer-fields">
											<div className="right-side-inner">
												<div className='input-required'>
													<label className={this.state.title ? 'hidden' : ''}>
														<span className="first-letter">*</span>
													</label>
													<input
														type="text"
														placeholder="Your Title"
														value={this.state.title}
														onChange={(e) =>
															this.setState({ title: e.target.value })
														}
													/>
												</div>
												<MediaQuery minDeviceWidth="768px">
													{
														this.state.titlerequire &&
														<p className="red-color1">*Required</p>
													}
												</MediaQuery>
												<textarea
													type="text"
													placeholder="Your Description"
													value={this.state.describe}
													onChange={(e) =>
														this.setState({ describe: e.target.value })
													}
												/>
											</div>
										</div>
									</div>
									<div className="row options-row freelancer-fields">
											<select
												value={this.state.salary}
												onChange={(e) =>
													this.setState({ salary: e.target.value })
												}
											>
												<option defaultValue>Salary/Month (USD)</option>
												{salaryrange.map((item, index) => {
													return (
														<option value={item}>
															${item}
															{index === salaryrange.length - 1 ? "+" : ""}
														</option>
													);
												})}
											</select>
											<select
												value={this.state.availability}
												onChange={(e) =>
													this.setState({ availability: e.target.value })
												}
											>
												<option value="0">Availability</option>

												<option value="1">Full-Time</option>
												<option value="2">Part-Time</option>
												<option value="3">Freelance</option>
											</select>
											<select
												value={this.state.education}
												onChange={(e) =>
													this.setState({ education: e.target.value })
												}
											>
												<option defaultValue>Education</option>
												<option value="Master">Master</option>
												<option value="Bachelor">Bachelor</option>
												<option value="College Level">College Level</option>
												<option value="Self-taught">Self-taught</option>
											</select>
											<select
												value={this.state.experience}
												onChange={(e) =>
													this.setState({ experience: e.target.value })
												}
											>
												<option defaultValue>Experience</option>
												<option value="1 years">1 year</option>
												<option value="2 years">2 years</option>
												<option value="3 years">3 years</option>
												<option value="4 years">4 years</option>
												<option value="5 years">5 years</option>
												<option value="6 years">6 years</option>
												<option value="7 years">7 years</option>
												<option value="8 years">8 years</option>
												<option value="9 years">9 years</option>
												<option value="10+ years">10+ years</option>
											</select>
									</div>
									<div className='input-required-tags'>
										<label className={this.state.tags.length ? 'hidden' : ''}>
											<span className="first-letter">*</span>
										</label>
										<ReactTags
											name="jobSkills"
											placeholder={"Your Skills"}
											onChange={(e) => this.onChangetag(e)}
											tags={this.state.tags}
											suggestions={this.props.jobs && this.props.jobs.suggestions}
											handleDelete={this.handleDelete.bind(this)}
											handleAddition={this.handleAddition.bind(this)}
											allowBackspace={false}
											autofocus={false}
										/>
									</div>
									<p className={'skills-advice'}>*You must type them manually and select them from our list of skills.</p>
									<MediaQuery minDeviceWidth="768px">
										{
											this.state.skillrequire &&
											<div style={{ paddingLeft: "15px" }}>
												<p className="red-color1">*Required</p>
											</div>
										}
									</MediaQuery>
									<div className="row skills">
										<div className="col-sm-12 freelancer-fields">
											<div className="mini-head">
												<h4>Portfolio</h4>
												<div className="input-array">
													<div className="portfolio-input">
														<img
															src={require("../../../assets/attach.png")}
															alt=""
														/>
														<p>
															{this.state.selectedPortifolio &&
																this.state.selectedPortifolio.filename
																? this.state.selectedPortifolio.filename.slice(0, 15)
																: "Select a file"}
															{
																this.state.selectedPortifolio &&
																this.state.selectedPortifolio.filename &&
																this.state.selectedPortifolio.filename.length > 15 && "..."
															}
														</p>
														<input
															type="file"
															placeholder="Name"
															onChange={this.loadPortfolio.bind(this)}
														/>
													</div>
													<div>
														<input
															type="text"
															className="form-input"
															name="portifolioName"
															placeholder="Name"
															onChange={this.setPortifolioName}
															value={
																this.state.selectedPortifolio &&
																	this.state.selectedPortifolio.name
																	? this.state.selectedPortifolio.name
																	: ""
															}
														/>
													</div>
													{/*<input type="text" onChange={this.loadPortfolios.bind(this)} placeholder="Enter your file name"/>*/}
													<i
														className="fa fa-plus-square"
														onClick={this.addPortfolio.bind(this)}
													/>
													<p>{this.state.uploading}</p>
												</div>
												<div className="added-portfolio portfolio-wrapper">
													{this.state.portflioFiles.length > 0 && (
														this.state.portflioFiles.map((item, index) => {
															return (
																<div>
																	<div className="portfolio-file" key={index}>
																		{
																			item.fileExtension === "" ?
																				<img
																					src={item.src ? item.src : item.filePath}
																					alt={item.filename}
																					style={{
																						width: "100%",
																						zIndex: "1",
																						float: "left",
																						clear: "both"
																					}}
																				/> : <img
																					src={placeholdericon}

																					style={{
																						width: "100%",
																						zIndex: "1",
																						float: "left",
																						clear: "both"
																					}}
																				/>
																		}
																		<p className="fileextension">
																			{
																				item.fileExtension !== "" && item.fileExtension
																			}
																		</p>

																	</div>
																	<p className="black">{item.name ? item.name : item.filename}</p>
																	<i
																		className="fa fa-times-circle"
																		onClick={() =>
																			this.removePortfolio(index, item.id)
																		}
																		style={{
																			zIndex: "2"
																		}}
																	/>
																</div>
															);
														})
													)}
													{this.state.portfolioArr.length > 0 && (
														this.state.portfolioArr.map((item, index) => {
															return (
																<div>
																	<a href={item.filePath}>
																		<div className="portfolio-file position-relative" key={index}>
																			{
																				item.fileExtension === "" ?
																					<img
																						src={item.thumbnail}
																						alt={item.fileName}
																						style={{
																							width: "100%",
																							zIndex: "1",
																							float: "left",
																							clear: "both"
																						}}
																					/> :
																					<img
																						src={placeholdericon}

																						style={{
																							width: "100%",
																							zIndex: "1",
																							float: "left",
																							clear: "both"
																						}}
																					/>

																			}
																			<p className="fileextension">
																				{
																					item.fileExtension !== "" && item.fileExtension
																				}
																			</p>

																		</div>
																	</a>
																	<p>{item.fileName ? item.fileName : ""}</p>
																	<i
																		className="fa fa-times-circle"
																		onClick={() =>
																			this.deletePortifolioFromDatabase(
																				index,
																				item.id
																			)
																		}
																		style={{
																			zIndex: "2"
																		}}
																	/>
																</div>
															);
														})
													)}
												</div>
												<MediaQuery maxDeviceWidth="767px">
													<div className={'errors-edit-profile-mobile'}>
														{
															this.state.skillrequire &&
																<p className="red-color1">* At least one skill required</p>
														}
														{
															this.state.imagerequire &&
															<p className="red-color1">* Picture required</p>
														}
														{
															this.state.titlerequire &&
															<p className="red-color1">* Title required</p>
														}
													</div>
													<span className='freelancer-save-bottom-wrapper'>
														<button
															className="btn save-btn text-uppercase freelancer-edit-save-bottom"
															onClick={this.handlesubmit}
															disabled={isLoading}
														>
															{this.state.Save}
														</button>
													</span>
												</MediaQuery>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ auth, jobs, account }) => {
	return {
		loggedIn: auth.isAuthenticated,
		userStoreData: auth.user,
		profile: account.profile,
		jobs
	};
};

const mapDispachToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};
export default connect(
	mapStateToProps,
	mapDispachToProps
)(Profile);

function convertSkillsToArray(skills) {
	if (skills) {
		let ar = skills.split(" | ");
		let intAr = ar.map((item) => {
			return parseInt(item);
		});
		return intAr;
	}
	return [];
}
