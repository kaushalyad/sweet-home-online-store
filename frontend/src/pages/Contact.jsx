import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-between md:flex-row gap-10 mb-28">
        <img
          className=" max-h-96"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            Nearby PNB BANK <br />
            Main Road JaiNagar, Ladania
          </p>
          <p className="text-gray-500">
            Tel: (+91) 9931018857 <br />
            Email:{" "}
            <a
              href="mailto:sweethomeonlinestorehelp@gmail.com"
              className="underline"
            >
              sweethomeonlinestorehelp@gmail.com
            </a>
          </p>

          <p className="font-semibold text-xl text-gray-600">
            Careers at Sweet Home{" "}
          </p>
          <p className=" text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
