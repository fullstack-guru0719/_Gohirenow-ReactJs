import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { useEffect } from "react";
const WaitApproval = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const params = queryString.parse(props.location.search);
  if (!params) return <div></div>;
  const { jobId } = params;
  return (
    <div className="wait-approval p-3">
      <div className="container d-flex flex-column align-items-center text-center pt-5">
        <h2 className="font-weight-bold">Your job post is awaiting approval</h2>
        <p className="job-status">It will be approved within 24 hours.</p>
        <div className="offer-benefits">
          <h4 className="text-uppercase">New Account one-time bonus offer</h4>
          <ul className="list-unstyled text-left p-1 pt-3">
            <li>
              <i class="fa fa-check"></i>Instant approval of your job
            </li>
            <li>
              <i class="fa fa-check"></i>Your job offer sent by email to all our
              virtual assistants
            </li>
            <li>
              <i class="fa fa-check"></i>Your job offer posted to all our job
              groups
            </li>
            <li>
              <i class="fa fa-check"></i>One month support with one of our
              dedicated account manager
            </li>
          </ul>
        </div>
        <p className="plan-detail">
          This offer + included in the plan you choose
        </p>
        <Link className="accept-button" to="/pricing">
          Yes, let me choose a plan
        </Link>
        <Link className="decline-button" to={`/posted-job/${jobId}`}>
          No, I don't need this offer
        </Link>
      </div>
    </div>
  );
};

export default WaitApproval;
