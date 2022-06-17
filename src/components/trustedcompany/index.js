import React,{Component} from 'react';
class TrustedCompany extends Component{
    render(){
        return(
            <div className="row black-back trust-comp  flex-column">
                <h2 className="white">A Trusted Company</h2>
                <p className="white"> We work closely with our clients</p>
                <div className="white-ovals d-flex flex-row">
                    <img className="trusted-company" src={require('../../assets/Layer7.png')} alt=""/>
                    <img className="trusted-company" src={require('../../assets/Layer5.png')} alt=""/>
                    <img className="trusted-company" src={require('../../assets/Layer11.png')} alt=""/>
                    <img className="trusted-company" src={require('../../assets/Layer6.png')} alt=""/>
                    <img className="trusted-company" src={require('../../assets/Layer10.png')} alt=""/>
                    {/*<div className="white-oval">*/}
                    {/*<div className="white-oval"/>*/}
                    {/*<div className="white-oval"/>*/}
                    {/*<div className="white-oval"/>*/}
                    {/*<div className="white-oval"/>*/}
                </div>
            </div>
        )
    }
}
export default TrustedCompany;