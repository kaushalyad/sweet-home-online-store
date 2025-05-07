// Tracking utility for capturing user behavior
class UserTracking {
  constructor() {
    this.scrollDepth = 0;
    this.timeOnPage = 0;
    this.interactions = [];
    this.startTime = Date.now();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track scroll depth
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Track clicks
    document.addEventListener('click', this.handleClick.bind(this));

    // Track form submissions
    document.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Track search queries
    const searchInputs = document.querySelectorAll('input[type="search"], input[type="text"]');
    searchInputs.forEach(input => {
      input.addEventListener('change', this.handleSearch.bind(this));
    });

    // Track time on page
    setInterval(this.updateTimeOnPage.bind(this), 1000);

    // Track page visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  handleScroll() {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    this.scrollDepth = Math.max(this.scrollDepth, scrollPercent);
  }

  handleClick(event) {
    const target = event.target;
    const interaction = {
      type: 'click',
      element: this.getElementInfo(target),
      timestamp: new Date(),
      details: {
        text: target.textContent?.trim(),
        href: target.href,
        className: target.className
      }
    };
    this.interactions.push(interaction);
    this.sendInteraction(interaction);
  }

  handleFormSubmit(event) {
    const form = event.target;
    const interaction = {
      type: 'form_submit',
      element: this.getElementInfo(form),
      timestamp: new Date(),
      details: {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method
      }
    };
    this.interactions.push(interaction);
    this.sendInteraction(interaction);
  }

  handleSearch(event) {
    const input = event.target;
    if (input.value.trim()) {
      const interaction = {
        type: 'search',
        element: this.getElementInfo(input),
        timestamp: new Date(),
        details: {
          query: input.value.trim()
        }
      };
      this.interactions.push(interaction);
      this.sendInteraction(interaction);
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, send current session data
      this.sendSessionData();
    }
  }

  updateTimeOnPage() {
    this.timeOnPage = (Date.now() - this.startTime) / 1000;
  }

  getElementInfo(element) {
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      name: element.name
    };
  }

  async sendInteraction(interaction) {
    try {
      await fetch('/api/analytics/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(interaction)
      });
    } catch (error) {
      console.error('Error sending interaction data:', error);
    }
  }

  async sendSessionData() {
    try {
      const sessionData = {
        scrollDepth: this.scrollDepth,
        timeOnPage: this.timeOnPage,
        interactions: this.interactions
      };

      await fetch('/api/analytics/track-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      // Reset tracking data
      this.scrollDepth = 0;
      this.timeOnPage = 0;
      this.interactions = [];
      this.startTime = Date.now();
    } catch (error) {
      console.error('Error sending session data:', error);
    }
  }
}

// Initialize tracking
const userTracking = new UserTracking();

export default userTracking; 