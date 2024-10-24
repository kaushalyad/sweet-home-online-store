import React from "react";
import SliderSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { assets } from "../assets/assets";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"; // Import icons
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translate(0, -50%)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <BiChevronRight size={50} color="blue" /> {/* Custom icon */}
    </div>
  );
};

// Custom Previous Arrow
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translate(0, -50%)",
        zIndex: 1, // Ensure it appears above the slides
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <BiChevronLeft size={50} color="blue" /> {/* Custom icon */}
    </div>
  );
};

const Slider = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Add custom next arrow
    prevArrow: <PrevArrow />, // Add custom prev arrow
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
