import UserBehavior from '../models/userBehavior.js';

const trackUserBehavior = async (req, res, next) => {
  try {
    // Skip tracking for admin routes and static assets
    if (req.path.startsWith('/api/admin') || req.path.startsWith('/static')) {
      return next();
    }

    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer || 'direct';
    const ip = req.ip;
    const timestamp = new Date();
    const path = req.path;
    const method = req.method;
    const query = req.query;
    const userId = req.user?._id || null;

    // Parse user agent to get device and browser info
    const deviceInfo = {
      isMobile: /Mobile|Android|iPhone/i.test(userAgent),
      isTablet: /Tablet|iPad/i.test(userAgent),
      isDesktop: !(/Mobile|Android|iPhone|Tablet|iPad/i.test(userAgent)),
      browser: getBrowserInfo(userAgent),
      os: getOSInfo(userAgent)
    };

    // Track session duration if user is logged in
    let sessionDuration = 0;
    if (userId) {
      const lastActivity = await UserBehavior.findOne({ userId })
        .sort({ timestamp: -1 })
        .select('timestamp');
      
      if (lastActivity) {
        sessionDuration = (timestamp - lastActivity.timestamp) / 1000; // in seconds
      }
    }

    // Create behavior record
    const behaviorData = {
      userId,
      timestamp,
      path,
      method,
      query,
      referrer,
      ip,
      deviceInfo,
      sessionDuration,
      userAgent
    };

    // Save to database
    await UserBehavior.create(behaviorData);

    next();
  } catch (error) {
    console.error('Error tracking user behavior:', error);
    next(); // Continue even if tracking fails
  }
};

// Helper function to get browser info
const getBrowserInfo = (userAgent) => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Other';
};

// Helper function to get OS info
const getOSInfo = (userAgent) => {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'MacOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Other';
};

export default trackUserBehavior; 