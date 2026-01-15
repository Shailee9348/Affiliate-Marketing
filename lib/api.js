const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * API Service for backend communication
 */

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  /**
   * Get the stored JWT token
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('affiliate_dashboard_auth');
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed.token || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Store JWT token and user data
   */
  setAuth(token, user) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('affiliate_dashboard_auth', JSON.stringify({ token, user }));
    } catch (error) {
      console.error('Error setting auth:', error);
    }
  }

  /**
   * Get stored user data
   */
  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('affiliate_dashboard_auth');
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed.user || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Clear auth data
   */
  clearAuth() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('affiliate_dashboard_auth');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store auth data on successful registration
    if (response.access_token && response.user) {
      this.setAuth(response.access_token, response.user);
    }
    
    return response;
  }

  async login(data) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store auth data on successful login
    if (response.access_token && response.user) {
      this.setAuth(response.access_token, response.user);
    }
    
    return response;
  }

  async logout() {
    this.clearAuth();
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  // Affiliate endpoints
  async getAffiliateProfile() {
    return this.request('/affiliates/profile');
  }

  async getAffiliateStats() {
    return this.request('/affiliates/stats');
  }

  async updateAffiliateProfile(data) {
    return this.request('/affiliates/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Campaign endpoints
  async getCampaigns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/campaigns${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCampaignDetails(campaignId) {
    return this.request(`/campaigns/${campaignId}`);
  }

  async getCampaignStats(campaignId) {
    return this.request(`/campaigns/${campaignId}/stats`);
  }

  async createCampaign(data) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(campaignId, data) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(campaignId) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }

  // Tracking endpoints
  async generateTrackingLink(campaignId, landingUrl) {
    return this.request(`/tracking/link/${campaignId}?landingUrl=${encodeURIComponent(landingUrl)}`);
  }

  async getClickStats(campaignId) {
    return this.request(`/tracking/stats/${campaignId}`);
  }

  async getClickTimeline(campaignId, days = 7) {
    return this.request(`/tracking/timeline/${campaignId}?days=${days}`);
  }

  // Conversion endpoints
  async getConversions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/conversions/campaign/${params.campaignId || ''}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getConversionStats(campaignId) {
    return this.request(`/conversions/stats/${campaignId}`);
  }

  // Analytics endpoints
  async getAnalytics(days = 30) {
    return this.request(`/analytics/affiliate?days=${days}`);
  }

  async getRevenueTimeline(days = 30) {
    return this.request(`/analytics/revenue-timeline?days=${days}`);
  }

  async getCommissionTimeline(days = 30) {
    return this.request(`/analytics/commission-timeline?days=${days}`);
  }

  async getTopCampaigns(limit = 5) {
    return this.request(`/analytics/top-campaigns?limit=${limit}`);
  }

  // Commission endpoints
  async getCommissions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/commissions${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCommissionStats() {
    return this.request('/commissions/stats');
  }

  // Payout endpoints
  async getPayouts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/payouts${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getPayoutStats() {
    return this.request('/payouts/stats');
  }

  async requestPayout(amount) {
    return this.request('/payouts/request', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAffiliates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/affiliates${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getAllAffiliates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/affiliates${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async approveAffiliate(affiliateId) {
    return this.request(`/affiliates/${affiliateId}/approve`, {
      method: 'POST',
    });
  }

  async suspendAffiliate(affiliateId) {
    return this.request(`/affiliates/${affiliateId}/suspend`, {
      method: 'POST',
    });
  }

  async updateAffiliateStatus(affiliateId, status) {
    // Call approve or suspend based on status
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'ACTIVE') {
      return this.approveAffiliate(affiliateId);
    } else if (upperStatus === 'SUSPENDED') {
      return this.suspendAffiliate(affiliateId);
    } else if (upperStatus === 'PENDING') {
      // For pending, we can set it back to pending by approving with null date
      // This endpoint doesn't exist, so we'll need to call at a different endpoint
      return this.request(`/affiliates/${affiliateId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PENDING', approvedAt: null, suspendedAt: null }),
      });
    }
    throw new Error(`Invalid status: ${status}`);
  }

  async createAffiliate(data) {
    return this.request('/affiliates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAffiliate(affiliateId) {
    return this.request(`/affiliates/${affiliateId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;