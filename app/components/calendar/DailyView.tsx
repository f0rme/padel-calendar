"use client";

import { useState } from "react";
import { addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDayActivities, formatDate } from "@/app/lib/calendar-utils";
import { sampleActivities } from "@/app/lib/data";
import ActivityItem from "./ActivityItem";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DailyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dayActivities = getDayActivities(currentDate, sampleActivities);
  
  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };
  
  // Group activities by time (morning, afternoon, evening)
  const morningActivities = dayActivities.filter(
    (activity) => activity.startTime.getHours() < 12
  );
  
  const afternoonActivities = dayActivities.filter(
    (activity) => activity.startTime.getHours() >= 12 && activity.startTime.getHours() < 17
  );
  
  const eveningActivities = dayActivities.filter(
    (activity) => activity.startTime.getHours() >= 17
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleCalendarSelect}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousDay}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextDay}>
            Next
          </Button>
        </div>
      </div>
      
      {dayActivities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No activities scheduled for this day.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {morningActivities.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Morning</h3>
              {morningActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
          
          {afternoonActivities.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Afternoon</h3>
              {afternoonActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
          
          {eveningActivities.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Evening</h3>
              {eveningActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Calendar icon component
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
} 