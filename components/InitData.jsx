"use client";

import { useEffect } from 'react';
import { storage } from '@/lib/storage';

/**
 * Component to initialize and seed application data from data.json
 * Runs once on mount to ensure localStorage is populated.
 */
export default function InitData() {
  useEffect(() => {
    const initializeData = async () => {
      // Check if critical data already exists to avoid unnecessary fetches
      const existingUsers = storage.get('users');
      
      if (!existingUsers) {
        try {
          console.log('Seeding initial data...');
          const response = await fetch('/data.json');
          
          if (response.ok) {
            const data = await response.json();
            storage.seed(data);
            console.log('Application data seeded successfully');
            
            // Dispatch event for other components that might be listening
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('dataSeeded'));
            }
          } else {
            console.error('Failed to fetch initial data:', response.statusText);
          }
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      } else {
        console.log('Data already seeded.');
      }
    };

    initializeData();
  }, []);

  // This component doesn't render anything visible
  return null;
}