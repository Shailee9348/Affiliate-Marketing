const APP_KEY_PREFIX = 'affiliate_dashboard_';

/**
 * Utility library for consistent localStorage interactions.
 * Handles JSON parsing/stringifying and SSR safety checks.
 */
export const storage = {
  /**
   * Retrieve an item from localStorage
   * @param {string} key - The key to retrieve
   * @returns {any} - The parsed value or null if not found/error
   */
  get: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(APP_KEY_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return null;
    }
  },

  /**
   * Save an item to localStorage
   * @param {string} key - The key to save to
   * @param {any} value - The value to save (will be stringified)
   */
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(APP_KEY_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing key "${key}" to localStorage:`, error);
    }
  },

  /**
   * Remove an item from localStorage
   * @param {string} key - The key to remove
   */
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(APP_KEY_PREFIX + key);
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  },

  /**
   * Seed localStorage with initial data if keys don't exist
   * @param {Object} data - Object where keys are storage keys and values are initial data
   */
  seed: (data) => {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(data).forEach(key => {
        const existing = window.localStorage.getItem(APP_KEY_PREFIX + key);
        if (!existing) {
          window.localStorage.setItem(APP_KEY_PREFIX + key, JSON.stringify(data[key]));
        }
      });
    } catch (error) {
      console.error('Error seeding data to localStorage:', error);
    }
  },

  /**
   * Clear all app-specific keys from localStorage
   */
  clearAll: () => {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith(APP_KEY_PREFIX)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};