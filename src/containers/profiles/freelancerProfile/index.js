import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Moment from "react-moment";
import placeholder from "../../../assets/img_avatar.svg";

import placeholdericon from "../../../assets/icons.png"
import { apiPath } from "../../../services/config";

import Spinner from "../../../components/spinner";
import {parsedSocialLink} from "../../../utils/parseSocialLink";
import MediaQuery from "react-responsive";

import {getProfileInfo } from '../../accountSetting/actions';

import MetaTags from 'react-meta-tags';
import {mobileVendor} from "react-device-detect";
import TextParser from "../../../utils/TextParser";

const ProfileWork = ({ history,getProfileInfo, match, auth: { user } }, props) => {
	const [profileData, setProfile] = useState(null);
	const [loader, setLoader] = useState(true);
	const [portfolio, setPortfolio] = useState([]);
	useEffect(() => {
        window.scrollTo(0, 0);
        getProfileInfo(user.userTypeId)
		axios.get(apiPath + "/account/profile").then((res) => {

			setProfile(res.data);
            let portfolios=[];
            res.data.portfolios.map((item)=>{
                const file = item.filePath;
                const  fileType = file.substr(file.lastIndexOf('.') + 1);
                const validImageTypes = ['gif', 'jpg', 'png','jpeg'];
                if (validImageTypes.includes(fileType)){
                    portfolios.push({
                        fileExtension: "",
                        fileName: item.fileName,
                        filePath: item.filePath,
                        id: item.id,
                        thumbnail: item.thumbnail
                    })
                }
                else{
                    portfolios.push({
                        fileExtension: fileType,
                        fileName: item.fileName,
                        filePath: item.filePath,
                        id: item.id,
                        thumbnail: item.thumbnail
                    })
                }
            })
            setPortfolio(portfolios)
			setLoader(false);
		});
	}, []);
	const localdate = (date) => {
        if (mobileVendor == "Apple") {
            return date
        } else {
            return new Date(
                date.getTime() - date.getTimezoneOffset() * 60 * 1000
            );
        }
	};

	let { dispatch, loggedIn } = props;


	const placehold =
		profileData &&
		profileData.profilePicturePath &&
		profileData.profilePicturePath
			? profileData.profilePicturePath
			: placeholder;

	return (
		<div className="registration freelancer-profile" id="edit-profile">
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
			{loader ? (
				<Spinner />
			) : (
				<div className="container pt-3 row-padd">
					<div className=" row inner-div pl-0">
						<h1>Candidate</h1>
						<div className="work-profile" style={{}}>
							{user && user.userTypeId === 2 && (
								<button
									className="btn save-btn text-uppercase"
									onClick={() => history.push(`/edit-profile`)}
								>
									Edit
								</button>
							)}
							{user && user.userTypeId === 1 && (
								<div className="web-line">
									<button className="btn save-btn text-uppercase">
										Add to favorites
									</button>
									<button className="btn save-btn text-uppercase">
										Message
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="row">
						<div className=" col-md-4 pl-0">
							<div className="row left-side-outer">
								<div className="col-sm-12 left-side-inner">
									<div className="user-div">
										<div className="user-pic-upload p-0">
											<img
												src={placehold}
												alt=""
												style={{
													width: "100%",
													height: "100%",
													borderRadius: "50%"
												}}
											/>
										</div>
										<div className="user-pic">
											<span>
												<h4>{profileData !== null && profileData.fullName}</h4>
											</span>
											<p className="text-center">
												{profileData !== null && profileData.countryName}
											</p>
										</div>
									</div>

									<div className="member-details second-profile">
										<p>
											Member since:{" "}
											<span>
												{profileData !== null && profileData.memberSince && (
													<Moment format="MMM D YYYY">
                                                        {
                                                            profileData&&profileData.memberSince &&profileData.memberSince
                                                        }
													</Moment>
												)}
											</span>
										</p>
										<p className="mt-2">
											Last logged:&nbsp;
											<span>
												{profileData !== null && profileData.lastLoginTime && (
													<Moment fromNow ago>
														{profileData !== null &&
															localdate(new Date(profileData.lastLoginTime))}
													</Moment>
												)}
												&nbsp;{""}
												{profileData !== null && profileData.lastLoginTime
													? "ago"
													: ""}
											</span>
										</p>
									</div>
									<div>
										<div className="social-links">
											{profileData !== null &&
												profileData.socialMediaLinks &&
												profileData.socialMediaLinks.facebool && (
													<div className="facebook">
														<i className="fa fa-facebook" />
														<p><a target="_blank" href={parsedSocialLink(profileData.socialMediaLinks.facebool)}>
															View Facebook profile
														</a> </p>
													</div>
												)}
											{profileData !== null &&
												profileData.socialMediaLinks &&
												profileData.socialMediaLinks.linkedIn && (
													<div className="linkedin">
														<i className="fa fa-linkedin" />
														<p><a target="_blank" href={parsedSocialLink(profileData.socialMediaLinks.linkedIn)}>
															View LinkedIn Profile
														</a></p>
													</div>
												)}
											{profileData !== null &&
												profileData.socialMediaLinks &&
												profileData.socialMediaLinks.skype && (
													<div className="skype">
														<i className="fa fa-skype" />
														<p>{profileData.socialMediaLinks.skype}</p>
													</div>
												)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className=" col-md-8 pr-0 pl-0 right-side">
							<div className="right-side-top" style={{
								marginLeft:"15px"
							}}>
								{profileData !== null && profileData.title && (
                                    <h4>{profileData.title && <TextParser text={profileData.title}/>}</h4>
								)}

								{profileData !== null && profileData.title === null && (
									<p>Your Title: N/A</p>
								)}
								{profileData !== null &&
									profileData.description &&
									profileData.description && (
                                    <p style={{ height: "100%" }}><TextParser text={profileData.description}/></p>
									)}

								{profileData !== null && profileData.description === null && (
									<p className="">Your Description: N/A</p>
								)}
							</div>
							<MediaQuery minDeviceWidth="768px">
								<table style={{
									marginLeft:"15px"
								}}>
									<thead>
										<tr>
											<th>EXPECTED SALARY</th>
											<th>AVAILABILTY</th>
											<th>EDUCATION</th>
											<th>EXPERIENCE</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td
												className={
													profileData !== null && profileData.salary && profileData.salary !=="Salary/Month (USD)"
														? "pl-0 text-center"
														: "pl-0 text-center font-weight-bold"
												}
											>
												{profileData !== null && profileData.salary && profileData.salary !=="Salary/Month (USD)"
													? parseInt(profileData.salary)===2000 ?
														"$"+profileData.salary+"+/Month":"$"+profileData.salary+"/Month"
													: "N/A"}
											</td>
											<td
												className={
													profileData !== null && profileData.availability && profileData.availability!=="0"
														? "pl-0 text-center"
														: "pl-0 text-center font-weight-bold"
												}
											>
												{profileData !== null && profileData.availability && profileData.availability!=="0"
													? profileData.availability
													: "N/A"}


											</td>
											<td
												className={
													profileData !== null && profileData.education
														? "pl-0 text-center"
														: "pl-0 text-center font-weight-bold"
												}
											>
												{profileData !== null && profileData.education
													? profileData.education
													: "N/A"}
											</td>
											<td
												className={
													profileData !== null && profileData.experience
														? "pl-0 text-center"
														: "pl-0 text-center font-weight-bold"
												}
											>
												{profileData !== null && profileData.experience
													? profileData.experience
													: "N/A"}
											</td>
										</tr>
									</tbody>
								</table>
							</MediaQuery>
							<MediaQuery maxDeviceWidth="767px">
								<table style={{
									marginLeft:"15px"
								}}>
									<thead>
									<tr style={{textAlign: 'center'}}>
										<th style={{width: '50%'}}>EXPECTED SALARY</th>
										<th style={{width: '50%'}}>AVAILABILTY</th>
									</tr>
									</thead>
									<tbody>
									<tr style={{textAlign: 'center'}}>
										<td
											className={
												profileData !== null && profileData.salary && profileData.salary !=="Salary/Month (USD)"
													? "pl-0 text-center"
													: "pl-0 text-center font-weight-bold"
											}
										>
											{profileData !== null && profileData.salary && profileData.salary !=="Salary/Month (USD)"
												? parseInt(profileData.salary)===2000 ?
													"$"+profileData.salary+"+/Month":"$"+profileData.salary+"/Month"
												: "N/A"}
										</td>
										<td
											className={
												profileData !== null && profileData.availability && profileData.availability!=="0"
													? "pl-0 text-center"
													: "pl-0 text-center font-weight-bold"
											}
										>
											{profileData !== null && profileData.availability && profileData.availability!=="0"
												? profileData.availability
												: "N/A"}


										</td>
									</tr>
									</tbody>
								</table>
								<table style={{
									marginLeft:"15px"
								}}>
									<thead style={{textAlign: 'center'}}>
									<tr>
										<th style={{width: '50%'}}>EDUCATION</th>
										<th style={{width: '50%'}}>EXPERIENCE</th>
									</tr>
									</thead>
									<tbody>
									<tr style={{textAlign: 'center'}}>
										<td
											className={
												profileData !== null && profileData.education
													? "pl-0 text-center"
													: "pl-0 text-center font-weight-bold"
											}
										>
											{profileData !== null && profileData.education
												? profileData.education
												: "N/A"}
										</td>
										<td
											className={
												profileData !== null && profileData.experience
													? "pl-0 text-center"
													: "pl-0 text-center font-weight-bold"
											}
										>
											{profileData !== null && profileData.experience
												? profileData.experience
												: "N/A"}
										</td>
									</tr>
									</tbody>
								</table>
							</MediaQuery>
							<div className="row skills ml-15" >
								<div className="col-sm-12 pl-0">
									<div className="mini-head">
										<h4 className="ml-15">Skills</h4>
										<div className="added-skills">
											{profileData !== null &&
												profileData.skills &&
												profileData.skills.map((item, index) => {
													return (
														<div
															className={
																index === 0
																	? "skill mr-0 mt-3 ml-15"
																	: "skill mr-0 ml-15  mt-3"
															}
														>
															<p className="mr-0  ">{item.name}</p>
															&nbsp;
														</div>
													);
												})}
											{profileData !== null &&
												profileData.skills &&
												profileData.skills.length === 0 && (
													<div className=" mr-0 ml-15 font-weight-bold">N/A</div>
												)}
										</div>
									</div>
								</div>
							</div>
							<div className="row skills">
								<div className="col-sm-12 pl-0">
									<div className="mini-head">
										<h4 className="ml-15">Portfolio</h4>
										<div className="added-portfolio ml-15">
											{portfolio.length>0&&
                                            portfolio.map((item, index) => {
													return (
														<a href={item.filePath} target="_blank">
															<div className="portfolio-file">

                                                                {
                                                                    item.fileExtension=== "" ?
																		<img
																			src={item.thumbnail}
																			alt={item.fileName}
																			className="portfolio-file-picture"
																		/>:
																		<img
																			src={placeholdericon}
																			alt={item.fileName}
																			className="portfolio-file-picture"
																		/>


                                                                }
																<p className="fileextension">
                                                                    {
                                                                        item.fileExtension!== ""&&  item.fileExtension
                                                                    }
																</p>
															</div>
															<p className="black">
																{item.fileName.slice(0, 10)}
																{item.fileName.length > 10 ? "..." : ""}
															</p>
														</a>
													);
												})}
											{portfolio &&
                                            portfolio.length === 0 && (
													<a className="font-weight-bold"> N/A</a>
												)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,

});
export default connect(mapStateToProps,{getProfileInfo})(ProfileWork);
