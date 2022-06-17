import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { setAlert } from "../alerts/actions";
import axios from "axios";
import store from "../../store/configureStore";
import { unreadMessageCount } from "../../components/header/action";
import { apiPath } from "../../services/config";
import {
  isValidFileByFile,
  localdate,
  getExtensionByFile,
  getDataURL,
  isImage,
  randomString,
  currentDateTime,
} from "../../utils/common";
import Swal from "sweetalert2";
import Moment from "react-moment";
import { getReceivedMessages_Remove } from "../messages/action";
import placeholdericon from "../../assets/icons.png";
import queryString from "query-string";
import MediaQuery from "react-responsive";
import ReactDOM from "react-dom";
import MetaTags from "react-meta-tags";
import placeholder1 from "../../assets/img_avatar.svg";
import placeholder2 from "../../assets/employer_icon.svg";
import TextParser from "../../utils/TextParser";

const config = {
  headers: { "Content-Type": "application/json" },
};

class Messages extends Component {
  state = {
    chats: [],
    loading: false,
    activeChat: 0,
    messages: [],
    receiveMessage: {},
    apiPath: {},
    sendMessage: "",
    mailChat: {},
    selectedFile: "",
    nomessage: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ loading: true });
    this.loadMails();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;
    const currentConvID = queryString.parse(location.search).convID;
    const prevConvID = queryString.parse(prevLocation.search).convID;
    if (currentConvID && !prevConvID) {
      const resultsNode = ReactDOM.findDOMNode(this.refs.results);
      window.scroll(0, resultsNode.offsetTop);
    }
  }

  componentWillReceiveProps(nextpropts) {
    let { messages } = this.state;

    if (
      nextpropts.recerivedmessages &&
      nextpropts.recerivedmessages.mailId &&
      messages.length &&
      nextpropts.recerivedmessages.messageId !==
        messages[messages.length - 1].messageId
    ) {
      if (this.state.activeChat === nextpropts.recerivedmessages.mailId) {
        this.unreadMail(nextpropts.recerivedmessages.mailId);

        this.setState(
          {
            messages: [...this.state.messages, nextpropts.recerivedmessages],
            nomessage: false,
          },
          () => {
            this.scrollToBottom();
          }
        );
        let items = [...this.state.chats];
        var obj = items.filter(function (e) {
          return e.id === nextpropts.recerivedmessages.id;
        });
        if (obj.length > 0) {
          let index = items.indexOf(obj[0]);
          let receivedChat = { ...items[index] };
          receivedChat.mailDate = nextpropts.recerivedmessages.mailDate;
          receivedChat.isRead = true;
          receivedChat.lastLogin = currentDateTime();
          receivedChat.lastMessage = nextpropts.recerivedmessages.message;
          items[index] = receivedChat;
          this.setState({ chats: items, nomessage: false });
        }

        // this.unreadMail(nextpropts.recerivedmessages.mailId);
        store.dispatch(getReceivedMessages_Remove());
      } else {
        let items = [...this.state.chats];
        var obj = items.filter(function (e) {
          return e.id === nextpropts.recerivedmessages.id;
        });
        if (obj.length > 0) {
          let index = items.indexOf(obj[0]);
          let receivedChat = { ...items[index] };
          receivedChat.mailDate = nextpropts.recerivedmessages.mailDate;
          receivedChat.isRead = false;
          receivedChat.lastLogin = currentDateTime();
          receivedChat.lastMessage = nextpropts.recerivedmessages.message;
          items[index] = receivedChat;
          this.setState({ chats: items, nomessage: false });
        } else {
          nextpropts.recerivedmessages.lastLogin = currentDateTime();
          nextpropts.recerivedmessages.lastMessage =
            nextpropts.recerivedmessages.message;
          this.setState({
            chats: [...this.state.chats, nextpropts.recerivedmessages],
          });
        }
        store.dispatch(getReceivedMessages_Remove());
      }
    }
  }

  loadMails = () => {
    axios
      .get(`${apiPath}/messages/loadchats`, config)
      .then((res) => {
        const { location } = this.props;
        const currentConvID = queryString.parse(location.search).convID;
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.setState({ loading: false, chats: res.data });
            if (currentConvID) {
              this.changeActiveChat(
                res.data.find((item) => item.id == currentConvID),
                true
              );
            } else {
              var chat = res.data[0];
              this.changeActiveChat(chat, true);
            }
          }
          if (res.data.length === 0) {
            this.setState({ nomessage: true });
          }
        }
      })
      .catch((err) => {});
  };
  changeActiveChat = (mail, isFirstLoad, ifImage) => {
    this.setState({ loading: true });
    this.setState({ activeChat: mail.id, mailChat: mail });
    this.loadMessages(mail.id);
    //store.dispatch(removeUnreadMessage(1));
    if (!isFirstLoad) {
      this.props.history.push({
        pathname: "/messages",
        search: `convID=${mail.id}`,
      });
    }
    store.dispatch(unreadMessageCount());
    let items = [...this.state.chats];
    let index = items.indexOf(mail);
    if (index >= 0) {
      let receivedChat = { ...items[index] };
      receivedChat.isRead = true;
      items[index] = receivedChat;
      this.setState({ chats: items }, () => {
        this.scrollToBottom();
      });
    }
  };

  loadMessages = (id) => {
    this.setState({ messages: [] });
    axios
      .get(`${apiPath}/messages/loadmessages/` + id, config)
      .then((res) => {
        if (res.status === 200) {
          let msgsrt = res.data.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
          });
          this.setState({ loading: false, messages: msgsrt }, () => {
            this.scrollToBottom();
            let allmessages = res.data.sort(function (a, b) {
              return new Date(a.date) - new Date(b.date);
            });
            if (allmessages[allmessages.length - 1].sent === false) {
              this.unreadMail(id);
            }
          });
        }
      })
      .catch((err) => {});
  };

  setMessage = (event) => {
    let msg = event.target.value;
    event.preventDefault();
    this.setState({ sendMessage: msg });
  };

  setFile = (event) => {
    let file = event.target.files[0];
    let formDatafile = new FormData();
    formDatafile.append("file", file);
    if (event.target.files[0]) {
      axios.post(apiPath + "/upload/validatefile", formDatafile).then((res) => {
        if (res.data.result === true) {
          getDataURL(file).then((data) => {
            if (data !== "error") {
              if (isImage(data)) {
                this.setState((prevState) => ({
                  selectedFile: {
                    ...prevState.selectedFile,
                    src: data,
                    file: file,
                    fileExtension: "",
                  },
                }));
              } else {
                this.setState((prevState) => ({
                  selectedFile: {
                    ...prevState.selectedFile,
                    src: "",
                    file: file,
                    fileExtension: getExtensionByFile(file),
                  },
                }));
              }
            } else {
            }
          });
        } else {
          Swal.fire(
            "Can't upload this file format type",
            "Only upload image, pdf or office files. ",
            "error"
          ).then((result) => {});
        }
      });
    }
  };

  removeFile = () => {
    this.setState({ selectedFile: {} });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.sendMessage();
    }
  };
  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }
  sendMessage = () => {
    const {
      state: { sendMessage },
    } = this;
    const isNotEmptyMessage = !/^\s+$/.test(sendMessage) && !!sendMessage;
    if (isNotEmptyMessage || this.state.selectedFile !== "") {
      if (
        this.state.sendMessage.length !== 0 ||
        this.state.selectedFile !== null ||
        this.state.selectedFile !== ""
      ) {
        if (this.state.activeChat <= 0) {
          alert("Send any chat to send message.");
          return;
        }
        const formData = new FormData();
        if (this.state.selectedFile && this.state.selectedFile.file) {
          formData.append("attachment", this.state.selectedFile.file);
        }
        let mail = this.state.mailChat;
        formData.append("fromUserId", mail.fromUserId);
        formData.append("toUserId", mail.toUserId);
        formData.append("mailId", mail.id);
        formData.append(
          "message",
          this.state.sendMessage.replace("<", "&lt;").replace(">", "&gt;")
        );
        var newId = randomString();
        var msgAppend = {
          messageId: newId,
          message: this.state.sendMessage
            .replace("<", "&lt;")
            .replace(">", "&gt;"),
          from: mail.fromUserId,
          name: mail.name,
          Date: currentDateTime(),
          mailId: mail.id,
          sent: true,
          picture: mail.myPicture,
          fileName:
            this.state.selectedFile && this.state.selectedFile.file
              ? this.state.selectedFile.file.name
              : "",
          filePath: "",
          lastMessage: this.state.sendMessage
            .replace("<", "&lt;")
            .replace(">", "&gt;"),
          fileExtension:
            this.state.selectedFile && this.state.selectedFile.file
              ? isImage(getExtensionByFile(this.state.selectedFile.file))
                ? ""
                : getExtensionByFile(this.state.selectedFile.file)
              : "",
          fileImage:
            this.state.selectedFile && this.state.selectedFile.file
              ? isImage(getExtensionByFile(this.state.selectedFile.file))
                ? this.state.selectedFile.src
                : placeholdericon
              : "",
        };
        this.setState({ messages: [...this.state.messages, msgAppend] }, () => {
          this.scrollToBottom();
        });

        let items = [...this.state.chats];
        var obj = items.filter(function (e) {
          return e.id === mail.id;
        });
        if (obj.length > 0) {
          let index = items.indexOf(obj[0]);
          let receivedChat = { ...items[index] };
          receivedChat.mailDate = currentDateTime();
          // receivedChat.isRead = false;
          receivedChat.lastLogin = currentDateTime();
          receivedChat.lastMessage = this.state.sendMessage
            .replace("<", "&lt;")
            .replace(">", "&gt;");
          items[index] = receivedChat;
          this.setState({ chats: items, nomessage: false });
        }

        axios
          .post(`${apiPath}/messages/sendmessage`, formData)
          .then((res) => {
            if (res.data.status === "success") {
              if (res.data.fileName && res.data.filePath) {
                let messagesArray = [...this.state.messages];
                var obj = messagesArray.filter(function (e) {
                  return e.messageId === newId;
                });
                if (obj.length > 0) {
                  let index = messagesArray.indexOf(obj[0]);
                  let mesg = { ...messagesArray[index] };
                  mesg.messageId = res.data.messageId;
                  mesg.fileName = res.data.fileName;
                  mesg.filePath = res.data.filePath;
                  mesg.fileExtension = res.data.fileExtension;
                  mesg.fileImage = res.data.fileImage;
                  messagesArray[index] = mesg;
                  this.setState({ messages: messagesArray });
                }
              }
            }
          })
          .catch((err) => {});
        this.setState({ sendMessage: "" });
        this.setState({ selectedFile: "" });
      }
    }
  };

  deleteChat = (id) => {
    let con = window.confirm("Are you sure to delete this chat?");
    if (con) {
      axios
        .delete(`${apiPath}/messages/deletechat/` + id, config)
        .then((res) => {
          if (res.data.status === "success") {
            let items = [...this.state.chats];
            var obj = items.filter(function (e) {
              return e.id !== id;
            });
            this.setState({ chats: obj });
            this.setState({ messages: [] });
            this.setState({ mailChat: {} });
          }
        })
        .catch((err) => {});
    }
  };
  unreadMail = (id) => {
    let { unreadCount } = this.props;

    axios.get(`${apiPath}/messages/unreadmailcount`, config).then((res) => {
      if (
        res.status === 200 &&
        res.data.status === "success" &&
        parseInt(res.data.count) > 0
      ) {
        axios
          .post(`${apiPath}/messages/unreadmail?id=${id}`, config)
          .then((res) => {
            if (res.data.status === "success") {
              store.dispatch(unreadMessageCount());
            }
          });
      }
    });
  };
  openUserProfile = (userType, userId) => {
    if (userType === 1) {
      //client-profile
      localStorage.setItem("profileId", userId);
      localStorage.setItem("jobId_Message", this.state.mailChat.jobId);
      this.props.history.push(`/client-profile/${userId}`);
    } else {
      //work-profile
      localStorage.setItem("profileId", userId);
      localStorage.setItem("jobId_Message", this.state.mailChat.jobId);
      this.props.history.push(`/work-profile/${userId}`);
    }
  };

  toownprofile = () => {
    let { user } = this.props;
    if (parseInt(user.userTypeId) === 1) {
      this.props.history.push("/profile-hire");
    } else if (parseInt(user.userTypeId) === 2) {
      this.props.history.push("/profile-work");
    }
  };

  renderMessage = (messages, user, mailChat) => {
    let curMessage = null;
    return messages.map((item, index) => {
      let attachClass = "";
      if (item.sent === true) {
        if (curMessage !== true) attachClass = " outgoing_group_start";
        if (!(messages[index + 1] && messages[index + 1].sent === true))
          attachClass += " outgoing_group_end";
      }
      if (item.sent === false) {
        if (curMessage !== false) attachClass += " income_group_start";
        if (!(messages[index + 1] && messages[index + 1].sent === false))
          attachClass += " income_group_end";
      }
      curMessage = item.sent;
      return item.sent === false ? (
        <div className={`income_msgs${attachClass}`} key={index}>
          <div className="sender-img">
            {item.picture ? (
              <img
                src={item.picture}
                alt=""
                onClick={() =>
                  this.openUserProfile(mailChat.userType, mailChat.toUserId)
                }
                className="pointer"
              />
            ) : (
              <img
                className="pointer"
                onClick={() =>
                  this.openUserProfile(mailChat.userType, mailChat.toUserId)
                }
                src={
                  user && parseInt(user.userTypeId) === 1
                    ? placeholder1
                    : placeholder2
                }
                alt=""
              />
            )}
          </div>
          <div className="sender-msgs">
            <p className="mt-2 mb-2">
              <TextParser text={item.message} />
            </p>
            {item.fileName ? (
              item.filePath ? (
                <div>
                  <div className="attached-file">
                    <br />
                    <a target="_blank" href={item.filePath}>
                      <img
                        src={item.fileImage ? item.fileImage : placeholdericon}
                        alt={item.filename}
                        style={{
                          width: "100%",
                          zIndex: "1",
                          float: "left",
                          clear: "both",
                        }}
                        className="pointer"
                      />
                      <p className="fileextension1">{item.fileExtension}</p>
                    </a>
                  </div>
                  <a target="_blank" href={item.filePath}>
                    <p>
                      {item.fileName.slice(0, 10)}
                      {item.fileName.length > 10 && "..."}
                    </p>
                  </a>
                </div>
              ) : (
                <div>
                  <div className="attached-file">
                    <a>
                      <img
                        src={item.fileImage ? item.fileImage : placeholdericon}
                        alt={item.filename}
                        style={{
                          width: "100%",
                          zIndex: "1",
                          float: "left",
                          clear: "both",
                        }}
                        className="pointer"
                      />
                      <p
                        className="fileextension1
																								"
                      >
                        {item.fileExtension}
                      </p>
                    </a>
                  </div>
                  <a>
                    <p>
                      {item.fileName.slice(0, 10)}
                      {item.fileName.length > 10 && "..."}
                    </p>
                  </a>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div className={`outgoing_msgs${attachClass}`} key={index}>
          <div className="reciever-img">
            {mailChat.myPicture ? (
              <img
                onClick={() => this.toownprofile()}
                src={mailChat.myPicture}
                alt=""
                className="pointer"
              />
            ) : (
              <img
                onClick={() => this.toownprofile()}
                src={
                  user && parseInt(user.userTypeId) === 1
                    ? placeholder2
                    : placeholder1
                }
                alt=""
                className="pointer"
              />
            )}
          </div>

          <div className="reciever-msgs">
            <p className="mt-2 mb-2">
              <TextParser text={item.message} />
            </p>
            {item.fileName ? (
              item.filePath ? (
                <div
                  className="d-inline-flex flex-column
																							align-items-end"
                >
                  <div className="portfolio-file d-inline-flex">
                    <a target="_blank" href={item.filePath}>
                      <img
                        src={item.fileImage ? item.fileImage : placeholdericon}
                        alt={item.filename}
                        style={{
                          width: "100%",

                          height: "100%",
                          zIndex: "1",
                          float: "left",
                          clear: "both",
                        }}
                        className="pointer"
                      />
                      <p className="fileextension1">{item.fileExtension}</p>
                    </a>
                  </div>
                  <a target="_blank" href={item.filePath}>
                    <p
                      style={{
                        marginRight: "17px",
                      }}
                    >
                      {item.fileName.slice(0, 10)}
                      {item.fileName.length > 10 && "..."}
                    </p>
                  </a>
                </div>
              ) : (
                <div
                  className="d-inline-flex flex-column
                                                                                        	align-items-end"
                >
                  <div className="attached-file">
                    <a>
                      <img
                        src={item.fileImage ? item.fileImage : placeholdericon}
                        alt={item.filename}
                        style={{
                          width: "100%",
                          height: "100%",
                          zIndex: "1",
                          float: "left",
                          clear: "both",
                        }}
                        className="pointer"
                      />
                      <p className="fileextension1">{item.fileExtension}</p>
                    </a>
                  </div>
                  <a>
                    <p
                      style={{
                        marginRight: "17px",
                      }}
                    >
                      {item.fileName.slice(0, 10)}
                      {item.fileName.length > 10 && "..."}
                    </p>
                  </a>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      );
    });
  };

  render() {
    let { isAuthenticated, location, user } = this.props;
    let { loading, chats, activeChat, messages, mailChat } = this.state;
    const currentConvID = queryString.parse(location.search).convID;
    let defaultImg =
      user && parseInt(user.userTypeId) === 1 ? placeholder2 : placeholder1;
    return (
      <Fragment>
        {/*<MetaTags>*/}
        {/*<title>GoHireNow</title>*/}
        {/*<meta name="description" content="" />*/}
        {/*</MetaTags>*/}
        <div
          className={
            isAuthenticated ? "registration greybf" : "registration whitebg"
          }
          id="messages"
        >
          <div className="container ">
            <div
              className="inner-div row  align-padding"
              style={{ padding: "5% 0px 2% 0px" }}
              id="msg"
            >
              <h1>Messages</h1>
              <MediaQuery maxDeviceWidth="767px">
                {!!currentConvID && (
                  <div className="mobile-btn-group">
                    <button
                      className="mobile-btn-group-button btn text-uppercase"
                      onClick={() => this.props.history.push("/messages")}
                    >
                      <i className="arrow left"></i> contacts
                    </button>
                    <button
                      className="mobile-btn-group-button btn text-uppercase"
                      onClick={() =>
                        this.openUserProfile(
                          mailChat.userType,
                          mailChat.toUserId
                        )
                      }
                    >
                      View Profile
                    </button>
                  </div>
                )}
              </MediaQuery>
            </div>
            <div className="row row-padd margin-top">
              <div
                className={`col-md-4 pl-0 pr-0 ${
                  currentConvID ? "mobile-hide" : ""
                }`}
              >
                <div className="row left-side-outer">
                  <div className="col-sm-12 left-side-inner">
                    <div className="inbox_head">
                      <h4>INBOX</h4>
                      {[].concat(chats).length <= 0 ? (
                        <p>0</p>
                      ) : (
                        <p>{[].concat(chats).length}</p>
                      )}
                    </div>
                    <div className="inbox_chat" id="style-2">
                      {[]
                        .concat(chats)
                        // .sort(function(a, b) {
                        // 	// Turn your strings into dates, and then subtract them
                        // 	// to get a value that is either negative, positive, or zero.
                        // 	return new Date(a.mailDate) > new Date(b.mailDate);
                        // })
                        .map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={
                                "chat_list cursor_pointer pointer p-relative" +
                                (activeChat === item.id
                                  ? " active_chat "
                                  : "") +
                                (item.isRead ? "" : " unread-chat ")
                              }
                            >
                              <div
                                className="for-click "
                                onClick={() => this.changeActiveChat(item)}
                              ></div>
                              <div className="chat_people">
                                <div className="chat_img">
                                  {item.picture ? (
                                    <img
                                      src={item.picture}
                                      alt=""
                                      //  onClick={() =>
                                      //     this.openUserProfile(
                                      //         item.userType,
                                      //         item.toUserId
                                      //     )
                                      // }
                                      className="pointer"
                                    />
                                  ) : (
                                    <img
                                      // onClick={() =>
                                      //     this.openUserProfile(
                                      //         item.userType,
                                      //         item.toUserId
                                      //     )
                                      // }
                                      src={
                                        user && parseInt(user.userTypeId) === 1
                                          ? placeholder1
                                          : placeholder2
                                      }
                                      className="pointer"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div className="chat_ib">
                                  <h4>{item.name}</h4>
                                  {item.lastLogin ? (
                                    <span className="chat_date">
                                      <Moment fromNow ago>
                                        {localdate(new Date(item.lastLogin))}
                                      </Moment>{" "}
                                      ago
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  <p>
                                    {item.lastMessage ? (
                                      <TextParser text={item.lastMessage} />
                                    ) : (
                                      <TextParser text={mailChat.lastMessage} />
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <MediaQuery maxDeviceWidth="767px">
                      <div style={{ height: "20px" }} className="inbox_footer">
                        {!chats ||
                          (chats.length === 0 &&
                            "You didn't receive any message yet")}
                      </div>
                    </MediaQuery>

                    <MediaQuery minDeviceWidth="768px">
                      <div
                        style={{ height: "17px" }}
                        className="inbox_footer"
                      ></div>
                    </MediaQuery>
                  </div>
                </div>
              </div>
              <div
                className={`col-md-8 pr-0 pl-0 ${
                  !currentConvID ? "mobile-hide" : ""
                }`}
              >
                <div className="row ">
                  <div className="col-sm-12 pr-0">
                    <div className="right-side-outer">
                      {messages ? (
                        <div className="right-side-inner">
                          <div ref="results" className="message_head">
                            <div className="message_name">
                              <h2
                                className="cursor-pointer"
                                onClick={() =>
                                  this.openUserProfile(
                                    mailChat.userType,
                                    mailChat.toUserId
                                  )
                                }
                              >
                                {mailChat && mailChat.name ? mailChat.name : ""}
                              </h2>
                            </div>

                            <div className="right-side">
                              <MediaQuery minDeviceWidth="768px">
                                {mailChat && mailChat.name ? (
                                  <div>
                                    <button
                                      className="btn text-uppercase"
                                      onClick={() =>
                                        this.openUserProfile(
                                          mailChat.userType,
                                          mailChat.toUserId
                                        )
                                      }
                                    >
                                      View Profile
                                    </button>
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </MediaQuery>
                            </div>
                          </div>

                          {this.state.chats.length === 0 && (
                            <div className="messagesnotr">
                              You didn't receive any messages yet
                            </div>
                          )}
                          <div className="message_mid">
                            <div className="messages_history">
                              <div
                                id="style-2"
                                className="MessageList"
                                ref={(div) => {
                                  this.messageList = div;
                                }}
                              >
                                {this.renderMessage(messages, user, mailChat)}
                              </div>
                            </div>
                          </div>
                          {this.state.chats.length > 0 && (
                            <div className="right-side-footer">
                              <div className="right-side-footer-mobile-wrapper">
                                <div className="type-msg">
                                  <textarea
                                    rows="3"
                                    className="type-msg p-2"
                                    type="text"
                                    name="messageSend"
                                    placeholder="Type your message..."
                                    onChange={this.setMessage}
                                    value={this.state.sendMessage}
                                    onKeyDown={this.handleKeyDown}
                                  />
                                  {/*</input>*/}
                                </div>
                                <div className="attachment">
                                  <input type="file" onChange={this.setFile} />
                                  <img
                                    src={require("../../assets/attach.png")}
                                    alt=""
                                    className="pointer"
                                  />
                                </div>
                                <div className="send">
                                  <img
                                    className="cursor-pointer"
                                    src={require("../../assets/send.png")}
                                    alt=""
                                    onClick={() => this.sendMessage()}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-xs-12">
                                  {this.state.selectedFile &&
                                  this.state.selectedFile.file ? (
                                    <div className="attached-file">
                                      {this.state.selectedFile.fileExtension ===
                                      "" ? (
                                        <img
                                          src={this.state.selectedFile.src}
                                          alt="attachment"
                                          style={{
                                            width: "100%",
                                            zIndex: "1",
                                            float: "left",
                                            clear: "both",
                                            height: "100%",
                                          }}
                                          className="pointer"
                                        />
                                      ) : (
                                        <img
                                          src={placeholdericon}
                                          style={{
                                            width: "100%",
                                            zIndex: "1",
                                            float: "left",
                                            clear: "both",
                                          }}
                                          className="pointer"
                                        />
                                      )}
                                      <i
                                        className="fa fa-times-circle attached-file-cross"
                                        onClick={() => this.removeFile()}
                                        style={{
                                          zIndex: "2",
                                        }}
                                      />
                                      <p className="fileextension1">
                                        {this.state.selectedFile
                                          .fileExtension !== "" &&
                                          this.state.selectedFile.fileExtension}
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="right-side-inner">
                          <p>No Messages Found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ auth, messages, unreadCount }) => ({
  isAuthenticated: auth.isAuthenticated,
  user: auth.user,
  recerivedmessages: messages.recerivedmessages,
  unreadCount: unreadCount.unreadMessages,
});

export default connect(mapStateToProps, { setAlert })(Messages);
