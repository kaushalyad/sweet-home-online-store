import { Helmet } from "react-helmet-async";

const FAQSchema = () => {
  const faqData = [
    {
      question: "Do you deliver sweets across India?",
      answer: "Yes, we deliver fresh sweets across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, and many more. We use reliable courier partners to ensure your sweets reach you in perfect condition."
    },
    {
      question: "Are your sweets made fresh daily?",
      answer: "Absolutely! All our sweets are prepared fresh every morning using traditional recipes and the finest ingredients. We never use preservatives or artificial colors in our authentic Indian mithai."
    },
    {
      question: "What is the shelf life of your sweets?",
      answer: "Most of our sweets have a shelf life of 7-10 days when stored properly in an airtight container at room temperature. Dry fruits and certain sweets like kaju katli can last up to 15 days. We always recommend consuming them within 3-4 days for the best taste."
    },
    {
      question: "Do you offer bulk orders for weddings and festivals?",
      answer: "Yes, we specialize in bulk orders for weddings, festivals, corporate events, and celebrations. We offer special pricing for large orders and can customize sweets according to your requirements. Contact us for bulk order inquiries."
    },
    {
      question: "Are your sweets vegetarian?",
      answer: "Yes, all our sweets are completely vegetarian and made with pure ghee. We cater to vegetarian preferences and can also provide Jain-friendly options upon request."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including Credit/Debit cards, UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery. All transactions are secure and encrypted."
    },
    {
      question: "Can I customize sweets for special occasions?",
      answer: "Yes, we offer customization services for special occasions. You can request personalized packaging, custom messages, specific quantities, or even unique flavor combinations. Contact us in advance for custom orders."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We stand behind the quality of our sweets. If you're not satisfied with your order, you can return it within 24 hours of delivery for a full refund or exchange. Sweets must be in their original packaging and unused."
    },
    {
      question: "How do you ensure food safety and hygiene?",
      answer: "We maintain the highest standards of food safety and hygiene. Our kitchen is regularly sanitized, we use only fresh ingredients, and our team follows strict hygiene protocols. All sweets are prepared in a dedicated, clean environment."
    },
    {
      question: "Do you provide eggless options?",
      answer: "Yes, all our sweets are naturally eggless as we use traditional Indian recipes that don't require eggs. Our sweets are suitable for vegetarians and those following egg-free diets."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;