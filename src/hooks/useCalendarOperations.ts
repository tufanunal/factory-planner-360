
import { useState } from 'react';
import { Holiday, ShiftTime, DayShiftToggle, CalendarState } from '@/types/all';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';

export function useCalendarOperations(calendarState: CalendarState | null, setCalendarState: React.Dispatch<React.SetStateAction<CalendarState | null>>) {
  
  const addHoliday = async (holiday: Holiday) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          holidays: [...calendarState.holidays, holiday]
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('Holiday added successfully:', holiday);
      }
    } catch (error) {
      console.error('Error adding holiday:', error);
      throw error;
    }
  };

  const removeHoliday = async (id: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          holidays: calendarState.holidays.filter(holiday => holiday.id !== id)
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('Holiday removed successfully:', id);
      }
    } catch (error) {
      console.error('Error removing holiday:', error);
      throw error;
    }
  };

  const addShiftTime = async (shiftTime: ShiftTime) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          shiftTimes: [...calendarState.shiftTimes, shiftTime]
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('Shift time added successfully:', shiftTime);
      }
    } catch (error) {
      console.error('Error adding shift time:', error);
      throw error;
    }
  };

  const updateShiftTime = async (shiftTime: ShiftTime) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          shiftTimes: calendarState.shiftTimes.map(shift => 
            shift.id === shiftTime.id ? shiftTime : shift
          )
        };
        
        console.log("Updating shift time:", shiftTime);
        console.log("Updated calendar state:", updatedCalendarState);
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
      }
    } catch (error) {
      console.error('Error updating shift time:', error);
      throw error;
    }
  };

  const removeShiftTime = async (id: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          shiftTimes: calendarState.shiftTimes.filter(shift => shift.id !== id),
          dayShiftToggles: calendarState.dayShiftToggles.filter(toggle => toggle.shiftTimeId !== id)
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('Shift time removed successfully:', id);
      }
    } catch (error) {
      console.error('Error removing shift time:', error);
      throw error;
    }
  };

  const toggleShift = async (date: string, shiftTimeId: string) => {
    try {
      if (calendarState) {
        const existingToggle = calendarState.dayShiftToggles.find(
          toggle => toggle.date === date && toggle.shiftTimeId === shiftTimeId
        );

        let updatedToggles;
        
        if (existingToggle) {
          updatedToggles = calendarState.dayShiftToggles.map(toggle => {
            if (toggle.date === date && toggle.shiftTimeId === shiftTimeId) {
              return { ...toggle, isActive: !toggle.isActive };
            }
            return toggle;
          });
        } else {
          updatedToggles = [
            ...calendarState.dayShiftToggles,
            {
              id: `${date}-${shiftTimeId}`,
              date,
              shiftTimeId,
              isActive: true
            }
          ];
        }
        
        const updatedCalendarState = {
          ...calendarState,
          dayShiftToggles: updatedToggles
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('Shift toggled successfully:', date, shiftTimeId);
      }
    } catch (error) {
      console.error('Error toggling shift:', error);
      throw error;
    }
  };

  const setViewDate = async (date: string) => {
    try {
      if (calendarState) {
        const updatedCalendarState = {
          ...calendarState,
          viewDate: date
        };
        
        await SqlDatabaseService.setCalendarState(updatedCalendarState);
        setCalendarState(updatedCalendarState);
        console.log('View date updated successfully:', date);
      }
    } catch (error) {
      console.error('Error setting view date:', error);
      throw error;
    }
  };
  
  return {
    addHoliday,
    removeHoliday,
    addShiftTime,
    updateShiftTime,
    removeShiftTime,
    toggleShift,
    setViewDate
  };
}
