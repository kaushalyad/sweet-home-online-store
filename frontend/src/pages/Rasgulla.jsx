import React from 'react';

const Rasgulla = () => (
  <main className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-orange-700 mb-4">Rasgulla - Spongy Cottage Cheese Sweets</h1>
    <img src="/assets/rasgulla.jpg" alt="Rasgulla - Spongy Indian Sweet" className="w-full max-w-md rounded-xl shadow mb-6" loading="lazy" />
    <p className="mb-4 text-lg text-gray-700">Order soft and juicy <strong>Rasgulla</strong> online from Sweet Home. Our Rasgullas are made fresh daily with pure chenna and cooked in light sugar syrup for the perfect taste.</p>
    <ul className="list-disc pl-6 mb-4 text-gray-700">
      <li>Traditional Bengali recipe</li>
      <li>Fresh, spongy, and delicious</li>
      <li>Nationwide delivery</li>
    </ul>
    <p className="mb-4">Perfect for celebrations, gifting, and sweet cravings. Try the best Rasgulla today!</p>
    <a href="/collection" className="inline-block bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">Shop All Sweets</a>
  </main>
);

export default Rasgulla;
