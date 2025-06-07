import type { CounterState } from '@/types';

const COUNTERS_STORAGE_KEY = 'metaCounters';

export const loadCountersFromLocalStorage = (): CounterState[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const serializedState = localStorage.getItem(COUNTERS_STORAGE_KEY);
    if (serializedState === null) {
      return [];
    }
    const storedCounters = JSON.parse(serializedState) as CounterState[];
    // Ensure interval IDs are cleared as they are not valid across sessions
    return storedCounters.map(counter => ({
      ...counter,
      isAutoIncrementing: false,
      autoIncrementIntervalId: null, 
    }));
  } catch (error) {
    console.error("Error loading counters from local storage:", error);
    return [];
  }
};

export const saveCountersToLocalStorage = (counters: CounterState[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    // Don't save interval IDs
    const anitizedCounters = counters.map(({ autoIncrementIntervalId, ...rest }) => rest);
    const serializedState = JSON.stringify(anitizedCounters);
    localStorage.setItem(COUNTERS_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving counters to local storage:", error);
  }
};
