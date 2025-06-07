"use client";

import React, { useEffect } from 'react';
import { useCounters } from '@/contexts/CounterContext';
import { Counter } from '@/components/Counter';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';

export function CounterList() {
  const { counters, addCounter } = useCounters();

  // Keyboard shortcut for adding a counter (e.g., Ctrl+Shift+N)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        addCounter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addCounter]);


  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={addCounter} variant="outline" className="shadow-md">
          <ListPlus className="mr-2 h-5 w-5" /> Add New Counter
        </Button>
      </div>
      {counters.length === 0 ? (
         <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No counters yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {counters.map((counter) => (
            <Counter key={counter.id} counterId={counter.id} />
          ))}
        </div>
      )}
    </div>
  );
}
