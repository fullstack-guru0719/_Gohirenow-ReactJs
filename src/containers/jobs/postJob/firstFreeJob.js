import React, {  Fragment , useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Helmet} from "react-helmet";
import queryString from "query-string";



export const FirstFreeJob = ({location}) => {
    useEffect(()=>{
        window.scrollTo(0, 0);
    });
    const currentUrl = location && location.search && queryString.parse(location.search);
    const jobId = localStorage.getItem("jobId") || currentUrl.jobId;

    return (
        <Fragment>
            <Helmet>
                {/*<title>GoHireNow - Hire Top‑Quality Virtual Assistants</title>*/}
                {/*<meta property="og:title" content="GoHireNow" data-react-helmet="true"/>*/}
                {/*<meta property="og:site_name" content="GoHireNow" data-react-helmet="true"/>*/}
                {/*<meta property="og:image" content="images/Capture.PNG" data-react-helmet="true" />*/}
                {/*<meta property="og:type" content="text" data-react-helmet="true"/>*/}
                {/*<meta property="og:url" content="https://www.gohirenow.com" data-react-helmet="true"/>*/}
                {/*<meta property="og:description" content="Sign in to connect to your dashboard and start browsing jobs and candidates."*/}
                {/*data-react-helmet="true"/>*/}
            </Helmet>
            <div className={`wait-for-first-job-approval`}>
                <div className={`title`}>Your job post is awaiting approval</div>
                <div className={`subtitle`}>It will be approved within 24 hours.</div>
                <div className={`content`}>
                    <div className={'content-title'}>NEW ACCOUNT ONE-TIME BONUS OFFER</div>
                    <div className={'content-subtitle'}>


                      Instant approval of your job<br/><br/>
                      Your job offer sent by email to all our virtual assistants<br/><br/>
                      Your job offer posted to all our job groups<br/><br/>
                      One month support with one of our dedicated account manager<br/><br/>
                      <b>This offer + All features included in the plan you choose</b><br/></div>
                    <div className={`buttons`}>
                        <Link to="/pricing">   <button className="btn get-a-quote">Yes, let me choose a plan</button></Link>
                        <Link to={`/posted-job/${jobId}`}>   <button className="btn get-a-quote">No, I don't need this offer</button></Link>
                    </div>
                </div>
            </div>
            <div>
                <div className="container pt-3">
                    <div>
                        <div className="row flex-column align-items-center many-ovals-first-job quotes " >
                            <h2>They saved a lot!</h2>
                            <div className="save-a-lot">
                                <div className="save-a-lot-item">
                                    <img src={"images/compabny/boda.jpg"} className="orange-oval " />
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
                                    <img src={"images/compabny/larja.jpg"} className="orange-oval " />
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
                                    <img src={"images/compabny/larki.jpg"} className="orange-oval " />
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
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
