import React, { Fragment, useEffect } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import MetaTags from 'react-meta-tags';

const FollowWork = ({ user }) => {
    useEffect(()=>{
        window.scroll(0,0);


    });

    return (
        <Fragment>
            {/*<MetaTags>*/}
                {/*<title>GoHireNow</title>*/}
                {/*<meta name="description" content="" />*/}
            {/*</MetaTags>*/}
            <div id="follow-work">
                <div className="container pt-3">
                    <div className="row">
                        <div className="content">
                            <h2>Get job posting in your facebook</h2>
                            <p>Join our group today!</p>
                            <h4>Online Job Offers For Filipinos</h4>
                            <button className="btn text-uppercase">
                                <img src={require("../../assets/faceboook.png")} />join
                            </button>
                            <p className="second">66,867 followers</p>
                            <div className="skip-div">
                                {(user && user.userTypeId === 1) ?
                                    <Link to='/dashboard'>
                                        <p className="font-weight-bold pointer" >
                                            SKIP <i className="fa fa-caret-right" />
                                        </p>
                                    </Link> :
                                    <Link to='/edit-profile'>
                                        <p className="font-weight-bold pointer" >
                                            SKIP <i className="fa fa-caret-right" />
                                        </p>
                                    </Link>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container pt-3">
                    <div className="inner-div">
                        <div className="row flex-column align-items-center quotes" >
                            <h2>We change their lives</h2>
                            <div className="save-a-lot">
                                <div className="save-a-lot-item">
                                    <div className="orange-oval " />
                                    <div className="header">
                                        <h1>Milwakie inc.</h1>
                                    </div>
                                    <div className="para">
                                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem voluptatem voluptatem voluptatem voluptatem </p>
                                    </div>
                                    <div className="author">
                                        <h1>- CEO Jim Pooil</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <div className="orange-oval " />
                                    <div className="header">
                                        <h1>Milwakie inc.</h1>
                                    </div>
                                    <div className="para">
                                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem voluptatem voluptatem voluptatem voluptatem </p>
                                    </div>
                                    <div className="author">
                                        <h1>- CEO Jim Pooil</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <div className="orange-oval " />
                                    <div className="header">
                                        <h1>Milwakie inc.</h1>
                                    </div>
                                    <div className="para">
                                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem voluptatem voluptatem voluptatem voluptatem </p>
                                    </div>
                                    <div className="author">
                                        <h1>- CEO Jim Pooil</h1>
                                    </div>
                                </div>
                                <div className="save-a-lot-item">
                                    <div className="orange-oval " />
                                    <div className="header">
                                        <h1>Milwakie inc.</h1>
                                    </div>
                                    <div className="para">
                                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem voluptatem voluptatem voluptatem voluptatem </p>
                                    </div>
                                    <div className="author">
                                        <h1>- CEO Jim Pooil</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}


const mapStateToProps = ({ auth }) => {
    return {
        user: auth.user
    };
};

export default connect(
    mapStateToProps,
)(FollowWork);
