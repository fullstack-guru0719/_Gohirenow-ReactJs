import React, { useMemo } from "react";
import ReactStars from "react-rating";

export default function StarRating({ rating, onChange }) {
  const settings2 = useMemo(() => {
    const commonSettings = {
      emptySymbol: "fa fa-star-o",
      fullSymbol: "fa fa-star",
      initialRating: rating,
    };
    if (!onChange)
      return {
        ...commonSettings,
        fractions: 2,
        readonly: true,
      };

    return {
      ...commonSettings,
      fractions: 1,
      readonly: false,
      onChange,
    };
  }, [rating, onChange]);
  return (
    <div className="wrapper-rating">
      <span className="number-rating">{rating ? rating.toFixed(1) : 0}</span>
      <div className="star-rating">
        <ReactStars {...settings2} />
      </div>
    </div>
  );
}
