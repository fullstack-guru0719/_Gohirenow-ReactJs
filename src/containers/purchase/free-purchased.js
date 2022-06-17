import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'

import store from '../../store/configureStore';


import MetaTags from 'react-meta-tags';

import {getTransactionDetails,getSubscriptionDetails} from '../billing/actions'

class PurchaseFreeWelcome extends Component {
    componentDidMount(){
        window.scrollTo(0, 0);
        store.dispatch(getTransactionDetails("formal"));
        store.dispatch(getSubscriptionDetails());
    }
    render() {
        let{  isAuthenticated}= this.props;


        return (
            <div className={isAuthenticated ? "registration greybf" : "registration "} id="purchased">
                {/*<MetaTags>*/}
                    {/*<title>GoHireNow</title>*/}
                    {/*<meta name="description" content="" />*/}
                {/*</MetaTags>*/}
                <div className="container  pb-5" style={{
                    paddingTop: "5%"
                }}>
                    <div className="inner-div">
                        <div className="row flex-column top-text ">
                            <h2 className="text-center">You have been downgraded to a free plan</h2>
                            <p className="text-center">You will still have access to your current plan
                            until your renewable date.</p>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-sm-6">
                                <div className="card">
                                    <h1>What do you want to do next?</h1>
                                    <div className="purchased-btn">
                                        <Link to="/search-work">  <button className="btn browes">BROWSE</button></Link>
                                        <Link to="/post-job"><button className="btn job-post">POST A JOB</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ auth }) => {
    return {

        isAuthenticated: auth.isAuthenticated,
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
)(PurchaseFreeWelcome);