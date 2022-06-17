import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link, withRouter } from "react-router-dom";
import { logout } from "../../containers/auth/actions";
import PropTypes from "prop-types";
// import cookie from 'react-cookies';
import Menu from "./menu/index";
import { searchkey } from "./action";
import OutsideClick from "./menu/OutsideClick";
import MediaQuery from "react-responsive";
import { JobPostIcon } from "./JobPostIcon";
import { MessagesIcon } from "./MessagesIcon";
import {SearchIcon} from "./SearchIcon";
import {DashboardIcon} from "./DashboardIcon";

const MenuIcon = ({history, transactions, menushow, menuToggle, isAuthenticated, user, logout, disabled}) => {
    const currentPage = history.location.pathname;
	return (
				<div className='round-borders-new-wrapper' onClick={(e)=>{menuToggle(e)}}>
					<OutsideClick active={menushow} callBack={menuToggle.bind(this)}>
						<span className='round-borders-new'>
							<span className='round-borders-image'/>
						</span>
						<span>
							{!disabled && <ul className={!menushow ? 'hr-menu d-none' : 'hr-menu new-menu'} id="new-menu">
								{
									!isAuthenticated &&
									<ul className='hr-menu' onClick={(e)=>{	menuToggle(e)}}>
										<li><Link to="/how-it-works" refresh="true">how it works</Link></li>
										<li><Link to="/pricing">pricing</Link></li>
										<li><Link to="/sign-In">sign in</Link></li>
										<li><Link to="/register">sign up</Link></li>
										<li><Link className='text-orange' to="/sign-In">post a job</Link></li>
									</ul>
								}
								{
									isAuthenticated  &&user && user.userTypeId===1 &&
									<ul className='hr-menu'>
										<li className="hr-menu-username">
									<span onClick={()=>{
										history.push("/profile-hire")
									}}>{user.companyName ? user.companyName:user.fullName}</span>
											{
												user && (user.userTypeId) && (user.userTypeId === 1)
													? <div className='hr-menu-plan-upgrade'>
														{
															transactions&&transactions.subscriptionStatus ?
																<p className="">{transactions.subscriptionStatus.planName  }</p>:
																<p className="">Free</p>
														}
														<p>
															<a onClick={()=>{
																history.push("/pricing")
															}} className="pointer update-billing">
																{
																	transactions&&transactions.subscriptionStatus &&
																	transactions.subscriptionStatus.planName&& <b>(upgrade)</b>
																}
															</a>
														</p>
													</div> :
													""
											}
										</li>
										<hr style={{margin: '0 0 0 -20px'}}/>
										<li><Link to="/dashboard" onClick={()=>{
											currentPage==="/dashboard" ? window.location.reload():console.log(" ")
										}}>Dashboard</Link></li>
										<li><Link to="/search-work" onClick={()=>{
											currentPage==="/search-work" ? window.location.reload():console.log(" ")
										}}>Browse</Link></li>
										<li><Link to="/messages" onClick={()=>{
											currentPage==="/messages" ? window.location.reload():console.log(" ")
										}}>Messages</Link></li>
										<li><Link to="/post-job" onClick={()=>{
											currentPage==="/post-job" ? window.location.reload():console.log(" ")
										}}>Post a job</Link></li>
										<li><Link to="/profile-hire" onClick={()=>{
											currentPage==="/profile-hire" ? window.location.reload():console.log(" ")
										}}>Profile</Link></li>
										<li><Link to="/account-setting" onClick={()=>{
											currentPage==="/account-setting" ? window.location.reload():console.log(" ")
										}}>Account</Link></li>
										<li><Link to="/billing" onClick={()=>{
											currentPage==="/billing" ? window.location.reload():console.log(" ")
										}}>Billing</Link></li>
										<li><Link to="/favorites" onClick={()=>{
											currentPage==="/favorites" ? window.location.reload():console.log(" ")
										}}>Favorites</Link></li>
										<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
									</ul>
								}
								{
									isAuthenticated  &&user && user.userTypeId===2 &&
									<ul className='hr-menu'>
										<li className="hr-menu-username"><span onClick={()=>{
											history.push("/profile-work")
										}}>{user.companyName ? user.companyName:user.fullName}</span></li>
										<hr style={{margin: '0 0 0 -20px'}}/>
										<li><Link to="/dashboard" onClick={()=>{
											currentPage==="/dashboard" ? window.location.reload():console.log(" ")
										}}>Dashboard</Link></li>
										<li><Link to="/search-work" onClick={()=>{
											currentPage==="/search-work" ? window.location.reload():console.log(" ")
										}}>Browse</Link></li>
										<li><Link to="/messages" onClick={()=>{
											currentPage==="/messages" ? window.location.reload():console.log(" ")
										}}>Messages</Link></li>
										<li><Link to="/profile-work" onClick={()=>{
											currentPage==="/profile-work" ? window.location.reload():console.log(" ")
										}}>Profile</Link></li>
										<li><Link to="/favorites" onClick={()=>{
											currentPage==="/favorites" ? window.location.reload():console.log(" ")
										}}>Favorites</Link></li>
										<li><Link to="/account-setting" onClick={()=>{
											currentPage==="/account-setting" ? window.location.reload():console.log(" ")
										}}>Account</Link></li>
										<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
									</ul>
								}
							</ul>
							}
						</span>
					{/*</div>*/}
			</OutsideClick>
				</div>
	)
};


const Header = ({
	auth: { isAuthenticated, loading, user },
	logout,
	trans_details,
	profile,
	unreadCount,
	trans_subs,
	history,
	searchkey,
	props,
}) => {
	const [menushow, setMenushow] = useState(false);
	const [headerchange, setHeader] = useState("");
	const [SearchkeyWords, setSearch] = useState("");

	const search = (e) => {
		setSearch(e.target.value);
	};

	const menuToggle = (e) => {
		const { target: { className, parentElement: {className: parentClassName} } = {} } = e;
		if (className !== 'hr-menu' && parentClassName !== 'hr-menu') {
			setMenushow(!menushow);
		};
	};

	const _handleKeyDown = (e) => {
		if (e.key === "Enter" && SearchkeyWords !== "") {
			localStorage.setItem("keyword", SearchkeyWords);
			searchkey(SearchkeyWords);
			setSearch("");
			history.push("/search-work");
		}
	};

    const currentPage = history.location.pathname;

	const isNotCompletedWorker = profile && user && user.userTypeId && user.userTypeId === 2 && !profile.title && (!profile.skills || !profile.skills.length);

	const guestLinks = (
		<div className="row desktop-menu">
			<div className="logo col-md-3 pl-0">
				<Link to="/" onClick={()=>{
					currentPage==="/" ? window.location.reload():console.log(" ")
                }}>
					<img src={require("../../assets/loho.png")} alt="" />
				</Link>
			</div>
			<div className="navigationbar col-md-7 d-flex justify-content-between align-items-center  ">
				<div className="main-nav">
					<span className="text-uppercase">
						<Link to="/how-it-works"
							  onClick={()=>{
                                  currentPage==="/how-it-works" ? window.location.reload():console.log(" ")
                              }}

						>how it works</Link>
					</span>
					<span className="text-uppercase">
						<Link  onClick={()=>{
                            currentPage==="/pricing" ? window.location.reload():console.log(" ")
                        }} to="/pricing">pricing</Link>
					</span>
				</div>
				<div className="auth-links">
					<span className="text-uppercase">
						<Link  onClick={()=>{
                            currentPage==="/sign-In" ? window.location.reload():console.log(" ")
                        }}  to="/sign-In">sign in</Link>
					</span>
					<span className="text-uppercase">
						<Link to="/register"
							  onClick={()=>{
                                  currentPage==="/register" ? window.location.reload():console.log(" ")
                              }}
						>sign up</Link>
					</span>
				</div>
			</div>
			<div className="job-post col-md-2 d-flex align-items-center justify-content-end p-0">
				<Link to="/register"   onClick={()=>{
                    currentPage==="/register" ? window.location.reload():console.log(" ")
                }}>
					{" "}
					<button className="btn text-uppercase">post a job</button>
				</Link>
			</div>
		</div>
	);
	const authLinks = (
		<div className="row desktop-menu">
				<div className="logo col-md-3 pl-0">
				{user && user.userTypeId && user.userTypeId === 1 ? (
					<Link  onClick={()=>{
						currentPage==="/dashboard" ? window.location.reload():console.log(" ")
					}} to="/dashboard">
						<img src={require("../../assets/loho.png")} alt="" />
					</Link>
				) : (
					<span>
						{!isNotCompletedWorker ?
							<Link onClick={()=>{
								currentPage==="/dashboard-work" ? window.location.reload():console.log(" ")
							}} to="/dashboard-work">
								<img src={require("../../assets/loho.png")} alt="" />
							</Link> : <img src={require("../../assets/loho.png")} alt="" />}
					</span>
				)}
			</div>
			{!isNotCompletedWorker && [
				<div key="navigationbar" className="navigationbar col-md-8 d-flex justify-content-between align-items-center pr-0 pl-0 ">
				<div key="signed-in-menu" className="signed-in-menu">
					<div className="search-div">
						<input
							type="text"
							placeholder="Search..."
							onChange={(e) => {
								search(e);
							}}
							onKeyDown={(e) => _handleKeyDown(e)}
							value={SearchkeyWords}
						/>
					</div>
					<span className="text-uppercase">
						{user && user.userTypeId && user.userTypeId === 1 ? (
							<Link  onClick={()=>{
								currentPage==="/dashboard" ? window.location.reload():console.log(" ")
							}} to="/dashboard">Dashboard</Link>
						) : (
							<Link onClick={()=>{
								currentPage==="/dashboard-work" ? window.location.reload():console.log(" ")
							}} to="/dashboard-work">Dashboard</Link>
						)}
					</span>
					<span className="text-uppercase">
						<Link to="/search-work" onClick={()=>{
							currentPage==="/search-work" ? window.location.reload():console.log(" ")
						}}>Browse</Link>
					</span>
					{window.location.pathname.indexOf("/messages") > -1 ? (
						<span className="text-uppercase">
							<a onClick={()=>{
								currentPage==="/messages" ? window.location.reload():console.log(" ")
							}} className="pointer">Messages</a>
							{unreadCount && unreadCount > 0 ? (
								<span className="notifi">{unreadCount}</span>
							) : (
								<span></span>
							)}
						</span>
					) : (
						<span className="text-uppercase">
							<Link onClick={()=>{
								currentPage==="/messages" ? window.location.reload():console.log(" ")
							}} to="/messages">Messages</Link>
							{unreadCount && unreadCount > 0 ? (
								<span className="notifi">{unreadCount}</span>
							) : (
								<span></span>
							)}
						</span>
					)}

					{user && user.userTypeId && user.userTypeId === 1 ? (
						<span className="text-uppercase">
							<Link onClick={()=>{
								currentPage==="/post-job" ? window.location.reload():console.log(" ")
							}} to="/post-job">post a job</Link>
						</span>
					) : (
						""
					)}
				</div>
			</div>,
			<Menu
				key="menu"
				user={user}
				profile={profile}
				transactions={trans_subs}
				logout={logout}
				history={history}
				currentPage={currentPage}
			/>
			]}
		</div>
	);

	return (
		<Fragment>
			{!isAuthenticated &&
				<div className="overallsectionsdiv">
					<div className="header mt-3 mb-3">
						<div className="container">
							{isAuthenticated ? authLinks : guestLinks}
							{/*mobile menu*/}
							<div className="row mobile-menu align-items-center">
								<span className='round-borders'></span>
								<div className="navigationbar col-2 ">
									<OutsideClick active={menushow} callBack={menuToggle.bind(this)}>
										<div onClick={(e)=>{menuToggle(e)}} className="" id="menuToggle">
											<input checked={menushow} onChange={()=> console.log("")} type="checkbox"/>
											<span></span>
											<span></span>
											<span></span>
											<ul className={!menushow ? 'hr-menu d-none' : 'hr-menu'} id="menu">
												{
													!isAuthenticated &&
													<ul className='hr-menu' onClick={(e)=>{	menuToggle(e)}}>
														<li>
															<Link to="/how-it-works"
																  onClick={()=>{
                                                                      currentPage==="/how-it-works" ? window.location.reload():console.log(" ")
                                                                  }}
														>how it works
															</Link>
														</li>
														<li><Link to="/pricing"
																  onClick={()=>{
                                                                      currentPage==="/pricing" ? window.location.reload():console.log(" ")
                                                                  }}
														>pricing</Link></li>
														<li><Link to="/sign-In" onClick={()=>{
                                                            currentPage==="/sign-In" ? window.location.reload():console.log(" ")
                                                        }}>sign in</Link></li>
														<li><Link to="/register" onClick={()=>{
                                                            currentPage==="/register" ? window.location.reload():console.log(" ")
                                                        }}>sign up</Link></li>
														<li><Link className='text-orange' to="/sign-In" onClick={()=>{
                                                            currentPage==="/sign-In" ? window.location.reload():console.log(" ")
                                                        }}>post a job</Link></li>
													</ul>
												}
												{
													isAuthenticated  &&user && user.userTypeId===1 &&
													<ul className='hr-menu'>
														<li><Link to="/dashboard" onClick={()=>{
                                                            currentPage==="/dashboard" ? window.location.reload():console.log(" ")
                                                        }}>Dashboard</Link></li>
														<li><Link to="/search-work" onClick={()=>{
                                                            currentPage==="/search-work" ? window.location.reload():console.log(" ")
                                                        }}>Browse</Link></li>
														<li><Link to="/messages" onClick={()=>{
                                                            currentPage==="/messages" ? window.location.reload():console.log(" ")
                                                        }}>Messages</Link></li>
														<li><Link to="/post-job" onClick={()=>{
                                                            currentPage==="/post-job" ? window.location.reload():console.log(" ")
                                                        }}>Post a job</Link></li>
														<li><Link to="/profile-hire" onClick={()=>{
                                                            currentPage==="/profile-hire" ? window.location.reload():console.log(" ")
                                                        }}>Profile</Link></li>
														<li><Link to="/account-setting" onClick={()=>{
                                                            currentPage==="/account-setting" ? window.location.reload():console.log(" ")
                                                        }}>Account</Link></li>
														<li><Link to="/billing" onClick={()=>{
                                                            currentPage==="/billing" ? window.location.reload():console.log(" ")
                                                        }}>Billing</Link></li>
														<li><Link to="/favorites" onClick={()=>{
                                                            currentPage==="/favorites" ? window.location.reload():console.log(" ")
                                                        }}>Favorites</Link></li>
														<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
													</ul>
												}
												{
													isAuthenticated  &&user && user.userTypeId===2 &&
													<ul className='hr-menu'>
														<li><Link to="/dashboard" onClick={()=>{
                                                            currentPage==="/dashboard" ? window.location.reload():console.log(" ")
                                                        }}>Dashboard</Link></li>
														<li><Link to="/search-work" onClick={()=>{
                                                            currentPage==="/search-work" ? window.location.reload():console.log(" ")
                                                        }}>Browse</Link></li>
														<li><Link to="/messages" onClick={()=>{
                                                            currentPage==="/messages" ? window.location.reload():console.log(" ")
                                                        }}>Messages</Link></li>
														<li><Link to="/account-setting" onClick={()=>{
                                                            currentPage==="/account-setting" ? window.location.reload():console.log(" ")
                                                        }}>Account</Link></li>
														<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
													</ul>
												}
											</ul>
										</div>
									</OutsideClick>
								</div>
								<div className="logo col-6">
									<Link to="/" onClick={()=>{
                                        currentPage==="/" ? window.location.reload():console.log(" ")
                                    }}>
										<img src={require("../../assets/loho.png")} alt="" />
									</Link>
								</div>
								<div className="job-post mobile-header d-flex align-items-end">
									<Link to="/register" onClick={()=>{
                                        currentPage==="/register" ? window.location.reload():console.log(" ")
                                    }}>
										<button className="btn text-uppercase">post a job</button>
									</Link>
								</div>
							</div>

						</div>
					</div>
				</div>
			}
			{!!isAuthenticated &&
				[<MediaQuery maxDeviceWidth="767px" key="105015798243759287598237109870">
						<div className="mobile-menu-new">
							<MenuIcon history={history} transactions={trans_subs} isAuthenticated={isAuthenticated} user={user} menushow={menushow}
									  menuToggle={menuToggle} logout={logout} disabled={isNotCompletedWorker}/>
							{!isNotCompletedWorker &&
							<div className="header-right-group">
								<Link className='header-icons-wrapper' to={'/dashboard'} onClick={()=>{
									currentPage==="/dashboard" ? window.location.reload():console.log(" ")
								}}>
									<DashboardIcon color={currentPage === '/dashboard' || currentPage === '/dashboard-work' ? '#ED7B18' : ''} className='dash-icon'/>
								</Link>
								<Link className='header-icons-wrapper' to={'/search-work'} onClick={()=>{
									currentPage==="/search-work" ? window.location.reload():console.log(" ")
								}}>
									<SearchIcon color={currentPage === '/search-work' ? '#ED7B18' : ''} className='search-icon'/>
								</Link>
								<Link className='mail-icon header-icons-wrapper' to="/messages" onClick={()=>{
									currentPage==="/messages" ? window.location.reload():console.log(" ")
								}}>
									{!!unreadCount &&
									<span className='mail-icon-counter'>
							            <span className='mail-icon-counter-text'>{unreadCount}</span>
						            </span>}
									<MessagesIcon color={currentPage === '/messages' ? '#ED7B18' : ''} className='mail-icon'>
									</MessagesIcon>
								</Link>
								{isAuthenticated && user && user.userTypeId === 1 &&
								<Link className='header-icons-wrapper' to="/post-job" onClick={()=>{
									currentPage==="/post-job" ? window.location.reload():console.log(" ")
								}}>
									<JobPostIcon color={currentPage === '/post-job' ? '#ED7B18' : ''} className='post-job-icon' />
								</Link>
								}
							</div>
							}
						</div>
					</MediaQuery>,
					<MediaQuery minDeviceWidth="768px" key="2059jwoi2890nakfnolnkt209tiobglo2394">
						<div className="overallsectionsdiv">
							<div className="header mt-3 mb-3">
								<div className="container">
									{isAuthenticated ? authLinks : guestLinks}
									{/*mobile menu*/}
									<div className="row mobile-menu align-items-center">
										<span className='round-borders'></span>
										<div className="navigationbar col-2 ">
											<OutsideClick active={menushow} callBack={menuToggle.bind(this)}>
												<div onClick={(e)=>{menuToggle(e)}} className="" id="menuToggle">
													<input checked={menushow}
														   onChange={(e)=>{ console.log("")}}
														   type="checkbox"/>

													<span></span>
													<span></span>
													<span></span>
													{/*<div className="ul">*/}

													<ul className={!menushow ? 'hr-menu d-none' : 'hr-menu'} id="menu">
														{
															!isAuthenticated &&
															<ul className='hr-menu' onClick={(e)=>{	menuToggle(e)}}>
																<li><Link to="/how-it-works" onClick={()=>{
                                                                    currentPage==="/how-it-works" ? window.location.reload():console.log(" ")
                                                                }}>how it works</Link></li>
																<li><Link to="/pricing" onClick={()=>{
                                                                    currentPage==="/pricing" ? window.location.reload():console.log(" ")
                                                                }}>pricing</Link></li>
																<li><Link to="/sign-In" onClick={()=>{
                                                                    currentPage==="/sign-In" ? window.location.reload():console.log(" ")
                                                                }}>sign in</Link></li>
																<li><Link to="/register" onClick={()=>{
                                                                    currentPage==="/register" ? window.location.reload():console.log(" ")
                                                                }}>sign up</Link></li>
																<li><Link className='text-orange' to="/sign-In" onClick={()=>{
                                                                    currentPage==="/sign-In" ? window.location.reload():console.log(" ")
                                                                }}>post a job</Link></li>
															</ul>
														}
														{
															isAuthenticated  &&user && user.userTypeId===1 &&
															<ul className='hr-menu'>
																<li><Link to="/dashboard" onClick={()=>{
                                                                    currentPage==="/dashboard" ? window.location.reload():console.log(" ")
                                                                }}>Dashboard</Link></li>
																<li><Link to="/search-work" onClick={()=>{
                                                                    currentPage==="/search-work" ? window.location.reload():console.log(" ")
                                                                }}>Browse</Link></li>
																<li><Link to="/messages" onClick={()=>{
                                                                    currentPage==="/messages" ? window.location.reload():console.log(" ")
                                                                }}>Messages</Link></li>
																<li><Link to="/post-job" onClick={()=>{
                                                                    currentPage==="/post-job" ? window.location.reload():console.log(" ")
                                                                }}>Post a job</Link></li>
																<li><Link to="/profile-hire" onClick={()=>{
                                                                    currentPage==="/profile-hire" ? window.location.reload():console.log(" ")
                                                                }}>Profile</Link></li>
																<li><Link to="/account-setting" onClick={()=>{
                                                                    currentPage==="/account-setting" ? window.location.reload():console.log(" ")
                                                                }}>Account</Link></li>
																<li><Link to="/billing" onClick={()=>{
                                                                    currentPage==="/billing" ? window.location.reload():console.log(" ")
                                                                }}>Billing</Link></li>
																<li><Link to="/favorites" onClick={()=>{
                                                                    currentPage==="/favorites" ? window.location.reload():console.log(" ")
                                                                }}>Favorites</Link></li>
																<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
															</ul>
														}
														{
															isAuthenticated  &&user && user.userTypeId===2 &&
															<ul className='hr-menu'>
																<li><Link to="/dashboard" onClick={()=>{
                                                                    currentPage==="/dashboard" ? window.location.reload():console.log(" ")
                                                                }}>Dashboard</Link></li>
																<li><Link to="/search-work" onClick={()=>{
                                                                    currentPage==="/search-work" ? window.location.reload():console.log(" ")
                                                                }}>Browse</Link></li>
																<li><Link to="/messages" onClick={()=>{
                                                                    currentPage==="/messages" ? window.location.reload():console.log(" ")
                                                                }}>Messages</Link></li>
																<li><Link to="/account-setting" onClick={()=>{
                                                                    currentPage==="/account-setting" ? window.location.reload():console.log(" ")
                                                                }}>Account</Link></li>
																<li><Link to="/" onClick={() => logout&&logout()}>Logout</Link></li>
															</ul>
														}
													</ul>

													{/*</div>*/}
												</div>
											</OutsideClick>
										</div>
										<div className="logo col-6">
											<Link to="/" onClick={()=>{
                                                currentPage==="/" ? window.location.reload():console.log(" ")
                                            }}>
												<img src={require("../../assets/loho.png")} alt="" />
											</Link>
										</div>
										<div className="job-post  mobile-header d-flex align-items-end">
											<Link to="/register" onClick={()=>{
                                                currentPage==="/register" ? window.location.reload():console.log(" ")
                                            }}>
												<button className="btn text-uppercase">post a job</button>
											</Link>
										</div>
									</div>
									{/*mobile menu*/}
								</div>
							</div>
						</div>
					</MediaQuery>]
				}
		</Fragment>
	)
};
// Header.propTypes = {
// 	logout: PropTypes.func.isRequired,
// 	auth: PropTypes.object.isRequired,
// 	profile: PropTypes.object.isRequired,
// 	trans_details: PropTypes.array.isRequired,
// 	trans_subs: PropTypes.object.isRequired
// };

const mapStateToProps = ({ billing, auth, account, unreadCount }) => ({
	auth: auth,
	profile: account.profile,
	trans_details: billing && billing.transaction_detail,
	trans_subs: billing && billing.subscripiotnandtrans,
	unreadCount: unreadCount.unreadMessages
});

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{ logout, searchkey }
	)
)(Header);
