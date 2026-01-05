import React from 'react';

const KajuKatli = () => (
  <main className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-orange-700 mb-4">Kaju Katli - Premium Cashew Barfi</h1>
    <img src="/assets/kaju-katli.jpg" alt="Kaju Katli - Premium Indian Cashew Barfi" className="w-full max-w-md rounded-xl shadow mb-6" loading="lazy" />
    <p className="mb-4 text-lg text-gray-700">Buy authentic <strong>Kaju Katli</strong> online from Sweet Home. Made with the finest cashews, our Kaju Katli is soft, rich, and melts in your mouth. Perfect for Diwali, Raksha Bandhan, weddings, and gifting.</p>
    <ul className="list-disc pl-6 mb-4 text-gray-700">
      <li>100% pure cashew and premium ingredients</li>
      <li>Freshly made and delivered across India</li>
      <li>Perfect for festivals, celebrations, and gifts</li>
    </ul>
    <p className="mb-4">Order now and enjoy the best Kaju Katli delivered to your doorstep!</p>
    <a href="/collection" className="inline-block bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">Shop All Sweets</a>
  </main>
);

export default KajuKatli;
