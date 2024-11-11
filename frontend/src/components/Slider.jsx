import React from "react";
import SliderSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { assets } from "../assets/assets";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        top: "50%",
        right: "1px",
        transform: "translate(0, -50%)",
        cursor: "pointer",
        backgroundColor: "black",
        padding: "22px 2px",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        zIndex: 2,
      }}
      onClick={onClick}
    >
      <BiChevronRight size={30} color="blue" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        display: "block",
        position: "absolute",
        top: "50%",
        left: "1px",
        transform: "translate(0, -50%)",
        cursor: "pointer",
        backgroundColor: "black",
        padding: "22px 2px",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "8px",
        zIndex: 2,
      }}
      onClick={onClick}
    >
      <BiChevronLeft size={30} color="blue" />
    </div>
  );
};

const Slider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 150, // Fast transition speed for "appear"
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Longer stay duration
    cssEase: "ease-in", // Start fast, ease into position
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="hero">
      <div className="min-h-48">
        <SliderSlick {...settings}>
          <div>
            <img src={assets.slider1} alt="Slide 1" className="min-h-44" />
          </div>
          <div>
            <img src={assets.slider2} alt="Slide 2" className="min-h-44" />
          </div>
          <div>
            <img src={assets.slider3} alt="Slide 3" className="min-h-44" />
          </div>
          <div>
            <img src={assets.slider4} alt="Slide 4" className="min-h-44" />
          </div>
        </SliderSlick>
      </div>
    </section>
  );
};

export default Slider;
