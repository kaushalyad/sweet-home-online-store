import React, { useState } from "react";

const faqData = [
  {
    question: "Do you deliver Indian sweets and namkeen across India?",
    answer:
      "Yes! We deliver fresh Indian sweets, mithai, namkeen, and dry fruits to all major cities and towns in India. Our logistics partners ensure safe, fast, and hygienic delivery right to your doorstep. You can track your order online and get updates at every step.",
  },
  {
    question: "Are your sweets and snacks freshly made?",
    answer:
      "Absolutely! All our products are prepared daily in small batches using traditional recipes and premium ingredients. We never use preservatives or artificial flavors, so you get the most authentic taste and freshness in every bite.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods including UPI, credit/debit cards, net banking, and cash on delivery. All transactions are processed securely through trusted payment gateways like Razorpay.",
  },
  {
    question: "Do you offer sweets for festivals and gifting?",
    answer:
      "Yes, we have special gift boxes and festive packs for Diwali, weddings, birthdays, and all occasions. You can also place bulk and corporate orders for custom packaging and personalized messages.",
  },
  {
    question: "How do you ensure the quality and safety of your products?",
    answer:
      "We follow strict hygiene protocols in our kitchens and use only FSSAI-certified ingredients. Every batch is quality checked before shipping. Our packaging is designed to keep your sweets and snacks fresh during transit.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, after placing your order you will receive a tracking link via SMS and email. You can also log in to your account to view real-time order status and delivery updates.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we deliver only within India. We are working on expanding to international shipping soon!",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full my-16 px-0 sm:px-4 py-10 bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full opacity-30 blur-2xl z-0"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-2xl z-0"></div>
      <h2 className="text-3xl font-extrabold mb-10 text-center text-orange-700 drop-shadow-lg tracking-tight relative z-10">
        Frequently Asked Questions
      </h2>
      <div className="space-y-5 relative z-10">
        {faqData.map((faq, idx) => (
          <div key={idx} className={`transition-all duration-300 rounded-2xl border-2 ${openIndex === idx ? 'border-orange-400 bg-white/90 shadow-lg scale-[1.02]' : 'border-orange-100 bg-white/60 hover:shadow-md'} overflow-hidden` }>
            <button
              className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-orange-300 font-semibold text-lg text-orange-900 bg-transparent transition group"
              onClick={() => toggleFAQ(idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="flex items-center">
                <svg className={`w-6 h-6 mr-3 transition-transform duration-300 ${openIndex === idx ? 'rotate-90 text-orange-500' : 'text-orange-300'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                {faq.question}
              </span>
              <span className={`ml-4 text-2xl transition-transform duration-300 ${openIndex === idx ? 'text-orange-500 rotate-45' : 'text-orange-300'}`}>+</span>
            </button>
            <div
              className={`grid transition-all duration-300 bg-white ${openIndex === idx ? 'grid-rows-[1fr] opacity-100 py-4 px-8' : 'grid-rows-[0fr] opacity-0 py-0 px-8'} ease-in-out`}
              style={{
                gridTemplateRows: openIndex === idx ? '1fr' : '0fr',
              }}
            >
              <div className={`overflow-hidden text-gray-700 text-base leading-relaxed ${openIndex === idx ? 'pb-2' : 'pb-0'}`}>{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
