import React from "react";
import Title from "./Title";
import { motion } from "framer-motion";
import { useState } from "react";
import NotifyMeWidget from "./NotifyMeWidget";
import kesar_delight from "../assets/kesar_delight.png";
import family_box from "../assets/family_box.png";
import festive_gift_pack from "../assets/festive_gift_pack.png";

// Static placeholders for upcoming products (replace with real data when available)
const upcomingSeed = [
  {
    _id: "upcoming-1",
    name: "Kesar Delight (Coming Soon)",
    image: [kesar_delight],
    price: 0,
    tags: ["upcoming"],
  },
  {
    _id: "upcoming-2",
    name: "Family Box (Pre-order)",
    image: [family_box],
    price: 0,
    tags: ["upcoming"],
  },
  {
    _id: "upcoming-3",
    name: "Festive Gift Pack",
    image: [festive_gift_pack],
    price: 0,
    tags: ["upcoming"],
  },
];

const Upcoming = () => {
  const [activeProduct, setActiveProduct] = useState(null)

  const NotifyButton = ({ product }) => {
    return (
      <button
        onClick={() => setActiveProduct(product)}
        className="w-full sm:w-auto px-4 py-2 bg-pink-500 text-white rounded-full"
      >
        Notify Me
      </button>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="text-center py-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Title text1={"Coming"} text2={"Soon"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 px-4">Exciting new products launching soon — stay tuned or sign up for notifications.</p>
        </motion.div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 gap-y-8">
          {upcomingSeed.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-40 sm:h-56 md:h-64 overflow-hidden">
                <img src={p.image[0]} alt={`${p.name} - Indian Sweet or Namkeen`} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-2">Pre-order opening soon. Subscribe for updates.</p>
                <div className="mt-4">
                  <NotifyButton product={p} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeProduct && (
        <NotifyMeWidget
          productId={activeProduct._id}
          productName={activeProduct.name}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
};

export default Upcoming;
