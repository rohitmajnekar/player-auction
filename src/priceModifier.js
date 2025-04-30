import React from 'react';
import './priceModifier.css'; // Import CSS for styling

const PriceModifier = ({ price, onAdd5000, onAdd10000 }) => {
  return (
    <div className="price-modifier">
      <div className="button-container-2">
        <button style={{backgroundColor:"red"}}  onClick={onAdd5000}>- ₹1,00,000</button>
        <button onClick={onAdd10000}>+ ₹1,00,000</button>
        <p>Bid Price: ${price}</p>
      </div>
    </div>
  );
};

export default PriceModifier;
