"use client";

import { useState, useMemo } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/ui/Button";

const AffiliateTable = ({ affiliates, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "joinDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting Logic
  const sortedAffiliates = useMemo(() => {
    let sortableItems = [...affiliates];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [affiliates, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedAffiliates.length / itemsPerPage);
  const currentData = sortedAffiliates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <Icon name="ChevronsUpDown" size={14} className="opacity-30" />;
    return sortConfig.direction === "asc" ? 
      <Icon name="ChevronUp" size={14} className="text-primary" /> : 
      <Icon name="ChevronDown" size={14} className="text-primary" />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "badge-success text-success-content bg-success/20 border-success/20",
      Pending: "badge-warning text-warning-content bg-warning/20 border-warning/20",
      Inactive: "badge-neutral text-neutral-content bg-neutral/20 border-neutral/20",
      Suspended: "badge-error text-error-content bg-error/20 border-error/20",
    };
    return (
      <div className={`badge gap-1 font-medium ${styles[status] || "badge-ghost"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-success' : status === 'Pending' ? 'bg-warning' : 'bg-current'}`}></span>
        {status}
      </div>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (affiliates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-2xl border border-base-200 border-dashed">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
          <Icon name="Users" size={32} className="text-base-content/30" />
        </div>
        <h3 className="text-lg font-bold text-base-content">No Affiliates Found</h3>
        <p className="text-base-content/60 max-w-xs mt-2">
          Get started by adding your first affiliate to the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200/50 text-base-content/70 text-xs uppercase tracking-wider">
              <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center gap-2">Affiliate {getSortIcon('name')}</div>
              </th>
              <th className="cursor-pointer hover:bg-base-200 transition-colors" onClick={() => requestSort('status')}>
                <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
              </th>
              <th className="cursor-pointer hover:bg-base-200 transition-colors text-right" onClick={() => requestSort('revenue')}>
                <div className="flex items-center justify-end gap-2">Revenue {getSortIcon('revenue')}</div>
              </th>
              <th className="cursor-pointer hover:bg-base-200 transition-colors text-right" onClick={() => requestSort('clicks')}>
                <div className="flex items-center justify-end gap-2">Clicks {getSortIcon('clicks')}</div>
              </th>
              <th className="cursor-pointer hover:bg-base-200 transition-colors text-right" onClick={() => requestSort('conversionRate')}>
                <div className="flex items-center justify-end gap-2">Conv. Rate {getSortIcon('conversionRate')}</div>
              </th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((affiliate) => (
              <tr key={affiliate.id} className="hover:bg-base-200/30 transition-colors group">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 bg-base-300">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${affiliate.email}`} 
                          alt={affiliate.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(affiliate.name)}&background=random`;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{affiliate.name}</div>
                      <div className="text-xs text-base-content/50">{affiliate.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(affiliate.status)}
                </td>
                <td className="text-right font-medium font-mono">
                  {formatCurrency(affiliate.revenue)}
                </td>
                <td className="text-right font-mono text-base-content/70">
                  {affiliate.clicks.toLocaleString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`font-bold ${affiliate.conversionRate > 3 ? 'text-success' : 'text-base-content/70'}`}>
                      {affiliate.conversionRate}%
                    </span>
                    <div 
                      className="radial-progress text-primary/20" 
                      style={{"--value": Math.min(affiliate.conversionRate * 10, 100), "--size": "1.2rem", "--thickness": "2px"}}
                      role="progressbar"
                    >
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-current text-primary"
                        style={{ clipPath: `inset(0 ${100 - Math.min(affiliate.conversionRate * 10, 100)}% 0 0)` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="btn btn-ghost btn-xs btn-square tooltip tooltip-left" 
                      data-tip="Edit"
                      onClick={() => onEdit(affiliate)}
                    >
                      <Icon name="Edit2" size={14} className="text-info" />
                    </button>
                    <button 
                      className="btn btn-ghost btn-xs btn-square tooltip tooltip-left" 
                      data-tip="Delete"
                      onClick={() => onDelete(affiliate.id)}
                    >
                      <Icon name="Trash2" size={14} className="text-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-base-content/50">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, affiliates.length)} of {affiliates.length} entries
          </div>
          <div className="join shadow-sm">
            <button 
              className="join-item btn btn-sm btn-ghost" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`join-item btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="join-item btn btn-sm btn-ghost" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateTable;