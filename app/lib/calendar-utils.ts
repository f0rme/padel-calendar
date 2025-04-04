import { Activity, CalendarDay } from "@/app/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  startOfDay,
  endOfDay,
  addDays,
} from "date-fns";

// Generate days for a monthly calendar view (with days from prev/next month for complete weeks)
export const getCalendarDays = (date: Date, activities: Activity[]): CalendarDay[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }); // Week starts on Monday
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start, end }).map((day) => {
    // Get activities for this day
    const dayActivities = activities.filter((activity) => 
      isSameDay(activity.startTime, day)
    );
    
    return {
      date: day,
      activities: dayActivities,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
    };
  });
  
  return days;
};

// Get activities for a specific week
export const getWeekActivities = (date: Date, activities: Activity[]): Activity[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  return activities.filter((activity) => 
    activity.startTime >= start && activity.startTime <= end
  );
};

// Get days for a week
export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

// Get activities for a specific day
export const getDayActivities = (date: Date, activities: Activity[]): Activity[] => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  return activities.filter((activity) => 
    activity.startTime >= dayStart && activity.startTime <= dayEnd
  );
};

// Format time in 12-hour format
export const formatTime = (date: Date): string => {
  return format(date, "h:mm a");
};

// Format date for display
export const formatDate = (date: Date): string => {
  return format(date, "EEEE, MMMM d, yyyy");
};

// Get activity color based on type
export const getActivityColor = (type: Activity["type"]): string => {
  switch (type) {
    case "coaching":
      return "bg-blue-100 border-blue-500 text-blue-700";
    case "activity":
      return "bg-purple-100 border-purple-500 text-purple-700";
    case "court":
      return "bg-green-100 border-green-500 text-green-700";
    case "open_game":
      return "bg-orange-100 border-orange-500 text-orange-700";
    default:
      return "bg-gray-100 border-gray-500 text-gray-700";
  }
}; 