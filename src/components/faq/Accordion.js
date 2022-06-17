import React, { useState, useRef, useEffect } from "react";

const Accordion = ({ q, a, idx, opened, setOpened }) => {
  const ref = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const toggleAccordion = () => {
    setOpened(opened === idx ? -1 : idx);
  };
  useEffect(() => setMaxHeight(opened === idx ? ref.current.scrollHeight : 0), [
    opened,
    idx,
    ref,
  ]);
  return (
    <div
      key={idx}
      className={"faq" + (idx === opened ? " active" : "")}
      onClick={toggleAccordion}
    >
      <div className="content">
        <p className="question">{q}</p>
        <p className="answer" ref={ref} style={{ maxHeight: `${maxHeight}px` }}>
          {a}
        </p>
      </div>
    </div>
  );
};

export default Accordion;
