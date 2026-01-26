"use client";

import { useState, useCallback, useRef } from "react";
import { DateRange } from "react-day-picker";
import { isBefore, isAfter, isSameDay } from "date-fns";

export interface UseSmartDateRangeOptions {
  /** Initial start date */
  initialFrom?: Date;
  /** Initial end date */
  initialTo?: Date;
}

export function useSmartDateRange(options?: UseSmartDateRangeOptions) {
  const initialRange: DateRange | undefined = options?.initialFrom
    ? { from: options.initialFrom, to: options.initialTo }
    : undefined;

  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  // Track if a complete range was just set (for closing popover)
  const justCompletedRef = useRef(false);

  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    if (!selectedDate) return false;

    const { from: startDate, to: endDate } = dateRange || {};
    justCompletedRef.current = false;

    // Scenario A: First click OR restarting selection (both dates already set)
    if (!startDate || (startDate && endDate)) {
      setDateRange({ from: selectedDate, to: undefined });
      setIsSelectingEnd(true);
      return false; // Not complete
    }

    // Scenario B: Second click (selecting end date)
    if (startDate && !endDate) {
      // Check if selected date is after start date
      if (isAfter(selectedDate, startDate) || isSameDay(selectedDate, startDate)) {
        // Valid range - set end date
        setDateRange({ from: startDate, to: selectedDate });
        setIsSelectingEnd(false);
        justCompletedRef.current = true;
        return true; // Complete - can close
      } else {
        // Edge case: User clicked a date before start date
        // Restart with this new date as start
        setDateRange({ from: selectedDate, to: undefined });
        setIsSelectingEnd(true);
        return false; // Not complete - keep open
      }
    }
    return false;
  }, [dateRange]);

  const handleRangeSelect = useCallback((range: DateRange | undefined): boolean => {
    justCompletedRef.current = false;

    if (!range) {
      setDateRange(undefined);
      setIsSelectingEnd(false);
      return false;
    }

    const currentStart = dateRange?.from;

    // If both dates are the same, treat as single date selected (start)
    if (range.from && range.to && isSameDay(range.from, range.to)) {
      setDateRange({ from: range.from, to: undefined });
      setIsSelectingEnd(true);
      return false; // Not complete
    }

    // Handle range selection
    if (range.from && range.to) {
      // Check if user selected a date BEFORE the current start date
      // This is the "backwards selection" case - RESTART instead of swap
      if (currentStart && isBefore(range.from, currentStart) && !isSameDay(range.from, currentStart)) {
        // User clicked before start date - RESTART with new start, clear end
        setDateRange({ from: range.from, to: undefined });
        setIsSelectingEnd(true);
        return false; // Not complete - keep open for end date selection
      }

      // Normal case: from is before to, set the complete range
      if (isBefore(range.from, range.to)) {
        setDateRange(range);
        setIsSelectingEnd(false);
        justCompletedRef.current = true;
        return true; // Complete - can close
      } else {
        // If somehow to is before from (shouldn't happen with restart logic)
        // Just restart with the "to" date as new start
        setDateRange({ from: range.to, to: undefined });
        setIsSelectingEnd(true);
        return false; // Not complete
      }
    } else if (range.from && !range.to) {
      // First click - set start date
      setDateRange(range);
      setIsSelectingEnd(true);
      return false; // Not complete
    }
    return false;
  }, [dateRange]);

  const clearDates = useCallback(() => {
    setDateRange(undefined);
    setIsSelectingEnd(false);
    justCompletedRef.current = false;
  }, []);

  const isRangeComplete = dateRange?.from && dateRange?.to;

  return {
    dateRange,
    startDate: dateRange?.from,
    endDate: dateRange?.to,
    isSelectingEnd,
    isRangeComplete,
    handleDateSelect,
    handleRangeSelect,
    clearDates,
    setDateRange,
  };
}
