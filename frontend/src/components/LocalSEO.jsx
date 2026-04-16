import { Helmet } from "react-helmet-async";

const LocalSEO = () => {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sweet Home Online Store",
    "image": "https://sweethome-store.com/sweet_home_logo.jpg",
    "description": "Authentic Indian sweets and mithai online store with fresh daily delivery across India. Premium quality sweets, namkeen, cookies & festive packs.",
    "url": "https://sweethome-store.com",
    "telephone": "+91-9931018857",
    "email": "sweethomeonlinestorehelp@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nearby PNB BANK, Main Road JaiNagar",
      "addressLocality": "Ladania",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "273001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.8467",
      "longitude": "84.0667"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/sweethomeonline",
      "https://www.instagram.com/sweethomeonline",
      "https://twitter.com/sweethomeonline",
      "https://wa.me/918797196867"
    ],
    "priceRange": "₹₹",
    "paymentAccepted": ["Cash", "Credit Card", "UPI", "Net Banking"],
    "currenciesAccepted": "INR",
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "State",
        "name": "Uttar Pradesh"
      },
      {
        "@type": "City",
        "name": "Gorakhpur"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Sweet Home Product Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Kaju Katli",
            "category": "Indian Sweets"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Barfi",
            "category": "Indian Sweets"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Laddoos",
            "category": "Indian Sweets"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Anita Sharma"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Amazing quality sweets! Fresh and authentic taste. Highly recommended for festivals."
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessData)}
      </script>
      {/* Additional local SEO meta tags */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Gorakhpur, Uttar Pradesh, India" />
      <meta name="geo.position" content="26.8467;84.0667" />
      <meta name="ICBM" content="26.8467, 84.0667" />
      <meta name="business:contact_data:street_address" content="Nearby PNB BANK, Main Road JaiNagar, Ladania" />
      <meta name="business:contact_data:locality" content="Gorakhpur" />
      <meta name="business:contact_data:region" content="Uttar Pradesh" />
      <meta name="business:contact_data:postal_code" content="273001" />
      <meta name="business:contact_data:country_name" content="India" />
      <meta name="business:contact_data:phone_number" content="+91-9931018857" />
      <meta name="business:contact_data:email" content="sweethomeonlinestorehelp@gmail.com" />
    </Helmet>
  );
};

export default LocalSEO;