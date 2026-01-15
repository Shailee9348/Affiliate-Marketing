"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import KPICard from "@/components/dashboard/KPICard";
import TrendChart from "@/components/dashboard/TrendChart";
import FunnelChart from "@/components/dashboard/FunnelChart";
import Icon from "@/components/Icon";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ revenue: [], funnel: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user
        const currentUser = api.getUser();
        setUser(currentUser);

        // Fetch affiliate stats
        try {
          const affiliateStats = await api.getAffiliateStats();
          setStats({
            totalRevenue: affiliateStats.totalRevenue || 0,
            activeAffiliates: 1, // This would be dynamic in admin view
            totalClicks: affiliateStats.totalClicks || 0,
            conversionRate: affiliateStats.totalConversions > 0
              ? ((affiliateStats.totalConversions / affiliateStats.totalClicks) * 100).toFixed(2)
              : 0,
            revenueGrowth: 12.5, // This would be calculated properly
            clicksGrowth: 8.2,   // This would be calculated properly
          });
        } catch (statsError) {
          console.log("Stats not available yet:", statsError);
          // Set default values if stats not available
          setStats({
            totalRevenue: 0,
            activeAffiliates: 1,
            totalClicks: 0,
            conversionRate: 0,
            revenueGrowth: 0,
            clicksGrowth: 0,
          });
        }

        // Fetch revenue timeline data for charts
        try {
          const timelineData = await api.getRevenueTimeline(30);
          setChartData({
            revenue: timelineData.data || [],
            funnel: [
              { name: 'Clicks', value: 1000 },
              { name: 'Leads', value: 200 },
              { name: 'Conversions', value: 50 },
              { name: 'Purchases', value: 40 },
            ],
          });
        } catch (chartError) {
          console.log("Chart data not available yet:", chartError);
          setChartData({
            revenue: [],
            funnel: [],
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Dashboard Overview
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Welcome back, {user?.name || "Admin"}. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-outline bg-base-100">
            <Icon name="Download" size={16} />
            Export Report
          </button>
          <button className="btn btn-sm btn-primary">
            <Icon name="Plus" size={16} />
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : "$0"}
          trend={stats?.revenueGrowth}
          icon="DollarSign"
          color="primary"
          loading={loading}
        />
        <KPICard
          title="Active Affiliates"
          value={stats ? stats.activeAffiliates : "0"}
          trend={2.4} // Mock trend for affiliates
          trendLabel="new this month"
          icon="Users"
          color="secondary"
          loading={loading}
        />
        <KPICard
          title="Total Clicks"
          value={stats ? formatNumber(stats.totalClicks) : "0"}
          trend={stats?.clicksGrowth}
          icon="MousePointer"
          color="info"
          loading={loading}
        />
        <KPICard
          title="Conversion Rate"
          value={stats ? `${stats.conversionRate}%` : "0%"}
          trend={-0.5} // Mock negative trend
          icon="Activity"
          color="accent"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <TrendChart 
            data={chartData.revenue} 
            title="Revenue Performance" 
            loading={loading} 
          />
        </div>
        
        {/* Funnel Chart - Takes up 1 column */}
        <div className="lg:col-span-1">
          <FunnelChart 
            data={chartData.funnel} 
            title="Conversion Funnel" 
            loading={loading} 
          />
        </div>
      </div>

      {/* Quick Stats / Footer Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="alert bg-base-100 shadow-sm border border-base-200">
          <Icon name="Zap" className="text-warning" />
          <div>
            <h3 className="font-bold text-sm">System Status</h3>
            <div className="text-xs text-base-content/60">All systems operational</div>
          </div>
        </div>
        <div className="alert bg-base-100 shadow-sm border border-base-200">
          <Icon name="Clock" className="text-info" />
          <div>
            <h3 className="font-bold text-sm">Last Updated</h3>
            <div className="text-xs text-base-content/60">Just now</div>
          </div>
        </div>
        <div className="alert bg-base-100 shadow-sm border border-base-200">
          <Icon name="Shield" className="text-success" />
          <div>
            <h3 className="font-bold text-sm">Security Level</h3>
            <div className="text-xs text-base-content/60">High (Encrypted)</div>
          </div>
        </div>
      </div>
    </div>
  );
}