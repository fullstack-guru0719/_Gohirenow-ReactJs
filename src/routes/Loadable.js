import Loadable from "react-loadable";
import Loading from "./Loading";

/**
 * Loadable defaults
 * For to Avoid Repetition
 */
const ComponentLoadable = (opts) => {
  return Loadable(
    Object.assign(
      {
        loading: Loading,
        delay: 300,
        timeout: 10000,
      },
      opts
    )
  );
};

export default ComponentLoadable;
