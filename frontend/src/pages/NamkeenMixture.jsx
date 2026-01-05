import React from 'react';

const NamkeenMixture = () => (
  <main className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-orange-700 mb-4">Namkeen Mixture - Crispy Indian Snacks</h1>
    <img src="/assets/namkeen-mixture.jpg" alt="Namkeen Mixture - Indian Savory Snack" className="w-full max-w-md rounded-xl shadow mb-6" loading="lazy" />
    <p className="mb-4 text-lg text-gray-700">Buy <strong>Namkeen Mixture</strong> online from Sweet Home. Our namkeen is a blend of crispy sev, boondi, peanuts, and spices—perfect for tea time or as a party snack.</p>
    <ul className="list-disc pl-6 mb-4 text-gray-700">
      <li>Authentic taste, premium ingredients</li>
      <li>Freshly packed and delivered across India</li>
      <li>Ideal for gifting and celebrations</li>
    </ul>
    <p className="mb-4">Order now and enjoy the crunchiest namkeen delivered to your home!</p>
    <a href="/collection" className="inline-block bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">Shop All Namkeen</a>
  </main>
);

export default NamkeenMixture;
