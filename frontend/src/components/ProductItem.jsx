import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer"
      to={`/product/${id}`}
    >
      <div className=" overflow-hidden rounded-sm">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 small_mobile:text-sm mobile:text-md">{name}</p>
      <p className=" mobile:text-md font-medium">
        <span className="text-xs">{currency}</span> <span className="text-center">{price}</span>
      </p>
    </Link>
  );
};

export default ProductItem;
