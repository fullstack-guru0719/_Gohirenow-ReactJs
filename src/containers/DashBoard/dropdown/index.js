import React, { Component } from "react";

import onClickOutside from "react-onclickoutside";


class DropDown extends Component{
    state={
        dropopen:false,
        values: ""
    }
    componentDidMount(){
        this.setState({values: this.props.activestatus})
    }
    handleClickOutside = evt => {
        this.setState({dropopen:false});
    };
    changestatis(value,status){
        this.setState({values: value, dropopen:false});
        this.props.statusactive(status);
    }


render(){
    let {dropopen,values}= this.state;
    return(
        <div className="droperdown">
            <div className="droper" onClick={()=> this.setState({dropopen:!this.state.dropopen})} >
                <p>{values}</p> <i className="fa fa-chevron-down"></i>
            </div>
            {
                dropopen &&
                <ul>
                    <li onClick={()=>this.changestatis("Active",2) } ><span>Active</span></li>
                    <li onClick={()=> this.changestatis("Inactive",3)} ><span>Inactive</span></li>
                </ul>
            }
        </div>
    )
}
}

export default  onClickOutside(DropDown);