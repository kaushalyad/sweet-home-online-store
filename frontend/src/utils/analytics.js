import ReactGA from "react-ga4";

// Initialize GA4
export const initGA = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    ReactGA.initialize(import.meta.env.VITE_GA4_MEASUREMENT_ID);
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.send({
        hitType: "pageview",
        page: path,
        title: title
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
};

// Track product views
export const trackProductView = (product) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.event({
        category: 'Product',
        action: 'View',
        label: product.name,
        value: product.price,
        nonInteraction: true,
        items: [{
          item_id: product._id,
          item_name: product.name,
          price: product.price
        }]
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  }
};

// Track add to cart
export const trackAddToCart = (product, quantity) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.event({
        category: 'Cart',
        action: 'Add to Cart',
        label: product.name,
        value: product.price * quantity,
        items: [{
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          quantity: quantity
        }]
      });
    } catch (error) {
      console.error('Failed to track add to cart event:', error);
    }
  }
};

// Track buy now
export const trackBuyNow = (product, quantity) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.event({
        category: 'Cart',
        action: 'Buy Now',
        label: product.name,
        value: product.price * quantity,
        items: [{
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          quantity: quantity
        }]
      });
    } catch (error) {
      console.error('Failed to track buy now event:', error);
    }
  }
};

// Track purchase success
export const trackPurchaseSuccess = (orderId, items, totalAmount) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.event({
        category: 'Purchase',
        action: 'Success',
        label: orderId,
        value: totalAmount,
        items: items.map(item => ({
          item_id: item._id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    } catch (error) {
      console.error('Failed to track purchase success:', error);
    }
  }
};

// Track purchase failure
export const trackPurchaseFailure = (error, items, totalAmount) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA4_MEASUREMENT_ID) {
    try {
      ReactGA.event({
        category: 'Purchase',
        action: 'Failure',
        label: error.message || 'Unknown error',
        value: totalAmount,
        items: items.map(item => ({
          item_id: item._id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });
    } catch (error) {
      console.error('Failed to track purchase failure:', error);
    }
  }
};

// Track user login
export const trackLogin = (userId) => {
  ReactGA.event({
    category: 'User',
    action: 'Login',
    label: userId
  });
};

// Track user registration
export const trackRegistration = (userId) => {
  ReactGA.event({
    category: 'User',
    action: 'Registration',
    label: userId
  });
};

// Track remove from cart
export const trackRemoveFromCart = (productId, productName, productCategory, price, quantity) => {
  if (window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      items: [{
        id: productId,
        name: productName,
        category: productCategory,
        price: price,
        quantity: quantity
      }]
    });
  }
};

// Track cart view
export const trackCartView = (cartItems, total) => {
  ReactGA.event({
    category: 'Cart',
    action: 'View',
    label: 'Cart View',
    value: total
  });
};

// Track purchase
export const trackPurchase = (transactionId, value, items) => {
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'INR',
      items: items
    });
  }
};

// Track search
export const trackSearch = (searchTerm) => {
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm
    });
  }
};

// Track user session duration
export const trackSessionDuration = (duration) => {
  ReactGA.event({
    category: 'User',
    action: 'Session Duration',
    label: 'Session End',
    value: duration
  });
};

// Track user return rate
export const trackUserReturn = (userId, daysSinceLastVisit) => {
  ReactGA.event({
    category: 'User',
    action: 'Return',
    label: userId,
    value: daysSinceLastVisit
  });
};

// Track daily purchase patterns
export const trackDailyPurchasePattern = (userId, timeOfDay, dayOfWeek) => {
  ReactGA.event({
    category: 'Purchase Pattern',
    action: 'Time of Day',
    label: timeOfDay,
    value: userId
  });

  ReactGA.event({
    category: 'Purchase Pattern',
    action: 'Day of Week',
    label: dayOfWeek,
    value: userId
  });
};

// Track revenue by user
export const trackUserRevenue = (userId, totalSpent, purchaseCount) => {
  ReactGA.event({
    category: 'User Revenue',
    action: 'Total Spent',
    label: userId,
    value: totalSpent
  });

  ReactGA.event({
    category: 'User Revenue',
    action: 'Purchase Count',
    label: userId,
    value: purchaseCount
  });
};

// Track conversion events
export const trackConversion = (conversionType, value = 1) => {
  ReactGA.event({
    category: 'Conversion',
    action: conversionType,
    label: 'Success',
    value: value
  });
};

// Track conversion funnel steps
export const trackFunnelStep = (step) => {
  if (window.gtag) {
    window.gtag('event', 'funnel_step', {
      step: step
    });
  }
};

// Track cart abandonment
export const trackCartAbandonment = (cartValue, itemsCount) => {
  ReactGA.event({
    category: 'Conversion',
    action: 'Cart Abandonment',
    label: 'Abandoned Cart',
    value: cartValue
  });
};

// Track checkout completion rate
export const trackCheckoutCompletion = (value, itemsCount) => {
  if (window.gtag) {
    window.gtag('event', 'checkout_complete', {
      value: value,
      currency: 'INR',
      items_count: itemsCount
    });
  }
};

// Track user engagement score
export const trackUserEngagement = (eventName, eventCategory, eventLabel) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel
    });
  }
};

// Track product conversion rate
export const trackProductConversion = (productId, productName, value) => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: import.meta.env.VITE_GA_CONVERSION_ID,
      value: value,
      currency: 'INR',
      transaction_id: productId,
      items: [{
        id: productId,
        name: productName
      }]
    });
  }
};

// Track category conversion rate
export const trackCategoryConversion = (category, views, purchases) => {
  const conversionRate = (purchases / views) * 100;
  ReactGA.event({
    category: 'Category Conversion',
    action: 'Rate',
    label: category,
    value: conversionRate
  });
};

// Track overall conversion rate
export const trackOverallConversion = (totalVisitors, totalPurchases) => {
  const conversionRate = (totalPurchases / totalVisitors) * 100;
  ReactGA.event({
    category: 'Overall Conversion',
    action: 'Rate',
    label: 'Site Wide',
    value: conversionRate
  });
};

// Track user journey completion
export const trackUserJourney = (userId, action, success) => {
  if (window.gtag) {
    window.gtag('event', 'user_journey', {
      user_id: userId,
      action: action,
      success: success
    });
  }
};

// Track user timing
export const trackUserTiming = (category, variable, value, label) => {
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }
};

// Track error
export const trackError = (errorMessage, errorType) => {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: errorType === 'fatal'
    });
  }
};

// Track checkout step
export const trackCheckoutStep = (step, value) => {
  if (window.gtag) {
    window.gtag('event', 'checkout_progress', {
      checkout_step: step,
      value: value
    });
  }
}; 