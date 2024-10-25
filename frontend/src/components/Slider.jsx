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
      <BiChevronRight size={40} color="blue" /> {/* Custom icon */}
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
      <BiChevronLeft size={40} color="blue" /> {/* Custom icon */}
    </div>
  );
};

const Slider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default number of slides to show
    slidesToScroll: 1,
    prevArrow: <PrevArrow />, // Assign custom left arrow
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 390, // Screen width below 350px
        settings: {
          slidesToShow: 1, // Show only 1 slide
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Example for larger screens (you can add more breakpoints)
        settings: {
          slidesToShow: 2, // Show 2 slides on medium-sized screens
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <section className="hero">
        <div className="min-h-48">
          <SliderSlick {...settings}>
            <div>
              <img src={assets.slider1} className="min-h-44" />
            </div>
            <div>
              <img src={assets.slider2} className="min-h-44" />
            </div>
            <div>
              <img src={assets.slider3} className="min-h-44" />
            </div>
            <div>
              <img src={assets.slider4} className="min-h-44" />
            </div>
          </SliderSlick>
        </div>
      </section>
    </>
  );
};

export default Slider;
