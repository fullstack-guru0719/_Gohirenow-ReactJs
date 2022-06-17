import React, { Component, Fragment , useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TrustedCompany from "../../components/trustedcompany/index";
import { setUserType } from '../auth/actions';
import MetaTags from 'react-meta-tags';
import { Helmet } from "react-helmet";
import MediaQuery from "react-responsive";


const MainLayout = ({ isAuthenticated, user,setUserType, history }) => {
    useEffect(()=>{
        window.scrollTo(0, 0);
    })
    const gotowork=()=>{
        setUserType(2);
        history.push('/register')
    }
    const gotohire=()=>{
        setUserType(1);
        history.push('/register')
    }
    if (isAuthenticated) {
        if (user && user.userTypeId === 1) return <Redirect to='/dashboard' />;
        if (user && user.userTypeId === 2) return <Redirect to='/dashboard-work' />;
    }
    return (
        <Fragment>
            <div className="hire-want-section new-home1" >
                    {/*<Helmet>*/}
                        {/*<title>GoHireNow - Hire Top‑Quality Remote Employees</title>*/}
                        {/*<meta property="og:title" content="GoHireNow 1" />*/}
                        {/*<meta property="og:site_name" content="GoHireNow" />*/}
                        {/*<meta property="og:image" content="images/Capture.PNG" />*/}
                        {/*<meta property="og:type" content="text"/>*/}
                        {/*<meta property="og:url" content="https://www.gohirenow.com"/>*/}
                        {/*<meta name="title" content="GoHireNow" />*/}
                        {/*<meta name="description" content="Hire top‑quality remote employees, freelancers and virtual assistants for your next project or startup. Learn how you can save more than 82% on salaries. Outsourcing as it's best!"/>*/}
                        {/*<meta property="og:description" content="Hire top‑quality remote employees, freelancers and virtual assistants for your next project or startup. Learn how you can save more than 82% on salaries. Outsourcing as it's best!"*/}
                        {/*/>*/}
                    {/*</Helmet>*/}
                <div className="container">
                    <div className="row">
                        <div className="col-6 second-two" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                            <div className="largetext">
                                <h2 style={{ marginTop: "44px"}}>
                                    Hire experts directly for any online jobs !
                                </h2>
                            </div>
                            <div className="smalltext">
                                <p style={{ marginTop: "70px",
                                    marginBottom: "70px",
                                    fontSize: "20px"}}>
                                    We take 0% commissions
                                </p>
                            </div>
                            <div className="hire-work-buttons ">
                                <button className="btn text-uppercase " onClick={()=> gotohire()}>i want to hire</button>
                            </div>
                        </div>
                        <div className="col-6 pr-0">
                            <div className="voted-div-outer">
                                <div className="voted-div">
                                    <div>
                                        <div className="top">
                                            <p>VOTED</p>
                                            <h4>#1</h4>
                                        </div>
                                        <p>The leader in <br /> Virtual<br />Assistants</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="as-seen-as" style={{ marginTop: "-126px" }}>
                <div className="container-fluid d-flex justify-content-center">
                    <div className="row black-back " style={{
                        width:"88%"
                    }}>
                        <h2 className="text-uppercase">as seen on</h2>
                        <div className="black-circle-adj">
                            <div>
                                <img src={require("../../assets/seen1.png")} alt="" />
                            </div>
                            <div>
                                <img className='bottom-fixed' src={require("../../assets/seen2.png")} alt="" />
                            </div>
                            <div>
                                <img src={require("../../assets/seen3.png")} alt="" />
                            </div>
                            <div>
                                <img src={require("../../assets/seen4.png")} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="why-hire-a-virtual-assistant">
                <div className="why-virtual container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="text-center " style={{
                                marginTop: "8%",
                                marginBottom: "4%",
                                fontWeight: "700"
                            }}>Why hire a virtual assistant</h1>
                        </div>
                    </div>
                    <div className="row extra-margin-imp mobile-m-0" >
                        <div className="col-6 d-flex pt-5 pb-5 justify-content-center align-items-center" style={{
                            paddingLeft: "5%",
                            PaddingRight:"5%"
                        }}>
                            <div className="svg-image">
                                <img src={require("./pig.png")}  />
                            </div>
                            <div className="  ">
                                <p className="  pl-4 mb-0 ">
                                    it's so easy to find experts, post a job, get applicants within minutes and hire.
                                    it's so easy to find experts, post a job,
                                </p>
                            </div>
                        </div>
                        <div className="col-6 d-flex pt-5 pb-5 justify-content-center align-items-center" style={{
                            paddingLeft: "5%",
                            PaddingRight:"5%"
                        }}>
                            <div className="svg-image">
                                <img src={require("./lady-headphone.png")} />
                            </div>
                            <div className="">
                                <p className="  pl-4 mb-0 ">
                                    it's so easy to find experts, post a job, get applicants within minutes and hire.
                                    it's so easy to find experts, post a job,
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row extra-margin-imp" >
                        <div className="col-6 d-flex  pb-5 justify-content-center align-items-center" style={{
                            paddingLeft: "5%",
                            PaddingRight: "5%"
                        }}>
                            <div className="svg-image">
                                <img src={require("./dollarup.png")} alt="" />
                            </div>
                            <div className="">
                                <p className=" pl-4 mb-0">
                                    it's so easy to find experts, post a job, get applicants within minutes and hire.
                                    it's so easy to find experts, post a job,
                                </p>
                            </div>
                        </div>
                        <div className="col-6 d-flex  pb-5 justify-content-center align-items-center" style={{
                            paddingLeft: "5%",
                            PaddingRight: "5%"
                        }}>
                            <div className="svg-image">
                                <img src={require("./i-shape.png")} alt=""/>
                            </div>
                            <div className="">
                                <p className=" pl-4 mb-0">
                                    it's so easy to find experts, post a job, get applicants within minutes and hire.
                                    it's so easy to find experts, post a job,
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h3 className="text-center mt-5 mb-5 skilled-new-home">
                                They are skilled with the best softwares and apps
                            </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="images-new-home">
                            <img src={require("./Layer-7.png")}  style={{width:"60%"}}    className="" alt=""/>
                            <img src={require("./pdf.png")} style={{width:"6%"}} className="ml-4 mr-4" alt=""/>
                            <img src={require("./L1-copy.png")} style={{width:"6%"}} className="ml-4 mr-4" alt=""/>
                            <img src={require("./L0001.png")}  style={{width:"6%"}}  className="ml-4 mr-4" alt=""/>
                            <img src={require("./Layer-8.png")} style={{width:"6%"}} className="ml-4 " alt=""/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <p className="text-center mt-5 mb-5 size-font-psd">
                                You can browse for FREE through our best virtual assistant waiting for you!
                            </p>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <Link to="/register">
                            <button className="new-template-button">POST A JOB</button>
                            </Link>
                        </div>
                    </div>
                    <div className="row fun-fact-row">
                        <div className="col-12 blue-banner fun-fact " >
                            <MediaQuery maxDeviceWidth="767px">
                                <p className="text-center " style={{ fontWeight: "700"}}> FUN FACT</p>
                            </MediaQuery>
                            <MediaQuery minDeviceWidth="768px">
                                <h1 className="text-center " style={{ fontWeight: "700"}}> FUN FACT</h1>
                            </MediaQuery>
                            <p className="text-center pt-4">
                                You can browse for FREE through our best virtual assistant waiting for you!
                            </p>
                            <p className="text-center pt-4 pb-4 mb-0">
                                You can browse for FREE through our best virtual assistant waiting for you!
                                You can browse for FREE through our You can browse for FREE through our
                                best virtual assistant waiting for you!

                            </p>
                            <p className="text-center pt-4 pb-3">
                                You can browse for FREE through our best virtual assistant waiting for you!
                            </p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <h1 className="text-center mb-5 pt-5 mt-5 average-title-new-home" style={{ fontWeight: "700"}}>
                            Average monthly salary by country
                        </h1>
                        <p className="text-center mt-2 mb-5 w-75 big-new-home-chck ">
                            These are monthly salaries based on a 40 hours a week. Hire a full-time remote employee and grow your project.
                        </p>
                    </div>
                    <div className="row flags-new-home">
                        <div className="col-2 d-flex flex-column align-items-center ">
                            <img src={require("./Layer-6.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }} />
                            <p className="mb-0 mt-4">India</p>
                            <span>
                                <b>
                                    $300
                                </b>
                            </span>
                        </div>
                        <div className="col-2 d-flex flex-column align-items-center ">
                            <img src={require("./Layer-5.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }}/>
                            <p className="mb-0 mt-4">Philipines</p> <span><b>$225</b></span> </div>
                        <div className="col-2 d-flex flex-column align-items-center ">
                            <img src={require("./Layer-4.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }}/>
                            <p className="mb-0 mt-4">Pakistan</p> <span><b>$450</b></span> </div>
                        <div className="col-2  d-flex flex-column align-items-center ">
                            <img src={require("./Layer-3.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }}/>
                            <p className="mb-0 mt-4">China</p> <span><b>$950</b></span> </div>
                        <div className="col-2 d-flex flex-column align-items-center ">
                            <img src={require("./Layer-2.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }}/>
                            <p className="mb-0 mt-4">Bangladesh</p> <span><b>$160</b></span> </div>
                        <div className="col-2 d-flex flex-column align-items-center ">
                            <img src={require("./Layer-1.png") } alt="" style={{
                                border: "9px solid #E2E2E2",
                                borderRadius: "38px"
                            }}/>
                            <p className="mb-0 mt-4">Thailand</p> <span><b>$675</b></span> </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 ">
                            <h3 className="text-center m-5 p-5 recommend-new-home"> We recomnd to offer your employees a better salary. You are helping them and creating a better country economy. </h3>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <h1 className="text-center mb-5 candidates-new-home" style={{ fontWeight: "700"}}>Candidates waiting to work for you</h1>
                    </div>
                    <div className="row users-new-home">
                        <div className="col-4 mb-4">
                           <div className=" mota-border d-flex flex-column justify-content-center p-4">
                               <div className="img-intro d-flex justify-content-center">
                                   <div className="img">
                                       <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                   </div>
                                   <div className="intro ml-3">
                                       <h5 className="mb-0">BEN T. </h5>
                                       <p className="mb-0">Server Expert</p>
                                       <h5 className="mb-0">$303/month</h5>
                                   </div>
                               </div>
                               <div className="skills text-center mt-4 mb-4">
                                   Amazon Web Services, Microsoft SQL Server, Server
                               </div>
                               <div className="dots">
                                   <div></div>
                                   <div></div>
                                   <div></div>
                               </div>
                               <div className="reg-details mt-4">
                                   <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                   <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                               </div>
                           </div>
                        </div>
                        <div className="col-4 mb-4">
                            <div className=" mota-border d-flex flex-column justify-content-center p-4">
                                <div className="img-intro d-flex justify-content-center">
                                    <div className="img">
                                        <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                    </div>
                                    <div className="intro ml-3">
                                        <h5 className="mb-0">BEN T. </h5>
                                        <p className="mb-0">Server Expert</p>
                                        <h5 className="mb-0">$303/month</h5>
                                    </div>
                                </div>
                                <div className="skills text-center mt-4 mb-4">
                                    Amazon Web Services, Microsoft SQL Server, Server
                                </div>
                                <div className="dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="reg-details mt-4">
                                    <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                    <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 mb-4">
                            <div className=" mota-border d-flex flex-column justify-content-center p-4">
                                <div className="img-intro d-flex justify-content-center">
                                    <div className="img">
                                        <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                    </div>
                                    <div className="intro ml-3">
                                        <h5 className="mb-0">BEN T. </h5>
                                        <p className="mb-0">Server Expert</p>
                                        <h5 className="mb-0">$303/month</h5>
                                    </div>
                                </div>
                                <div className="skills text-center mt-4 mb-4">
                                    Amazon Web Services, Microsoft SQL Server, Server
                                </div>
                                <div className="dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="reg-details mt-4">
                                    <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                    <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 mb-4">
                            <div className=" mota-border d-flex flex-column justify-content-center p-4">
                                <div className="img-intro d-flex justify-content-center">
                                    <div className="img">
                                        <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                    </div>
                                    <div className="intro ml-3">
                                        <h5 className="mb-0">BEN T. </h5>
                                        <p className="mb-0">Server Expert</p>
                                        <h5 className="mb-0">$303/month</h5>
                                    </div>
                                </div>
                                <div className="skills text-center mt-4 mb-4">
                                    Amazon Web Services, Microsoft SQL Server, Server
                                </div>
                                <div className="dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="reg-details mt-4">
                                    <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                    <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 mb-4">
                            <div className=" mota-border d-flex flex-column justify-content-center p-4">
                                <div className="img-intro d-flex justify-content-center">
                                    <div className="img">
                                        <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                    </div>
                                    <div className="intro ml-3">
                                        <h5 className="mb-0">BEN T. </h5>
                                        <p className="mb-0">Server Expert</p>
                                        <h5 className="mb-0">$303/month</h5>
                                    </div>
                                </div>
                                <div className="skills text-center mt-4 mb-4">
                                    Amazon Web Services, Microsoft SQL Server, Server
                                </div>
                                <div className="dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="reg-details mt-4">
                                    <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                    <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 mb-4">
                            <div className=" mota-border d-flex flex-column justify-content-center p-4">
                                <div className="img-intro d-flex justify-content-center">
                                    <div className="img">
                                        <img src={require("./black.jpg")} width={"100%"} alt=""/>
                                    </div>
                                    <div className="intro ml-3">
                                        <h5 className="mb-0">BEN T. </h5>
                                        <p className="mb-0">Server Expert</p>
                                        <h5 className="mb-0">$303/month</h5>
                                    </div>
                                </div>
                                <div className="skills text-center mt-4 mb-4">
                                    Amazon Web Services, Microsoft SQL Server, Server
                                </div>
                                <div className="dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div className="reg-details mt-4">
                                    <p className="text-center mb-0">Last logged: <b>20 hours ago</b></p>
                                    <p className="text-center">Member Since: <b>Dec 3 2019</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5 mt-5 pb-5 post-job-btn-new-home">
                        <div className="col-12 text-center">
                            <Link to="/register">
                            <button className="new-template-button">POST A JOB</button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <div className="why-gohirenow why-gohirenow-new-home">
                <div className="container pt-3">
                    <div className="inner-div p-0">
                        <div className="row">
                            <div className="gohire-why">
                                <h2>Why GoHireNow</h2>
                                <p>We are the leading experts in direct outsourcing</p>
                            </div>
                        </div>
                        <div className="row round-icons-new-home" style={{padding: "0% 7% 0 7%"}}>
                            <div className="col-6">
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/searchglass1.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">Find Experts in Minutes</span><br/>
                                            It's so easy to find experts, post a job,
                                            get applicants within minutes and hire.
                                        </p>
                                    </div>
                                </div>
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/people3.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">Create a Dream Team</span><br />
                                            Our experts have degrees in their expertise.
                                            It's the best place to create your dream team.
                                        </p>
                                    </div>
                                </div>
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/graph5.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">Grow Your Company</span><br />
                                            Our talent pool will give you the leverage to grow your company. We have
                                            over 1,500 skill sets.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/upping2.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">Reduce Payroll</span><br />
                                            Outsourcing is the future, cut on office space,
                                            benefits, equipment, insurance by hiring online.
                                        </p>
                                    </div>
                                </div>
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/dollarhand4.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">Hire & Pay Direct</span><br />
                                            We put you directly in contact with your worker.
                                            You manage and pay your team directly.
                                        </p>
                                    </div>
                                </div>
                                <div className="black-ovals">
                                    <img src="/images/whygohirenow/handshake1.png" className="black-ovalwhy" style={{ borderRadius:"50%",objectFit:"cover"}} />
                                    <div className="oval-paragraph">
                                        <p className="dummy-text">
                                            <span className="font-weight-bold">
                                                Save & Change Their Lives
                                            </span>
                                            <br />
                                            Not only you reduce your expenses. You also create opportunities for
                                            families in emerging countries.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center mt-5  mb-5 " style={{padding:"% 7% 0 7%"}}>
                            <Link to="/register">
                                <button className="btn text-uppercase post-a-job">post a job </button>
                            </Link>
                        </div>
                        <TrustedCompany />
                        <div className="row flex-column align-items-center many-ovals quotes " style={{padding:"7% 7% 0 7%"}}>
                            <h2>They saved a lot!</h2>
                            <div className="save-a-lot">
                                <div className="save-a-lot-item">
                                    <img src={"images/compabny/boda.jpg"}  className="orange-oval " />
                                    <div className="header">
                                        <h1>MesureX</h1>
                                    </div>
                                    <div className="para">
                                        <p>We found a great app developer at a lower salary.
                                            It really gave us the leverage we needed to grow our company.
                                            There is no way we could have find a developer at this rate in United States.
                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Joseph P. Owner</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img  src={"images/compabny/larja.jpg"} className="orange-oval " />
                                    <div className="header">
                                        <h1>PetsDirectn</h1>
                                    </div>
                                    <div className="para">
                                        <p>We were struggling to have 24h/7 live chat support.
                                            Within 48 hours we hired truly amazing virtual assistants, they are now doing
                                            our live chat 24/7. Not only our Live Chat is always online, we have also increased
                                            our sales.  </p>
                                    </div>
                                    <div className="author">
                                        <h1>- William W. CEO</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img src={"images/compabny/ahmad.jpg"} className="orange-oval " />
                                    <div className="header">
                                        <h1>The Virtual Force</h1>
                                    </div>
                                    <div className="para">
                                        <p>
                                            Being a digital agency is really hard to make profit.
                                            Our salaries expenses were too high. We have turned expenses into profit by hiring
                                            remote employees. It really helped us to go from a break even point to profitable!
                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- M.Ahmad Owner</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img  src={"images/compabny/larki.jpg"} className="orange-oval " />
                                    <div className="header">
                                        <h1>Lab Sellers</h1>
                                    </div>
                                    <div className="para">
                                        <p>I am a passive income lover. I have automated all my Shopify stores
                                            using virtual assistants. I went from 28 hours per week of work to
                                            less than 1 hour per day. They manage everything, orders, inventory,
                                            management and support.
                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Shaina S. Owner</h1>
                                    </div>
                                </div>
                            </div>
                            <h2>We changed their lives!</h2>
                            <div className="save-a-lot">
                                <div className="save-a-lot-item">
                                    <img src={"images/01.png"} className="orange-oval blue-ovals" />

                                    <div className="header">
                                        <h1>Sales Manager</h1>
                                    </div>
                                    <div className="para">
                                        <p>
                                            As a sales manager in real estate, I have the best jobs in the world! I work anytime that I can right at the comfort of my home while being a full-time mom.
                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Mafe F</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img src={"images/02.png"} className="orange-oval blue-ovals" />
                                    <div className="header">
                                        <h1>Real Estate</h1>
                                    </div>
                                    <div className="para">
                                        <p>
                                            Working from home helps me to work smart. Value in time management less travel expenses. More time for me and my Family
                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Julie Christie F</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img src={"images/03.jpg"} className="orange-oval blue-ovals" />
                                    <div className="header">
                                        <h1>Social Media</h1>
                                    </div>
                                    <div className="para">
                                        <p>

                                            Freelancing has helped me a ton especially when it comes to managing my time. I can take care and give more time to my
                                            family and maintain good health

                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Aldrin L</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <img src={"images/04.jpg"} className="orange-oval blue-ovals" />
                                    <div className="header">
                                        <h1>Affiliate Marketing</h1>
                                    </div>
                                    <div className="para">
                                        <p>

                                            Working from home enables me to gain full control of my time. I can be beyond 100% productive as I pursue my passion.
                                            The most important thing is that I get to spend more time with my loved ones.

                                        </p>
                                    </div>
                                    <div className="author">
                                        <h1>- Yna Isabelle F</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="post-a-job-btn">
                                <Link to="/register">
                                    <button className="btn text-uppercase post-a-job">
                                        post a job
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )

}




const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps,{setUserType})(MainLayout);
