"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import AffiliateTable from "@/components/affiliates/AffiliateTable";
import AffiliateModal from "@/components/affiliates/AffiliateModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";

export default function AffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAffiliate, setCurrentAffiliate] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, revenue: 0 });
  const [loadError, setLoadError] = useState(null);

  // Load affiliates from API
  useEffect(() => {
    const loadData = async () => {
      if (!api.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const data = await api.getAffiliates();
        setAffiliates(data || []);
        
        // Calculate quick stats
        const active = data.filter(a => a.status === 'ACTIVE').length;
        const revenue = data.reduce((sum, a) => sum + (a.totalEarnings || 0), 0);
        setStats({
          total: data.length,
          active,
          revenue
        });
      } catch (error) {
        console.error("Failed to load affiliates:", error);
        setLoadError(error.message);
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          api.logout();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Filter affiliates based on search
  const filteredAffiliates = affiliates.filter(affiliate => 
    affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAdd = () => {
    setCurrentAffiliate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (affiliate) => {
    setCurrentAffiliate(affiliate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this affiliate? This action cannot be undone.")) {
      try {
        await api.deleteAffiliate(id);
        // Refresh the list
        const data = await api.getAffiliates();
        setAffiliates(data || []);
        
        // Update stats
        const active = data.filter(a => a.status === 'ACTIVE').length;
        const revenue = data.reduce((sum, a) => sum + (a.totalEarnings || 0), 0);
        setStats({ total: data.length, active, revenue });
      } catch (error) {
        console.error("Failed to delete affiliate:", error);
        alert(`Failed to delete affiliate: ${error.message}`);
      }
    }
  };

  const handleSave = async (affiliateData) => {
    try {
      if (affiliateData.id) {
        // Update existing affiliate status
        await api.updateAffiliateStatus(affiliateData.id, affiliateData.status.toUpperCase());
      } else {
        // Create new affiliate
        await api.createAffiliate({
          name: affiliateData.name,
          email: affiliateData.email,
          status: affiliateData.status.toUpperCase(),
          initialMetrics: {
            revenue: affiliateData.revenue,
            clicks: affiliateData.clicks,
            conversionRate: affiliateData.conversionRate
          }
        });
      }
      
      // Refresh the list
      const data = await api.getAffiliates();
      setAffiliates(data || []);
      
      // Update stats
      const active = data.filter(a => a.status === 'ACTIVE').length;
      const revenue = data.reduce((sum, a) => sum + (a.totalEarnings || 0), 0);
      setStats({ total: data.length, active, revenue });
    } catch (error) {
      console.error("Failed to save affiliate:", error);
      alert(`Failed to save affiliate: ${error.message}`);
      throw error; // Re-throw so the modal doesn't close
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            Affiliate Management
            <span className="badge badge-neutral badge-sm">{stats.total}</span>
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage your affiliate partners, track performance, and handle payouts.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus" 
          onClick={handleAdd}
          className="shadow-lg shadow-primary/20"
        >
          Add Affiliate
        </Button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-sm border border-base-200 p-4 flex flex-row items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Icon name="Users" size={24} />
          </div>
          <div>
            <div className="text-xs text-base-content/60 font-medium uppercase">Total Partners</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-200 p-4 flex flex-row items-center gap-4">
          <div className="p-3 rounded-full bg-success/10 text-success">
            <Icon name="CheckCircle" size={24} />
          </div>
          <div>
            <div className="text-xs text-base-content/60 font-medium uppercase">Active Now</div>
            <div className="text-xl font-bold">{stats.active}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-200 p-4 flex flex-row items-center gap-4">
          <div className="p-3 rounded-full bg-info/10 text-info">
            <Icon name="DollarSign" size={24} />
          </div>
          <div>
            <div className="text-xs text-base-content/60 font-medium uppercase">Total Revenue</div>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.revenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-base-50/50 rounded-t-xl">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search affiliates..."
                icon="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-base-100"
                bordered={true}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" size="sm" icon="Filter">Filter</Button>
              <Button variant="ghost" size="sm" icon="Download">Export</Button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-2xl border border-base-200 border-dashed">
                <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4 text-error">
                  <Icon name="AlertCircle" size={32} />
                </div>
                <h3 className="text-lg font-bold text-base-content">Failed to Load Data</h3>
                <p className="text-base-content/60 max-w-xs mt-2 mb-4">{loadError}</p>
                <Button variant="primary" icon="RefreshCw" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
              <AffiliateTable
                affiliates={filteredAffiliates}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AffiliateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        affiliate={currentAffiliate}
        onSave={handleSave}
      />
    </div>
  );
}