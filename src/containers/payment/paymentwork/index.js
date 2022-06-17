import React, { Component } from 'react';

import {apiPath,StripeKey} from '../../../services/config';
import axios from "axios";

import { connect } from "react-redux";
import store from '../../../store/configureStore';
import {  withRouter } from 'react-router-dom';
import {getTransactionDetails,getSubscriptionDetails} from '../../billing/actions';
import CreditCardInput from 'react-credit-card-input';
import MetaTags from 'react-meta-tags';
import ReactPixel from "react-facebook-pixel";
import LinkedInTag from 'react-linkedin-insight';

class PaymentWork extends Component {
    state =  {
        cvc: '',
        message: '',
        expYear: '',
        expMonth: '',
        cardNumber: '',
        cardEmail:'',
        cardName:'',
        token:'',
        formProcess: false
    };

    componentDidMount() {
        if(!this.props.isAuthenticated){
            this.props.history.push("/sign-in")
        }
        this.loadStripe();
    }

    handleChange = (evt) => {
        if([evt.target.name]==="cardNumber"){

        }
        this.setState({
            [evt.target.name] : evt.target.value
        });
    }

    // handleChangecard = (evt) => {
    //     this.setState({
    //         cardNumber : evt.target.value
    //     });
    //
    //     // this.setState({
    //     //     [evt.target.name] : evt.target.value
    //     // });
    // }

    pay = (e) => {
        e.preventDefault();
        if(    this.state.cardNumber === ''){
            this.setState({
                message: "Please enter your credit card number",
                formProcess: false
            });
            return;
        }
        else if(    this.state.expMonth === ''){
            this.setState({
                message: "Please enter month of expiry",
                formProcess: false
            });
            return;
        }
        else if(    this.state.expYear === ''){
            this.setState({
                message: "Please enter year of expiry",
                formProcess: false
            });
            return;
        }
        else if(    this.state.cvc === ''){
            this.setState({
                message: "Please enter your cvc number",
                formProcess: false
            });
            return;
        }
        this.setState({
            message: "",
            formProcess: true
        });
        window.Stripe.card.createToken({
            number: this.state.cardNumber,
            exp_month: this.state.expMonth,
            exp_year: this.state.expYear,
            cvc: this.state.cvc
        }, (status, response) => {
            if (status === 200) {
                const price = this.props.data && this.props.data.price ? this.props.data.price : 'error';
                const gtagParams = {'send_to': 'AW-693012316/Q0l_CJDakbYBENyOusoC', value: price, currency: 'USD', transaction_id: response.id};
                window.gtag('event', 'conversion', gtagParams);
                ReactPixel.track('Purchase', {value : price, currency: 'USD'});
                LinkedInTag.init("1773913");
                LinkedInTag.track("3107508");

                this.setState({

                    token:response.id,

                },()=>{
                    this.charge(e);
                });
            } else {
                this.setState({
                    message: response.error.message,
                    formProcess: false
                });
            }
        });
    }
    charge=(e)=>{
        e.preventDefault();

        // if (this.state.cardEmail === "" || this.state.cardName === "") {
        //     this.setState({message:"All fields must be filled", formProcess: false})
        // }
         if(false){
            this.setState({message:"All fields must be filled", formProcess: false})
        }
        else{
            this.setState({pay:false});
            const formData = new FormData();
            formData.append('email', this.props.userStoreData.email);
            // formData.append('stripeEmail', this.state.cardEmail);
            formData.append('stripeToken', this.state.token);
            formData.append('planId', this.props.planId);
            // formData.append('cardName', this.state.cardName);
            axios.post(apiPath + "/payment/charge", formData)
                .then(res => {
                  if(parseInt(res.data.statusCode) === 200){
                      axios.get(apiPath + "/client/process-current-pricingplan", formData).then((response)=>{
                          this.setState({ formProcess: false});
                          store.dispatch(getTransactionDetails("formal"));
                          store.dispatch(getSubscriptionDetails());
                          this.props.history.push('/purchased');
                      })
                  }
                  else if(parseInt(res.data.statusCode) === 400){

                    this.setState({
                      message :"Your credit card was declined, please verify your information or call your bank.",
                      formProcess: false
                    })

                  }else{

                      this.setState({
                          message :res.data.errorMessage,
                          formProcess: false
                      })
                  }
              })
                .catch(err => {

                    // if (err.response && err.response.status === 401) {
                    //     // this.setState({invalidMessage: true, loading: false});

                    //     window.confirm('all fields must be filled');
                    //     // this.setState({loading:false});
                    //     this.setState({
                    //         ButtonText : "Next"
                    //     })
                    // }
                    // this.setState({
                    //     ButtonText : "Next"
                    // })

                });
        }
    };


    loadStripe = () => {
        if(!window.document.getElementById('stripe-script')) {
            var s = window.document.createElement("script");
            s.id = "stripe-script";
            s.type = "text/javascript";
            s.src = "https://js.stripe.com/v2/";
            s.onload = () => {

                window['Stripe'].setPublishableKey(StripeKey);
            }
            window.document.body.appendChild(s);
        }
    }

    render() {
        return (
            <div className="container  payment-form">
                <MetaTags>
                    <title>GoHireNow</title>
                    <meta name="description" content="" />
                </MetaTags>
                <div className="row">
                    <div className="col-xs-12 col-md-8 mr-auto ml-auto">
                        <div className="panel panel-default">
                            <form onSubmit={this.pay}>
                                <div className="panel-body mt-5">

                                    <div className="row d-flex justify-content-center">
                                        <div className="col-7">
                                            <div className="form-group">

                                                <div className="input-group">
                                                    <CreditCardInput
                                                        cardNumberInputProps={{ value: this.state.cardNumber,
                                                            onChange: e => this.setState({cardNumber:e.target.value})}}
                                                        fieldClassName="input"
                                                    />
                                                    {/*<input type="text" className="form-control"  pattern="\d*" placeholder="Card Number" name="cardNumber"*/}
                                                           {/*// maxLength="16" onChange={this.handleChange} />*/}
                                                    {/*<span className="input-group-addon"><span className="fa fa-credit-card"></span></span>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-7">
                                            <div className="form-group m-0">
                                                <div className="row d-flex justify-content-between">
                                                    <div className=" p-0" style={{
                                                        width:"48%"
                                                    }}
                                                    >
                                                        <div className="form-group">
                                                            <select name="expMonth" className="form-control"  onChange={this.handleChange}>
                                                                <option value="">Month</option>
                                                                <option value="1"> 01 - January</option>
                                                                <option value="2"> 02 - February</option>
                                                                <option value="3"> 03 - March</option>
                                                                <option value="4"> 04 - April</option>
                                                                <option value="5"> 05 - May</option>
                                                                <option value="6"> 06 - June</option>
                                                                <option value="7"> 07 - July</option>
                                                                <option value="8"> 08 - August</option>
                                                                <option value="9"> 09 - September</option>
                                                                <option value="10"> 10 - October</option>
                                                                <option value="11"> 11 - November</option>
                                                                <option value="12"> 12 - December</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className=" pull-right p-0"
                                                         style={{
                                                             width:"48%"
                                                         }}>
                                                        <div className="form-group">
                                                            <select name="expYear" className="form-control" onChange={this.handleChange}>
                                                                <option value="">Year</option>
                                                                <option value="20">2020</option>
                                                                <option value="21">2021</option>
                                                                <option value="22">2022</option>
                                                                <option value="23">2023</option>
                                                                <option value="24">2024</option>
                                                                <option value="25">2025</option>
                                                                <option value="26">2026</option>
                                                                <option value="27">2027</option>
                                                                <option value="28">2028</option>
                                                                <option value="29">2029</option>
                                                                <option value="30">2030</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-7 pull-right">
                                            <div className="form-group">

                                                <input type="text" name="cvc" className="form-control" placeholder="CVC" maxLength="4" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p style={{

                                    fontSize: "14.01px",
                                    fontFamily: "lato",
                                    color: "red",
                                    marginLeft: "5px",
                                    textAlign:"center"
                                }}>{this.state.message !== "Your card was declined." ? this.state.message: "Your credit card has been rejected by your bank. Please verify your card information. If you still have this error message, try again with another card or contact your bank." }</p><br/>
                                <div className="panel-footer">
                                    <div className="row d-flex justify-content-center">

                                        <div className="col-7 ">
                                            { (this.state.formProcess)? (
                                                <button disabled className="btn btn-warning btn-lg btn-block">Please wait...</button>
                                            ) : (
                                                <button className="btn btn-warning btn-lg btn-block">Pay</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <p className="mt-2"></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ pricing,auth }) => {
    return {

        isAuthenticated:auth.isAuthenticated,

    };
};
export default connect(
    mapStateToProps,
    {  }
)(withRouter(PaymentWork));
