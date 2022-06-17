import React from "react";

const Loading = (props) => {
  if (props.error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-20 mb-16" color="textSecondary">
          Something went wrong
        </h1>
        <button onClick={props.retry} variant="contained" color="secondary">
          Retry
        </button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-20 mb-16" color="textSecondary">
          Taking a long time...
        </h1>
        <button onClick={props.retry} variant="contained" color="secondary">
          Retry
        </button>
      </div>
    );
  } else if (props.pastDelay) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-20 mb-16" color="textSecondary"></h1>
      </div>
    );
  } else {
    return null;
  }
};

export default Loading;
