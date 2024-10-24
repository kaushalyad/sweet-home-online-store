import React from "react";
import SliderSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { assets } from "../assets/assets";
const Slider = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          <SliderSlick {...settings}>
            <div>
              <img src={assets.slider1} />
            </div>
            <div>
              <img src={assets.slider2} />
            </div>
            <div>
              <img src={assets.slider3} />
            </div>
            <div>
              <img src={assets.slider4} />
            </div>
          </SliderSlick>
        </div>
      </section>
    </>
  );
};

export default Slider;
