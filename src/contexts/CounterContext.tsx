// @ts-nocheck
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CounterState, HistoryEntry } from '@/types';
import { loadCountersFromLocalStorage, saveCountersToLocalStorage } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface CounterContextProps {
  counters: CounterState[];
  dispatch: React.Dispatch<any>; // Simplified for brevity, ideally use CounterAction
  getCounterById: (id: string) => CounterState | undefined;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  reset: (id: string) => void;
  setStep: (id: string, step: number) => void;
  setMin: (id: string, min: number | null) => void;
  setMax: (id: string, max: number | null) => void;
  setName: (id: string, name: string) => void;
  setNotes: (id: string, notes: string) => void;
  startAutoIncrement: (id: string) => void;
  pauseAutoIncrement: (id: string) => void;
  stopAutoIncrement: (id: string) => void;
  undo: (id: string) => void;
  addCounter: () => void;
  removeCounter: (id: string) => void;
}

const CounterContext = createContext<CounterContextProps | undefined>(undefined);

const createNewCounter = (): CounterState => ({
  id: uuidv4(),
  name: 'New Counter',
  count: 0,
  step: 1,
  min: null,
  max: null,
  notes: '',
  history: [{ value: 0, timestamp: Date.now() }],
  isAutoIncrementing: false,
  autoIncrementIntervalId: null,
});

const counterReducer = (state: CounterState[], action: any): CounterState[] => {
  const findCounterIndex = (id: string) => state.findIndex(c => c.id === id);

  switch (action.type) {
    case 'LOAD_COUNTERS':
      return action.counters;
    case 'ADD_COUNTER':
      return [...state, createNewCounter()];
    case 'REMOVE_COUNTER':
      return state.filter(counter => counter.id !== action.id);
    
    // All actions below operate on a specific counter by ID
    default: {
      const { id } = action;
      const counterIndex = findCounterIndex(id);
      if (counterIndex === -1) return state;

      const currentCounter = state[counterIndex];
      let newCount = currentCounter.count;
      let newHistory = [...currentCounter.history];

      const updateHistory = (val: number) => {
        if (newHistory.length >= 20) newHistory.shift(); // Limit history size
        newHistory.push({ value: val, timestamp: Date.now() });
      };
      
      let updatedCounter: CounterState = { ...currentCounter };

      switch (action.type) {
        case 'INCREMENT':
          newCount = currentCounter.count + currentCounter.step;
          if (currentCounter.max !== null && newCount > currentCounter.max) newCount = currentCounter.max;
          updateHistory(newCount);
          updatedCounter = { ...currentCounter, count: newCount, history: newHistory };
          break;
        case 'DECREMENT':
          newCount = currentCounter.count - currentCounter.step;
          if (currentCounter.min !== null && newCount < currentCounter.min) newCount = currentCounter.min;
          updateHistory(newCount);
          updatedCounter = { ...currentCounter, count: newCount, history: newHistory };
          break;
        case 'RESET':
          newCount = 0;
          updateHistory(newCount);
          updatedCounter = { ...currentCounter, count: newCount, history: newHistory };
          break;
        case 'SET_STEP':
          updatedCounter = { ...currentCounter, step: Math.max(1, action.step) };
          break;
        case 'SET_MIN':
          updatedCounter = { ...currentCounter, min: action.min };
          break;
        case 'SET_MAX':
          updatedCounter = { ...currentCounter, max: action.max };
          break;
        case 'SET_NAME':
          updatedCounter = { ...currentCounter, name: action.name };
          break;
        case 'SET_NOTES':
          updatedCounter = { ...currentCounter, notes: action.notes };
          break;
        case 'START_AUTO_INCREMENT':
          if (currentCounter.isAutoIncrementing && currentCounter.autoIncrementIntervalId) {
             clearInterval(currentCounter.autoIncrementIntervalId);
          }
          const intervalId = setInterval(() => {
            // Dispatch increment directly to ensure it uses the latest state from reducer
             // This requires dispatch to be available here or a thunk-like pattern
             // For simplicity, we'll update count directly and rely on context re-render
             // A better approach would involve dispatching 'INCREMENT' from here
             // but that creates a circular dependency or requires passing dispatch.
             // This is a known challenge with setInterval and React state.
             // Let's use a functional update with the main dispatch.
             action.asyncDispatch({ type: 'INCREMENT', id });
          }, 1000);
          updatedCounter = { ...currentCounter, isAutoIncrementing: true, autoIncrementIntervalId: intervalId };
          break;
        case 'PAUSE_AUTO_INCREMENT':
          if (currentCounter.autoIncrementIntervalId) clearInterval(currentCounter.autoIncrementIntervalId);
          updatedCounter = { ...currentCounter, isAutoIncrementing: false, autoIncrementIntervalId: null };
          break;
        case 'STOP_AUTO_INCREMENT':
          if (currentCounter.autoIncrementIntervalId) clearInterval(currentCounter.autoIncrementIntervalId);
          updateHistory(0); // Reset count and update history
          updatedCounter = { ...currentCounter, count: 0, isAutoIncrementing: false, autoIncrementIntervalId: null, history: newHistory };
          break;
        case 'UNDO':
          if (currentCounter.history.length > 1) {
            newHistory.pop();
            newCount = newHistory[newHistory.length - 1].value;
            updatedCounter = { ...currentCounter, count: newCount, history: newHistory };
          }
          break;
        default:
          return state;
      }
      
      const newState = [...state];
      newState[counterIndex] = updatedCounter;
      return newState;
    }
  }
};


export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [counters, dispatch] = useReducer(counterReducer, []);

  useEffect(() => {
    const loadedCounters = loadCountersFromLocalStorage();
    if (loadedCounters.length > 0) {
      dispatch({ type: 'LOAD_COUNTERS', counters: loadedCounters });
    } else {
      // Start with one counter if local storage is empty
      dispatch({ type: 'ADD_COUNTER' });
    }
  }, []);

  useEffect(() => {
    saveCountersToLocalStorage(counters);
  }, [counters]);

  // Clear intervals on unmount or when counters change
  useEffect(() => {
    return () => {
      counters.forEach(counter => {
        if (counter.autoIncrementIntervalId) {
          clearInterval(counter.autoIncrementIntervalId);
        }
      });
    };
  }, [counters]);
  
  // Enhanced dispatch for async actions like auto-increment
  const asyncDispatch = (action) => {
    if (action.type === 'START_AUTO_INCREMENT') {
      // Pass the main dispatch to the reducer action for setInterval callback
      dispatch({...action, asyncDispatch: dispatch});
    } else {
      dispatch(action);
    }
  };


  const getCounterById = (id: string) => counters.find(c => c.id === id);
  const increment = (id: string) => asyncDispatch({ type: 'INCREMENT', id });
  const decrement = (id: string) => asyncDispatch({ type: 'DECREMENT', id });
  const reset = (id: string) => asyncDispatch({ type: 'RESET', id });
  const setStep = (id: string, step: number) => asyncDispatch({ type: 'SET_STEP', id, step });
  const setMin = (id: string, min: number | null) => asyncDispatch({ type: 'SET_MIN', id, min });
  const setMax = (id: string, max: number | null) => asyncDispatch({ type: 'SET_MAX', id, max });
  const setName = (id: string, name: string) => asyncDispatch({ type: 'SET_NAME', id, name });
  const setNotes = (id: string, notes: string) => asyncDispatch({ type: 'SET_NOTES', id, notes });
  const startAutoIncrement = (id: string) => asyncDispatch({ type: 'START_AUTO_INCREMENT', id });
  const pauseAutoIncrement = (id: string) => asyncDispatch({ type: 'PAUSE_AUTO_INCREMENT', id });
  const stopAutoIncrement = (id: string) => asyncDispatch({ type: 'STOP_AUTO_INCREMENT', id });
  const undo = (id: string) => asyncDispatch({ type: 'UNDO', id });
  const addCounter = () => asyncDispatch({ type: 'ADD_COUNTER' });
  const removeCounter = (id: string) => asyncDispatch({ type: 'REMOVE_COUNTER', id });
  

  return (
    <CounterContext.Provider value={{ 
      counters, 
      dispatch: asyncDispatch, // use asyncDispatch here
      getCounterById,
      increment, decrement, reset,
      setStep, setMin, setMax, setName, setNotes,
      startAutoIncrement, pauseAutoIncrement, stopAutoIncrement,
      undo, addCounter, removeCounter
    }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounters = () => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounters must be used within a CounterProvider');
  }
  return context;
};
