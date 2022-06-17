import React, { Component } from "react";
import axios from "axios";

import { apiPath } from "../services/config";

export class Errorboundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log the error to our server with loglevel
    let formData = new FormData();
    const message = error + " " + info.componentStack;
    const prettyMessage = message ? message.replace(/[\n\r]/g, " ") : "";
    console.log("error occured", prettyMessage);
    if (prettyMessage !== "") {
      formData.append("ErrorMessage", prettyMessage.replace(/ +(?= )/g, ""));
      console.log("error occured", prettyMessage.replace(/ +(?= )/g, ""));
      axios.post(apiPath + "/Account/ErrorLog", formData).then((res) => {
        console.log(res);
      });
    }
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
