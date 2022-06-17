// import React, {Component} from 'react';
// import {injectStripe, ReactStripeElements, CardElement } from 'react-stripe-elements';
// import { Redirect, withRouter } from 'react-router-dom';
// import axios from 'axios';
// import {apiPath} from '../../services/config';
// import Spinner from "../spinner/index";
//
// class PaymentForm extends Component {
//
//     constructor(props){
//         super(props);
//         this.handlesubmit= this.handlesubmit.bind(this);
//     }
//
//     state={
//         form2:false,
//         name:"",
//         email:"",
//         planId:"",
//         token1:"",
//         showErr:"",
//         ButtonText : "Next",
//         pay:true
//     };
//
//     handlesubmit= async(e)=> {
//         e.preventDefault();
//         this.setState({
//             ButtonText : "Please Wait"
//         });
//         let{token}= await this.props.stripe.createToken({name: "Name"});
//         if(token){
//             this.setState({ token1: token.id , planId:this.props.planId,form2:true})
//             this.setState({    ButtonText : "Next"})
//         }
//         else{
//             this.setState({
//                 ButtonText : "Next"
//             })
//         }
//     };
//
//     charge=(e)=>{
//         e.preventDefault();
//         if (this.state.name === ""|| this.state.email === "") {
//             this.setState({showErr:"All fields must be filled"})
//         }
//         else{
//             this.setState({pay:false})
//         const formData = new FormData();
//         formData.append('userEmail', this.props.userStoreData.email);
//         formData.append('stripeEmail', this.state.email);
//         formData.append('stripeToken', this.state.token1);
//         formData.append('planId', this.state.planId);
//         formData.append('cardName', this.state.name);
//         axios.post(apiPath + "/payment/charge", formData)
//             .then(res => {
//
//                 if(parseInt(res.data.statusCode) === 200){
//                     this.setState({pay:true})
//                     this.props.history.push('/purchased');
//                 }else{
//                     this.setState({
//                         ButtonText : "Next"
//                     })
//                 }
//             })
//             .catch(err => {
//
//                 // if (err.response && err.response.status === 401) {
//                 //     // this.setState({invalidMessage: true, loading: false});
//
//                 //     window.confirm('all fields must be filled');
//                 //     // this.setState({loading:false});
//                 //     this.setState({
//                 //         ButtonText : "Next"
//                 //     })
//                 // }
//                 // this.setState({
//                 //     ButtonText : "Next"
//                 // })
//
//             });
//         }
//     };
//     render() {
//         let{showErr,email,token1,planId,name ,ButtonText}= this.state;
//         return (
//             <form className="register-work-form" onSubmit={(e)=> this.handlesubmit(e)}>
//                 {
//                     this.state.form2 !== true ? <div className="card_element">
//                         <CardElement/>
//                         <div className="sign-up-btn mt-3">
//                             <button className="btn text-uppercase" >{ButtonText}</button>
//                         </div>
//                     </div> :
//                         <div>
//                             <div className="inner-pass-form">
//                                 <input type="text" value={email} placeholder="Enter Stripe Email" onChange={(e)=> this.setState({email:e.target.value}) }/>
//                                 <input type="text" value={token1} className="hidden" disabled/>
//                                 <input type="text" value={planId} className="hidden"  disabled />
//
//                                 <input type="text" placeholder="Card Name" value={name} onChange={event => this.setState({name: event.target.value})}/>
//                                 <p className="text-center" style={{color:"Red"}}>{showErr}</p>
//                             </div>
//                             <div className="sign-up-btn">
//                                 <button className="btn text-uppercase" onClick={(e)=> this.charge(e)}>{
//
//                                     this.state.pay ? "Pay": <Spinner/>
//                                 }</button>
//                             </div>
//                         </div>
//                 }
//                 <div className="already-member">
//                     <p>This will renew automatically every month.</p>
//                     <p>You can cancel at any time.</p>
//                 </div>
//             </form>
//         )
//     }
// }
//
// export default injectStripe(withRouter(PaymentForm));