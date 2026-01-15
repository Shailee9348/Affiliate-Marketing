"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/Icon";

const AffiliateModal = ({ isOpen, onClose, affiliate, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
    revenue: 0,
    clicks: 0,
    conversionRate: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens or affiliate changes
  useEffect(() => {
    if (isOpen) {
      if (affiliate) {
        setFormData({
          name: affiliate.name || "",
          email: affiliate.email || "",
          status: affiliate.status || "Active",
          revenue: affiliate.revenue || 0,
          clicks: affiliate.clicks || 0,
          conversionRate: affiliate.conversionRate || 0,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          status: "Active",
          revenue: 0,
          clicks: 0,
          conversionRate: 0,
        });
      }
      setErrors({});
    }
  }, [isOpen, affiliate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    onSave({
      ...formData,
      id: affiliate ? affiliate.id : null, // Preserve ID if editing
    });
    
    setLoading(false);
    onClose();
  };

  const modalActions = (
    <div className="flex gap-3 w-full justify-end">
      <Button 
        variant="ghost" 
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button 
        variant="primary" 
        onClick={handleSubmit}
        loading={loading}
        icon="Save"
      >
        {affiliate ? "Update Affiliate" : "Add Affiliate"}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={affiliate ? "Edit Affiliate" : "Add New Affiliate"}
      actions={modalActions}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Info Section */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-base-content/70 mb-2 flex items-center gap-2">
              <Icon name="User" size={16} />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200">
              <Input
                label="Full Name"
                name="name"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon="User"
                className="bg-base-100"
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="e.g. sarah@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon="Mail"
                className="bg-base-100"
              />

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select select-bordered w-full bg-base-100"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Performance Metrics Section (Simulation) */}
          <div className="col-span-1 md:col-span-2 mt-2">
            <h4 className="text-sm font-semibold text-base-content/70 mb-2 flex items-center gap-2">
              <Icon name="BarChart2" size={16} />
              Initial Metrics (Simulation)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-base-200/50 rounded-xl border border-base-200">
              <Input
                label="Revenue ($)"
                name="revenue"
                type="number"
                min="0"
                step="0.01"
                value={formData.revenue}
                onChange={handleChange}
                icon="DollarSign"
                className="bg-base-100"
              />
              
              <Input
                label="Clicks"
                name="clicks"
                type="number"
                min="0"
                value={formData.clicks}
                onChange={handleChange}
                icon="MousePointer"
                className="bg-base-100"
              />
              
              <Input
                label="Conv. Rate (%)"
                name="conversionRate"
                type="number"
                min="0"
                step="0.1"
                max="100"
                value={formData.conversionRate}
                onChange={handleChange}
                icon="Percent"
                className="bg-base-100"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AffiliateModal;