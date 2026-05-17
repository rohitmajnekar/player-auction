import React from "react";
import "./PriceCard.css";

const PriceCard = ({ price }) => {
  return (
    <div className="price-card">
      <span className="price-title">
        Current Price
      </span>

      <span className="price-value">
        {price}L
      </span>
    </div>
  );
};

export default PriceCard;