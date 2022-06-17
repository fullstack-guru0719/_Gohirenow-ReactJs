import React, { Fragment, useEffect } from "react";
import PropTypes from 'prop-types';
import Listing from '../listing';
import axios from 'axios';
import { apiPath } from '../../services/config'
import { Link, Redirect } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Spinner from '../../components/spinner/index';

const DashBoard = ({

}) => {
  useEffect(() => {

  }, []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
      <Fragment>
      </Fragment>
    )
  // state = {
  //     activejobspost: null,
  //     favworkers: null,
  //     progress: 0,
  //     username: null,
  //     plan: null,
  //     itemactivejob: 1,
  // }
  // componentDidMount(){
  //     if (this.props.loggedIn) {
  //         let headersend = {
  //             headers: {
  //                 'Authorization': 'Bearer ' + this.props.userStoreData.token,
  //             }
  //         };

  //         axios.get(apiPath + "Job/clientdashboardjobs/" + this.props.userStoreData.userId, headersend).then(res => {
  //             this.setState({ activejobspost: res.data });
  //             ("data coming job post", res)
  //         }).catch((err) => {
  //             this.setState({ activejobspost: [] });
  //         });
  //         axios.get(apiPath + "Favorites/" + this.props.userStoreData.userId, headersend).then(res => {
  //             this.setState({ favworkers: res.data })
  //             
  //         });
  //         axios.get(apiPath + "Account/progress?=" + this.props.userStoreData.userId, headersend).then(res => {
  //             this.setState({ progress: res.data })
  //             
  //         });
  //         axios.get(apiPath + "Account/profile?=" + this.props.userStoreData.userId, headersend).then(res => {
  //             this.setState({ username: res.data.company });
  //             
  //         });
  //         axios.get(apiPath + "Billing/transactions?customerEmail=" + this.props.userStoreData.email, headersend).then(res => {
  //            
  //             if (res.data.length > 0) {
  //               
  //                 this.setState({ plan: res.data })

  //             }
  //             else {
  //                 let plan = [{ Plan: "Starter", Price: 49.99, Status: "Paid", Date: "8/28/2019" }];
  //                 this.setState({ plan: plan })
  //             }
  //         });
  //         
  //     }
  // }
  // gotohriewith(value, red) {
  //     localStorage.setItem('jobId', value);
  //     if (red === "editjob") {
  //         this.props.history.push('/post-job');
  //     }
  //     else if (red === "viewjob") {
  //         this.props.history.push('/job-details-hire');
  //     }
  // }

  // renderRedirect = () => {
  //    
  //     if (!this.props.loggedIn) {
  //       
  //         return <Redirect to='/sign-in' />;

  //     }
  // }
  // gotopost(){
  //     localStorage.removeItem('jobId');
  //     this.props.history.push('/register-hire')
  // }
  // render()
  // {

  let { dispatch, loggedIn, userStoreData } = this.props;
  let { progress } = this.state;
  let style = {
    width: progress + '%'
  };
  return (
    <div className="registration" id="billing">
      {this.renderRedirect()}
      <div className="container pt-3">
        <div className="row heading-row">
          <div className="col-sm-12">
            <h2>Dashboard</h2>
          </div>
        </div>
        <div className="row main-row" id="client-dash">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <div className="select-div">
                  <p className="font-weight-bold">Active Job Posts</p>
                  <select>
                    <option>Active</option>
                    <option>InActive</option>
                  </select>
                </div>
                <div className="second-table">
                  <table>
                    <thead>
                      <tr>
                        <th>JOB TITLE</th>
                        <th>APPLICANTS</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>

                      {
                        this.state.activejobspost !== null && this.state.activejobspost.length > 0 &&
                        this.state.activejobspost.reverse().map((item, index) => {
                          if (index < 6) {
                            return (
                              <tr key={index}>
                                <td onClick={() => { this.gotohriewith(item.jobId, "viewjob") }} className="pointer">{item.jobTitle}</td>
                                <td>{item.applicants}</td>
                                <td>{item.status} </td>
                                <td><Moment fromNow ago>
                                  {item.date}
                                </Moment> ago</td>
                                <td>
                                  <div className="Edit-mode">


                                    <i onClick={() => { this.gotohriewith(item.jobId, "editjob") }} className="fa fa-pencil" />
                                    <i onClick={() => { this.gotohriewith(item.jobId, "viewjob") }} className="fa fa-eye" />
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                      {
                        (this.state.activejobspost === null || this.state.activejobspost.length === 0) &&
                        <tr className="d-flex  align-items-center">
                          <td>No jobs posted</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
            <div className="row padd" id="favoritesworker">
              <div className="col-md-12">
                <p className="font-weight-bold">Favorite Workers</p>
                <div className="second-table" id="second-table">
                  <table>
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>SKILLS</th>
                        <th>INFO</th>
                        <th></th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>

                      {
                        this.state.favworkers !== null && this.state.favworkers.length > 0 &&
                        this.state.favworkers.reverse().map((item, index) => {
                          if (index < 6) {
                            return (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{
                                  item.skills.map((item) => {
                                    return item + ","
                                  })
                                }</td>
                                <td>{item.info}</td>
                                <td />
                                <td>
                                  <div className="Edit-mode">
                                    <i className="fa fa-pencil" />
                                    <i className="fa fa-eye" />
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                      {
                        this.state.favworkers !== null && this.state.favworkers.length === 0 &&
                        <tr className="d-flex align-items-center">
                          <td>No Favorite workers found</td>
                        </tr>
                      }

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/*<div className="row padd">*/}
            {/*<div className="col-md-12">*/}
            {/*<p className="font-weight-bold">Newest</p>*/}
            {/*<div className="second-table">*/}
            {/*<table>*/}
            {/*<thead>*/}
            {/*<tr>*/}
            {/*<th>JOB TITLE</th>*/}
            {/*<th>TYPE</th>*/}
            {/*<th>SALARY</th>*/}
            {/*<th>DATE</th>*/}
            {/*<th/>*/}
            {/*</tr>*/}
            {/*</thead>*/}
            {/*<tbody>*/}
            {/*<tr>*/}
            {/*<td >Full time dev 40hr/week asp.net c#</td>*/}
            {/*<td>Full Time</td>*/}
            {/*<td>$400/week</td>*/}
            {/*<td>2 days ago</td>*/}
            {/*<td>*/}
            {/*<div className="Edit-mode">*/}
            {/*<i className="fa fa-pencil"/>*/}
            {/*<i className="fa fa-eye"/>*/}
            {/*</div>*/}
            {/*</td>*/}
            {/*</tr>*/}
            {/*</tbody>*/}
            {/*</table>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*</div>*/}
          </div>
          <div className="col-md-4 work-dash">
            <div className="row">
              <div className="col-sm-12 d-flex justify-content-end">
                <Link to="/post-job"> <button className="btn text-uppercase"
                  onClick={() => this.gotopost()}>post a job</button></Link>
              </div>
            </div>
            <div className="sub-box-1">
              <div className="first-div">
                <p>Hi! <span className="text-capitalize">{
                  this.state.username !== null &&
                  this.state.username

                }</span></p>
                <div>
                  {
                    this.state.plan !== null && this.state.plan.length > 0 &&
                    <p className="text-uppercase text-center">{this.state.plan[0].Plan}</p>
                  }

                  <p>
                    {this.state.plan !== null && this.state.plan.length > 0 &&
                      (this.state.plan[0].Plan === "Starter" || this.state.plan[0].Plan !== "Business") &&
                      <span>
                        <Link to="/pricing"> (upgrade)</Link>

                      </span>}
                  </p>
                </div>
              </div>
              <div className="second-div">
                <div className="first-inner-div">
                  <Link to='/complete-profile'> <p>Complete Profile</p></Link>
                  <p>{this.state.progress}%</p>
                </div>
                <div className="second-inner-div">
                  <div className="bar" style={style} />
                </div>
              </div>
            </div>
            <p className="related font-weight-bold">Related Workers</p>
            <div className="right">
              <div className="right-top">
                <div className="img-div">
                  <img src={require("../../assets/img_avatar.svg")} alt="" />
                </div>
                <div className="content">
                  <h4>Fulltime Developer</h4>
                  <p>$200 : 40hr/week</p>
                  <p>C#, mssql, html</p>
                </div>
              </div>
              <div className="right-bottom">
                <p>Media23.inc<span>2 days ago</span></p>
              </div>
            </div>
            <div className="right">
              <div className="right-top">
                <div className="img-div">
                  <img src={require("../../assets/img_avatar.svg")} alt="" />
                </div>
                <div className="content">
                  <h4>Fulltime Developer</h4>
                  <p>$200 : 40hr/week</p>
                  <p>C#, mssql, html</p>
                </div>
              </div>
              <div className="right-bottom">
                <p>Media23.inc<span>2 days ago</span></p>
              </div>
            </div>
            <div className="right">
              <div className="right-top">
                <div className="img-div">
                  <img src={require("../../assets/img_avatar.svg")} alt="" />
                </div>
                <div className="content">
                  <h4>Fulltime Developer</h4>
                  <p>$200 : 40hr/week</p>
                  <p>C#, mssql, html</p>
                </div>
              </div>
              <div className="right-bottom">
                <p>Media23.inc<span>2 days ago</span></p>
              </div>
            </div>
            {/*<div className="sub-box-2">*/}
            {/*<p className="font-weight-bold text-uppercase" >your skill</p>*/}
            {/*<p>C#</p>*/}
            {/*<p>Html</p>*/}
            {/*<p>Java</p>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </div>

  );
}
DashBoard.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  // deleteAccount: PropTypes.func.isRequired,
  // auth: PropTypes.object.isRequired,
  // profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  // auth: state.auth,
  // profile: state.profile
});

export default connect(
  mapStateToProps,
  {}
)(DashBoard);




