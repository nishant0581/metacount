"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import type { CounterState } from '@/types';
import { useCounters } from '@/contexts/CounterContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from '@/components/ui/label';
import { Plus, Minus, RotateCcw, Play, Pause, SquareIcon, Undo2, Trash2, Settings2, History } from 'lucide-react';
import { format } from 'date-fns';

interface CounterProps {
  counterId: string;
}

export function Counter({ counterId }: CounterProps) {
  const { 
    getCounterById, 
    increment, decrement, reset, 
    setStep, setMin, setMax, setName, setNotes,
    startAutoIncrement, pauseAutoIncrement, stopAutoIncrement,
    undo, removeCounter 
  } = useCounters();
  
  const [localCounter, setLocalCounter] = useState<CounterState | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentCounter = getCounterById(counterId);
    if (currentCounter) {
      setLocalCounter(currentCounter);
    }
  }, [counterId, getCounterById]);
  
  // Keep localCounter in sync with context, this is important for auto-increment updates
   useEffect(() => {
    const currentCounter = getCounterById(counterId);
    if (currentCounter) {
      setLocalCounter(currentCounter);
    }
  }, [getCounterById, counterId, getCounterById(counterId)?.count, getCounterById(counterId)?.isAutoIncrementing]);


  if (!isClient || !localCounter) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Loading Counter...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="flex justify-center space-x-2">
              <div className="h-10 w-20 bg-muted rounded"></div>
              <div className="h-10 w-20 bg-muted rounded"></div>
              <div className="h-10 w-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { id, count, step, min, max, name, notes, history, isAutoIncrementing } = localCounter;

  const handleStepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value, 10);
    if (!isNaN(newStep)) setStep(id, newStep > 0 ? newStep : 1);
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMin = e.target.value === '' ? null : parseInt(e.target.value, 10);
    setMin(id, newMin);
  };

  const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMax = e.target.value === '' ? null : parseInt(e.target.value, 10);
    setMax(id, newMax);
  };
  
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(id, e.target.value);
  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNotes(id, e.target.value);

  const countColor = count > 0 ? 'text-green-600 dark:text-green-400' : count < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';

  const progressValue = () => {
    if (max !== null && min !== null && max > min) {
      return ((count - min) / (max - min)) * 100;
    }
    if (max !== null && (min === null || min === 0)) { // Assume min is 0 if not set but max is
      return (count / max) * 100;
    }
    return (count / 100) * 100; // Default to 0-100 range if no proper limits
  };
  
  const canIncrement = max === null || count < max;
  const canDecrement = min === null || count > min;

  return (
    <Card className="w-full max-w-lg shadow-xl rounded-lg overflow-hidden bg-card">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <Input 
            value={name} 
            onChange={handleNameChange} 
            className="text-2xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto font-headline"
            aria-label="Counter name"
          />
          <Button variant="ghost" size="icon" onClick={() => removeCounter(id)} aria-label="Delete counter">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
        <CardDescription className="font-body">
          <Textarea 
            value={notes} 
            onChange={handleNotesChange} 
            placeholder="Add notes..." 
            className="mt-1 text-sm min-h-[40px] focus-visible:ring-ring"
            aria-label="Counter notes"
          />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className={`text-7xl font-bold text-center py-4 transition-colors duration-300 ${countColor} font-headline`}>
          {count}
        </div>

        <div className="space-y-2">
          <Progress value={progressValue()} className="w-full h-3" aria-label="Counter progress" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min !== null ? min : 'Auto Min'}</span>
            <span>{max !== null ? max : 'Auto Max'}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => decrement(id)} disabled={!canDecrement || isAutoIncrementing} className="font-medium py-3" aria-label="Decrement">
            <Minus className="mr-2 h-5 w-5" /> Dec
          </Button>
          <Button onClick={() => reset(id)} disabled={isAutoIncrementing} variant="outline" className="font-medium py-3" aria-label="Reset">
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
          <Button onClick={() => increment(id)} disabled={!canIncrement || isAutoIncrementing} className="font-medium py-3" aria-label="Increment">
            <Plus className="mr-2 h-5 w-5" /> Inc
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="settings">
            <AccordionTrigger className="text-base hover:no-underline">
              <Settings2 className="mr-2 h-5 w-5" /> Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <Label htmlFor={`step-${id}`} className="text-sm">Step Size</Label>
                  <Input id={`step-${id}`} type="number" value={step} onChange={handleStepChange} className="mt-1 w-full" aria-label="Step size"/>
                </div>
                <div>
                  <Label htmlFor={`min-${id}`} className="text-sm">Min Limit</Label>
                  <Input id={`min-${id}`} type="number" value={min === null ? '' : min} onChange={handleMinChange} placeholder="None" className="mt-1 w-full" aria-label="Minimum limit"/>
                </div>
                <div>
                  <Label htmlFor={`max-${id}`} className="text-sm">Max Limit</Label>
                  <Input id={`max-${id}`} type="number" value={max === null ? '' : max} onChange={handleMaxChange} placeholder="None" className="mt-1 w-full" aria-label="Maximum limit"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Auto Increment</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button onClick={() => startAutoIncrement(id)} disabled={isAutoIncrementing} variant="outline" className="py-2 text-xs sm:text-sm" aria-label="Start auto-increment">
                    <Play className="mr-1 h-4 w-4" /> Start
                  </Button>
                  <Button onClick={() => pauseAutoIncrement(id)} disabled={!isAutoIncrementing} variant="outline" className="py-2 text-xs sm:text-sm" aria-label="Pause auto-increment">
                    <Pause className="mr-1 h-4 w-4" /> Pause
                  </Button>
                  <Button onClick={() => stopAutoIncrement(id)} disabled={!isAutoIncrementing} variant="destructive" className="py-2 text-xs sm:text-sm" aria-label="Stop auto-increment">
                    <SquareIcon className="mr-1 h-4 w-4" /> Stop
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="history">
            <AccordionTrigger className="text-base hover:no-underline">
              <History className="mr-2 h-5 w-5" /> History
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {history.length > 1 && (
                <Button onClick={() => undo(id)} variant="outline" size="sm" className="mb-3 w-full" aria-label="Undo last action">
                  <Undo2 className="mr-2 h-4 w-4" /> Undo Last
                </Button>
              )}
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No history yet.</p>
              ) : (
                <ul className="space-y-1 max-h-40 overflow-y-auto text-sm">
                  {history.slice().reverse().map((entry, index) => (
                    <li key={index} className="flex justify-between items-center p-1.5 bg-muted/50 rounded-sm">
                      <span>Value: <span className="font-semibold">{entry.value}</span></span>
                      <span className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'PPpp')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
