import React, {useRef, useEffect} from "react";
import "./PriceCard.css";
import Lottie from "lottie-react";
import animationData from "./Scroll Down Arrow.json";
import soldAnimationData from "./sold at auction.json";


const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const PriceCard = ({ price, isSold }) => {
  const lottieRef = useRef();
  const lottieRef2 = useRef();
 
   useEffect(() => {
     // lottieRef.current.setSpeed(0.5); // slower
     lottieRef.current.setSpeed(2); // faster
     lottieRef2.current.setSpeed(2); // faster
   }, []);
 
  return (
    <div className="price-card">
      <span className="price-title">
        Current Price
      </span>

      <span className="price-value">
        {!isSold?(
          <div>
          <div style={{ width: 250, height: 250, position: 'absolute', top: -10,left:0, rotate: '270deg' }}>
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={true}
            />
          </div>
          <div style={{ width: 250, height: 250, position: 'absolute', top: -10,right:0, rotate: '90deg' }}>
            <Lottie
              lottieRef={lottieRef2}
              animationData={animationData}
              loop={true}
              
            />
          </div>
          </div>
        ):(
          <div style={{ width: 300, height: 300, position: 'absolute', top: -70,right:0 }}>
          <Lottie
            animationData={soldAnimationData}
            loop={true}
          />
        </div>
        )
        }
        {formatter.format(price)}
      </span>
    </div>
  );
};

export default PriceCard;