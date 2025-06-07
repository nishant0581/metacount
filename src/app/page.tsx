"use client";
import React, { useEffect } from 'react';
import { CounterProvider, useCounters } from '@/contexts/CounterContext';
import { CounterList } from '@/components/CounterList';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

function PageContent() {
  const { counters, increment, decrement } = useCounters();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only apply to the first counter for simplicity with keyboard shortcuts
      if (counters.length > 0) {
        const firstCounterId = counters[0].id;
        if (event.key === '+' || event.key === '=') { // '+' often requires Shift
          event.preventDefault();
          increment(firstCounterId);
        } else if (event.key === '-') {
          event.preventDefault();
          decrement(firstCounterId);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          increment(firstCounterId);
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          decrement(firstCounterId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [counters, increment, decrement]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4 sm:p-8 transition-colors duration-300">
      <header className="mb-8">
        <div className="container mx-auto flex justify-between items-center py-4 border-b border-border">
          <h1 className="text-4xl font-bold font-headline text-primary">MetaCount</h1>
          <div className="flex items-center space-x-2">
             <a href="https://github.com/firebase/genkit/tree/main/studio/samples/meta-count" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
              <Button variant="ghost" size="icon">
                <Github className="h-6 w-6" />
              </Button>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto">
        <CounterList />
      </main>

      <footer className="mt-12 py-6 border-t border-border text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MetaCount. Advanced Counting, Simplified.</p>
      </footer>
    </div>
  );
}


export default function Home() {
  return (
    <CounterProvider>
      <PageContent />
    </CounterProvider>
  );
}
