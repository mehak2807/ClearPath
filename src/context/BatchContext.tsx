import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Batch, JourneyEvent, batches as initialBatches } from '@/data/mockData';

interface BatchContextType {
  batches: Batch[];
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  addJourneyEvent: (batchId: string, event: JourneyEvent) => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

const STORAGE_KEY = 'clearpath_batches';

export const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>(() => {
    // Load from localStorage on mount, fallback to initial data
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading batches from localStorage:', error);
    }
    return initialBatches;
  });

  // Save to localStorage whenever batches change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
    } catch (error) {
      console.error('Error saving batches to localStorage:', error);
    }
  }, [batches]);

  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === id ? { ...batch, ...updates } : batch
      )
    );
  };

  const addJourneyEvent = (batchId: string, event: JourneyEvent) => {
    setBatches(prev =>
      prev.map(batch => {
        if (batch.id === batchId) {
          return {
            ...batch,
            journey: [...batch.journey, event],
            // Update lastUpdated to current date (YYYY-MM-DD format for consistency with batch createdAt)
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return batch;
      })
    );
  };

  const value: BatchContextType = {
    batches,
    addBatch,
    updateBatch,
    addJourneyEvent,
  };

  return <BatchContext.Provider value={value}>{children}</BatchContext.Provider>;
};

export const useBatches = (): BatchContextType => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatches must be used within a BatchProvider');
  }
  return context;
};
