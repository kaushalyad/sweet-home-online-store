import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '918797196867';
  const message = 'Hi! I visited your Sweet Home Online Store website and would like to know more about your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex items-center justify-center md:right-6 md:bottom-20">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-2xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-emerald-300"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
