"use client";

import { useState } from "react";
import { format, addWeeks, subWeeks, isSameDay, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { getWeekDays, getWeekActivities, formatTime } from "@/app/lib/calendar-utils";
import { sampleActivities } from "@/app/lib/data";
import ActivityItem from "./ActivityItem";
import { Activity } from "@/app/types";

// Hours to display in the weekly view (9 AM to 9 PM)
const HOURS = Array.from({ length: 13 }, (_, i) => i + 9);

export default function WeeklyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekDays = getWeekDays(currentDate);
  const weekActivities = getWeekActivities(currentDate, sampleActivities);
  
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Group activities by day
  const getActivitiesByDay = (day: Date, activities: Activity[]) => {
    return activities.filter(activity => isSameDay(activity.startTime, day));
  };
  
  // Get activities that start in a specific hour
  const getActivitiesInHour = (day: Date, hour: number, activities: Activity[]) => {
    const dayStart = new Date(day);
    dayStart.setHours(hour, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(hour, 59, 59, 999);
    
    return activities.filter(
      activity => activity.startTime >= dayStart && activity.startTime <= dayEnd
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b mb-2">
            <div className="p-2 border-r text-sm font-medium text-gray-500">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-center">
                <div className="font-medium">{format(day, "EEE")}</div>
                <div className={`text-sm ${isSameDay(day, new Date()) ? "bg-blue-100 rounded-full px-2" : ""}`}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          
          {/* Time grid */}
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
              <div className="p-2 border-r text-xs text-gray-500 text-right pr-3">
                {hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
              
              {weekDays.map((day, index) => {
                const activitiesInHour = getActivitiesInHour(day, hour, weekActivities);
                
                return (
                  <div key={index} className="p-1 border-r relative">
                    {activitiesInHour.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} compact />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 