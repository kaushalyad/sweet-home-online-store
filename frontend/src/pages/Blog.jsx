import React from 'react';

const Blog = () => (
  <main className="max-w-4xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-orange-700 mb-6">Sweet Home Blog & Recipes</h1>
    <article className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">How to Make Perfect Kaju Katli at Home</h2>
      <p className="text-gray-700 mb-2">Kaju Katli is one of India’s most loved sweets. Here’s a simple recipe to make it at home:</p>
      <ol className="list-decimal pl-6 mb-2 text-gray-700">
        <li>Grind 1 cup cashews to a fine powder.</li>
        <li>Cook 1/2 cup sugar with 1/4 cup water to make syrup.</li>
        <li>Add cashew powder, cook until thick, then knead and roll out.</li>
        <li>Cut into diamond shapes and enjoy!</li>
      </ol>
      <p className="text-sm text-gray-500">Tip: Use fresh cashews for best results.</p>
    </article>
    <article className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Best Sweets for Diwali Gifting</h2>
      <p className="text-gray-700 mb-2">Diwali is incomplete without sweets! Popular choices include Kaju Katli, Motichoor Ladoo, and Soan Papdi. Order your festive sweets online for quick delivery.</p>
    </article>
    <article>
      <h2 className="text-2xl font-semibold mb-2">Why Choose Fresh Namkeen from Sweet Home?</h2>
      <p className="text-gray-700">Our namkeen is made fresh daily with premium ingredients. Enjoy the crunch and authentic taste in every bite!</p>
    </article>
  </main>
);

export default Blog;
