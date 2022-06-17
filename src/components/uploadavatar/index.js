import React, { useState, useEffect } from "react";
import { apiPath } from "../../services/config";
// import placeworker from "../../assets/img_avatar.svg";
import placeclient from "../../assets/editpic.png";

import Swal from "sweetalert2";
import axios from "axios";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { createProfile } from '../../containers/profiles/actions'

import store from '../../store/configureStore';

import {getProfileInfo} from '../../containers/accountSetting/actions'
import MediaQuery from "react-responsive";


const UploadProfile = ({requiredMark, file,pictureRequire, country, createProfile ,uploadingProfile, userStoreData,imageuoload},props) => {
  const [ image, setImage ] = useState(null);
  const [ changeImage, setChangeImaga] = useState(true);
  useEffect(() => {
    if (file && changeImage) {

      setImage(file)
    }

  });

  const onChange = e => {
    if (e.target.files[0]) {
        let formDatafile = new FormData();
        formDatafile.append('file', e.target.files[0]);
        let filer=e.target.files;
      axios.post(apiPath+"/upload/validatefile",formDatafile).then((res)=>{
            if(res.data.result===true){
                const formData = new FormData();
                formData.append("profile_picture",filer[0]);
                axios.post(apiPath+"/account/upload-profile-picture", formData).then((res)=>{
                  setChangeImaga(false);
                  setImage(res.data);
                  store.dispatch(getProfileInfo(1));
                  imageuoload && imageuoload(res.data);
                }) 
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

    }
  }
  let placeholder=placeclient;
  let imageSrc =  image  ?  image  : placeholder;
  let classNames= { image } ? "placer": "placeholder"

  return (
    <div className="user-div">
      <div className="user-pic-upload pointer">
        <input className="pointer" type="file" accept="image/*" onChange={onChange}
        style={{
          padding:"0px"
        }}/>
        <img src={imageSrc} className={classNames} alt="" />{" "}
        {/* i have removed className={image ? "mainimg" : ""} because it doesnt allow uploading anyother image once image is uploaded , probably some css issue*/}
      </div>
      {uploadingProfile ? <p>Uploading Profile ...</p> : null}
      <div className="user-pic">
        {/* {this.state.image === "" && ( */}
        <span className="">
            <input className="pointer" style={
            {
                borderRadius: "0px",
            margin: "17px 0px 0px 0px",
            height: "36px",
                padding:"0px"
            }
        } type="file" accept="image/*" onChange={onChange} />
          { userStoreData && parseInt(userStoreData.userTypeId) === 2 && pictureRequire && pictureRequire&&
            <div>
                <MediaQuery minDeviceWidth="768px">
                    <p className="red-color1">*Required</p>
                </MediaQuery>
          </div>  
          }
          <h4 className="" style={{marginTop: userStoreData && userStoreData.userTypeId === 2 ? "10px":""}}>{userStoreData && userStoreData.userTypeId === 2 ? (requiredMark ? <span><span style={{color: 'red'}}>*</span><span>Upload picture</span></span> : 'Upload picture') : "Upload logo"}</h4>
        </span>
        {/* )} */}
      </div>
    </div>
  );
}

UploadProfile.propTypes = {

};

const mapStateToProps = ({ alert, auth }) => {
  return {
    uploadingProfile: alert.show,
    userStoreData : auth.user,

  };
};


export default connect(
  mapStateToProps,
  { createProfile }
)(UploadProfile);
