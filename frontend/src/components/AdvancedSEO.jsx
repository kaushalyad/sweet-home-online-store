import { Helmet } from "react-helmet-async";

const AdvancedSEO = () => {
  // Website structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sweet Home Online Store",
    "url": "https://sweethome-store.com",
    "description": "Authentic Indian sweets and mithai online store with fresh daily delivery across India",
    "publisher": {
      "@type": "Organization",
      "name": "Sweet Home Online Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sweethome-store.com/sweet_home_logo.jpg"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sweethome-store.com/collection?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sweethome-store.com/"
      }
    ]
  };

  // Product category structured data
  const categoryData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sweet Categories",
    "description": "Browse our collection of authentic Indian sweets by category",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Sweets",
        "url": "https://sweethome-store.com/collection?category=sweets"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Namkeen",
        "url": "https://sweethome-store.com/collection?category=namkeen"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Beverages",
        "url": "https://sweethome-store.com/collection?category=beverages"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Cookies",
        "url": "https://sweethome-store.com/collection?category=cookies"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Ready To Eat",
        "url": "https://sweethome-store.com/collection?category=ready-to-eat"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Festive Packs",
        "url": "https://sweethome-store.com/collection?category=gift-boxes"
      }
    ]
  };

  // Social media profiles
  const socialProfiles = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sweet Home Online Store",
    "url": "https://sweethome-store.com",
    "sameAs": [
      "https://www.facebook.com/sweethomeonline",
      "https://www.instagram.com/sweethomeonline",
      "https://twitter.com/sweethomeonline",
      "https://wa.me/918797196867"
    ]
  };

  return (
    <Helmet>
      {/* Website structured data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>

      {/* Breadcrumb structured data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>

      {/* Category structured data */}
      <script type="application/ld+json">
        {JSON.stringify(categoryData)}
      </script>

      {/* Social profiles structured data */}
      <script type="application/ld+json">
        {JSON.stringify(socialProfiles)}
      </script>

      {/* Advanced SEO meta tags */}
      <meta name="theme-color" content="#fb641b" />
      <meta name="msapplication-TileColor" content="#fb641b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Sweet Home" />

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Performance hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* Additional social media meta tags */}
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Sweet Home Online Store" />
      <meta name="twitter:site" content="@sweethomeonline" />
      <meta name="twitter:creator" content="@sweethomeonline" />

      {/* E-commerce specific meta tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Additional business information */}
      <meta name="business:contact_data:website" content="https://sweethome-store.com" />
      <meta name="business:contact_data:hours" content="Monday-Saturday 9AM-8PM, Sunday 10AM-6PM" />
    </Helmet>
  );
};

export default AdvancedSEO;