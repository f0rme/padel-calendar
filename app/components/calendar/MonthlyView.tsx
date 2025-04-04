"use client";

import { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { getCalendarDays } from "@/app/lib/calendar-utils";
import { sampleActivities } from "@/app/lib/data";
import ActivityItem from "./ActivityItem";

export default function MonthlyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = getCalendarDays(currentDate, sampleActivities);
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            Next
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] border rounded p-1 ${
              !day.isCurrentMonth ? "bg-gray-50" : ""
            } ${day.isToday ? "border-blue-500" : "border-gray-200"}`}
          >
            <div className="text-right text-sm mb-1">
              <span
                className={`inline-block rounded-full w-7 h-7 text-center leading-7 ${
                  day.isToday ? "bg-blue-500 text-white" : ""
                }`}
              >
                {format(day.date, "d")}
              </span>
            </div>
            <div className="overflow-y-auto max-h-[80px]">
              {day.activities.slice(0, 3).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} compact />
              ))}
              {day.activities.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{day.activities.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 