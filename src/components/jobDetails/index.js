import React, { Component } from "react";
import MediaQuery from "react-responsive";
import Moment from "react-moment";
import Spinner from "../spinner/index";

import placeholdericon from "../../assets/icons.png";
import { mobileVendor } from "react-device-detect";
import TextParser from "../../utils/TextParser";
class JobDetails extends Component {
  localdate = (date) => {
    if (mobileVendor == "Apple") {
      return date;
    } else {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  };
  render() {
    let {
      data,
      loading,
      apiPath,
      history,
      isAuthenticated,
      onClickHidden,
    } = this.props;
    return (
      <>
        {loading && loading ? (
          <div className="row ">
            {" "}
            <Spinner />
          </div>
        ) : (
          <div id="job-details">
            {/*<h4 className="font-weight-bold heading">{data && data.title}</h4>*/}
            <div className="row">
              <div className="col-md-6 details-title">
                <h4>JOB DETAILS</h4>
                <p style={{ height: "100%" }}>
                  <TextParser
                    onClickHidden={onClickHidden}
                    text={data.description}
                  />
                </p>
              </div>
              <div className="col-md-6">
                <div>
                  <table width="100%">
                    <tr>
                      <th>TYPE</th>
                      <th>SALARY</th>
                      <th>DATE</th>
                    </tr>
                    <tr>
                      <td>{data && data.type}</td>
                      <td>
                        ${data && data.salary}/
                        {data && data.salaryType.replace("ly", "")}
                      </td>
                      <td>
                        <Moment fromNow ago>
                          {data && data.modifiedDate
                            ? this.localdate(new Date(data.modifiedDate))
                            : this.localdate(new Date(data.createDate))}
                        </Moment>{" "}
                        ago
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="second-div">
                  <h4>REQUIRED SKILLS</h4>
                  <div>
                    {data &&
                      data.jobSkills &&
                      data.jobSkills.map((item, index) => {
                        return <p>{item.name}</p>;
                      })}
                  </div>
                </div>
                {data && data.attachments && data.attachments.length > 0 && (
                  <div className="third-div">
                    <h4>ATTACHMENTS</h4>
                    <div className="third-inner-div">
                      {data.attachments.map((item, index) => {
                        return (
                          <div className="d-flex flex-column align-items-center">
                            <div className="attachments position-relative">
                              <a
                                href={`${apiPath}/Home/Download/JobAttachment?id=${item.id}`}
                                target="_blank"
                              >
                                <div className="attachment-wrapper">
                                  <img
                                    className="attachment-img"
                                    src={
                                      item.fileExtension === ""
                                        ? item.filePath
                                        : placeholdericon
                                    }
                                    alt={item.fileName}
                                  />
                                </div>
                                <p
                                  className="fileextension"
                                  style={{
                                    top: "32px",
                                    left: "10px",
                                  }}
                                >
                                  {item.fileExtension &&
                                    item.fileExtension.toUpperCase()}
                                </p>
                              </a>
                            </div>
                            <a
                              href={`${apiPath}/Home/Download/JobAttachment?id=${item.id}`}
                              target="_blank"
                            >
                              <p className="black">
                                {item &&
                                  item.fileName &&
                                  item.fileName.slice(0, 10)}
                                {item.fileName.length > 10 ? "..." : ""}
                              </p>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default JobDetails;
