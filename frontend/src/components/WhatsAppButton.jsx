import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '918797196867';
  const message = 'Hi! I visited your Sweet Home Online Store website and would like to know more about your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 left-4 z-50 flex items-center justify-center md:right-24 md:left-auto">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-xl md:text-2xl" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
