import React from "react";
import Linkify from "react-linkify";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import Swal from "sweetalert2";
import { connect } from "react-redux";

const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);

const TextParser = ({ text, isAuthenticated, history, onClickHidden }) => {
  if (!text) {
    return <></>;
  }
  const basicReplacementText = text.replace(/\r?\n/g, "<br/>");

  let unlockSplitedTextArray;
  let hiddenSplitedTextArray;

  if (basicReplacementText.includes("[unlock]")) {
    unlockSplitedTextArray = basicReplacementText.split("[unlock]");
  }

  if (basicReplacementText.includes("[hidden]")) {
    hiddenSplitedTextArray = basicReplacementText.split("[hidden]");
  }

  const isNormalText = !unlockSplitedTextArray && !hiddenSplitedTextArray;

  const brSpliterFunction = (text) => {
    if (text.includes("<br/>")) {
      let splitedText = text.split("<br/>");
      return splitedText.map((part, index) => {
        return index == splitedText.length - 1 ? [part] : [part, <br />];
      });
    } else {
      return text;
    }
  };

  const swalUnlock = (e) => {
    e.preventDefault();
    Swal.fire({
      html: `<h2>You need to upgrade your current plan to contact candidates!</h2>
								<p style="margin-top: 50px;"></p>`,
      type: "warning",
      width: "950px",
      showCancelButton: true,
      confirmButtonColor: "#ED7B18",
      confirmButtonText: "Upgrade now!",
    }).then((result) => {
      if (result.value) {
        history.push("/pricing");
      }
    });
  };

  const swalHidden = () => {
    if (!isAuthenticated) {
      Swal.fire({
        html: `<h2>You need to sign in to contact candidates!</h2>
	 							<p style="margin-top: 50px;"></p>`,
        type: "warning",
        width: "950px",
        showCancelButton: true,
        confirmButtonColor: "#ED7B18",
        confirmButtonText: "Sign in",
      }).then((result) => {
        if (result.value) {
          history.push("/register");
        }
      });
    } else {
      onClickHidden();
    }
  };

  return (
    <Linkify componentDecorator={componentDecorator}>
      {unlockSplitedTextArray &&
        unlockSplitedTextArray.map((textPart) => {
          return [
            brSpliterFunction(textPart),
            <span onClick={(e) => swalUnlock(e)} className="unlock-flag">
              [unlock]
            </span>,
          ];
        })}
      {hiddenSplitedTextArray &&
        hiddenSplitedTextArray.map((textPart) => {
          console.warn("hidden text part", textPart);
          return [
            brSpliterFunction(textPart),
            <span onClick={(e) => swalHidden(e)} className="hidden-flag">
              [Apply]
            </span>,
          ];
        })}
      {isNormalText && brSpliterFunction(basicReplacementText)}
    </Linkify>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default compose(withRouter, connect(mapStateToProps, {}))(TextParser);
