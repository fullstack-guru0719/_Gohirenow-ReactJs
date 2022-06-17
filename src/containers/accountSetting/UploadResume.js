import React, { Component, Fragment } from "react";
import { apiPath } from "../../services/config";
import axios from "axios";
import Spinner from '../../components/spinner/index';


import Swal from "sweetalert2";
import store from '../../store/configureStore';

import {getProfileInfo} from '../accountSetting/actions'

class UploadResume extends Component {
  state = {
    resume: "",
    resumeName: "Attach your resume",
    uploadingProfile: false,
    upload: false,
      profilepicture:null,
      filevalue:"Select a picture"
  };

  componentDidMount() {

  }

  componentDidUpdate(prevProp) {

  }
    onChanging = e => {
        let formDatafile = new FormData();
        formDatafile.append('file', e.target.files[0]);
        let filer=e.target.files;
        axios.post(apiPath+"/upload/validatefile",formDatafile).then((res)=>{
            if(res.data.result===true){

                this.setState({profilepicture:filer[0]}, () => {})
                this.setState({filevalue: filer[0].name})
            }
            else{
                Swal.fire({
                    // title: "You need to complete your profile",
                    // text: "A picture,Your expertise,title At least one skill",
                    html:
                        `<p>${res.data.message}</p> `,
                    type: "warning",
                    showCancelButton: true,

                }).then((result) => {

                })
            }
        })

};

    onUploadResume=()=>{



        if (this.state.profilepicture !== null) {
            this.setState({upload:true})
          const formData = new FormData();

            formData.append("profile_picture", this.state.profilepicture);
            axios.post(apiPath+"/account/upload-profile-picture", formData).then((res)=>{

                this.props.getProfileInfo();
                store.dispatch(getProfileInfo(1));
                this.setState({upload:false})
                this.setState({filevalue: "Select a picture"})
            })
        }

    };

  render() {
    const { resumeName, upload, filevalue } = this.state;

    return (
      <Fragment>
        <div className="upload-div">
          <input type="file" onChange={(e)=>this.onChanging(e)} />
          <img src={require("../../assets/attach.png")} alt="" />
          <p>{filevalue!== "Select a picture" ? filevalue.slice(0,15):filevalue}
          {filevalue!== "Select a picture" && filevalue.length > 15 && "..."}</p>
          <button className="btn text-uppercase" onClick={()=>this.onUploadResume()}>
            {!upload ?"Upload ": "Uploading"}
          </button>
        </div>
        {/*<p>{parseInt(this.props.userStoreData.userType) === 2 ? "Your resume will be attached with all the jobs you apply." : ""}</p>*/}
      </Fragment>
    );
  }
}

export default UploadResume;
