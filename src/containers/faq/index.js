import React, { useEffect } from "react";
import Faq from "../../components/faq";

const FaqContainer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container pt-5">
      <Faq />
    </div>
  );
};

export default FaqContainer;
