export interface HistoryEntry {
  value: number;
  timestamp: number;
}

export interface CounterState {
  id: string;
  name: string;
  count: number;
  step: number;
  min: number | null;
  max: number | null;
  notes: string;
  history: HistoryEntry[];
  isAutoIncrementing: boolean;
  autoIncrementIntervalId: NodeJS.Timeout | null;
}

export type CounterAction =
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'RESET'; id: string }
  | { type: 'SET_STEP'; id: string; step: number }
  | { type: 'SET_MIN'; id: string; min: number | null }
  | { type: 'SET_MAX'; id: string; max: number | null }
  | { type: 'SET_NAME'; id: string; name: string }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'START_AUTO_INCREMENT'; id: string }
  | { type: 'PAUSE_AUTO_INCREMENT'; id: string }
  | { type: 'STOP_AUTO_INCREMENT'; id: string }
  | { type: 'UNDO'; id: string }
  | { type: 'ADD_COUNTER' }
  | { type: 'REMOVE_COUNTER'; id:string }
  | { type: 'LOAD_COUNTERS'; counters: CounterState[] };
