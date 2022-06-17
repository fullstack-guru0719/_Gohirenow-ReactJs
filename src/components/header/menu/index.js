import React, { Component, Fragment } from "react";
import cookie from "react-cookies";

import ACTIONS from "../../../store/actionTypes";
import onClickOutside from "react-onclickoutside";
import placeholder1 from "../../../assets/img_avatar.svg";
import placeholder2 from "../../../assets/employer_icon.svg";

import { Link } from "react-router-dom";
class Menu extends Component {
	state = {
		menushow: false
	};
	handleClickOutside = (evt) => {
		this.setState({ menushow: false });
	};
	navigateto(value){
        this.setState({ menushow: false });
        this.props.currentPage===value ? window.location.reload(): this.props.history.push(value);

    }



    render(){
        let {user, logout,transactions,profile}= this.props;
        let placeholder= this.props.user && parseInt(this.props.user.userTypeId)=== 2 ? placeholder1:placeholder2;

        let placeholading=this.props.profile && this.props.profile.profilePicturePath ? this.props.profile.profilePicturePath: placeholder;
        return(
            <div className="signed-in col-md-1 d-flex align-items-center  justify-content-end pr-0" style={{paddingLeft:"35px"}}>
                <img src={placeholading}
                    className="user dropdown-toggle-split pointer"
                    onClick={() => this.setState({menushow:!this.state.menushow})}
                />
                {
                    this.state.menushow &&
                    <ul className="dropdown-menu">
                        <li className="usrenamedrop">
                            {
                                user && (user.userTypeId) && (user.userTypeId === 1)
                                    ? <span onClick={()=>{
                                        this.navigateto("/profile-hire")
                                    }} className="pointer"
                                    >{user.companyName ? user.companyName:user.fullName}</span> :
                                    <span
                                        onClick={()=>{
                                            this.navigateto("/profile-work")
                                        }} className="pointer"
                                    >{user.companyName ? user.companyName:user.fullName}</span>
                            }
                            {user && (user.userTypeId) && (user.userTypeId === 1)
                                ? <div style={{
                                    display: "flex"
                                }}>
                                {
                                    transactions&&transactions.subscriptionStatus ?
                                    <p className="">{transactions.subscriptionStatus.planName  }</p>:
                                        <p className="">Free</p>
                                }
                                    <p style={{marginLeft:"10px"}}>
                                        <a onClick={()=>{
                                            this.navigateto("/pricing")
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
                        <Fragment>
                            <li>
                                {
                                    user && (user.userTypeId) && (user.userTypeId === 1)
                                        ? <a onClick={()=>{
                                        this.navigateto("/profile-hire")
                                    }} className="pointer"
                                             >Profile</a> :
                                        <a
                                            onClick={()=>{
                                                this.navigateto("/profile-work")
                                            }} className="pointer"
                                            >Profile</a>
                                }

                            </li>
                            <li><a
                                onClick={()=>{
                                    this.navigateto("/account-setting")
                                }} className="pointer"
                                >Account</a></li>
                        </Fragment>
                        {
                            user && (user.userTypeId) && (user.userTypeId === 1)
                                ? <li><a
                                onClick={()=>{
                                    this.navigateto("/billing")
                                }} className="pointer"
                                >Billing</a></li>
                                : ""
                        }
                        <li>
                            <a  onClick={()=>{
                                this.navigateto("/favorites")
                            }} className="pointer"
                                >Favorites</a>
                        </li>
                        <hr className='dropdown-line'/>
                        <div className="logout">
                            <li className="">
                                <Link to="/sign-in" className=" " onClick={()=>logout && logout()}>Logout</Link>
                            </li>
                        </div>
                    </ul>
                }
            </div>
        )
    }
}

export default onClickOutside(Menu);
