import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ 
  title = "Sweet Home Online Store | Buy Fresh Indian Sweets, Mithai, Namkeen & Dry Fruits",
  description = "Order authentic Indian sweets, traditional mithai, namkeen, and premium dry fruits online. Fresh homemade sweets delivered to your doorstep.",
  keywords = "indian sweets online, buy mithai online, traditional sweets, namkeen online",
  ogImage = "https://sweethome-store.com/sweet_home_logo.jpg",
  canonicalUrl,
  article = false,
  alternateLanguages = [] // Array of {lang: 'en-IN', url: 'https://...'}
}) => {
  const fullTitle = title.includes('Sweet Home') ? title : `${title} | Sweet Home Online Store`;
  const url = canonicalUrl || `https://sweethome-store.com${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Hreflang tags for international SEO */}
      {alternateLanguages.map((alt) => (
        <link key={alt.lang} rel="alternate" hreflang={alt.lang} href={alt.url} />
      ))}
      <link rel="alternate" hreflang="en-IN" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEOHead;
