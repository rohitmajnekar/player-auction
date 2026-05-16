import React from "react";
import "./PriceCard.css";

const PriceCard = ({ price }) => {
  return (
    <div className="price-card">
      <span className="price-title">
        WINNING BID
      </span>

      <span className="price-value">
        {price}
      </span>
    </div>
  );
};

export default PriceCard;