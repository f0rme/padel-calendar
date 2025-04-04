import { Activity, ActivityType } from "@/app/types";
import { addDays, addHours, startOfDay } from "date-fns";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Create activities for a specific date
const createDayActivities = (baseDate: Date, count: number = 3): Activity[] => {
  const activities: Activity[] = [];
  const types: ActivityType[] = ['coaching', 'activity', 'court', 'open_game'];
  
  const startOfTheDay = startOfDay(baseDate);
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const startHour = 9 + Math.floor(Math.random() * 10); // Activities between 9 AM and 7 PM
    const startTime = addHours(startOfTheDay, startHour);
    const endTime = addHours(startTime, 1 + Math.floor(Math.random() * 2)); // 1-2 hours
    
    let title = '';
    let description = '';
    
    switch (type) {
      case 'coaching':
        title = `${startHour <= 12 ? 'Morning' : 'Afternoon'} Coaching Session`;
        description = 'Professional coach-led training session';
        break;
      case 'activity':
        title = 'Padel Event';
        description = 'Organized padel activity with other players';
        break;
      case 'court':
        title = `Court ${1 + Math.floor(Math.random() * 5)}`;
        description = 'Court booking';
        break;
      case 'open_game':
        title = 'Open Game';
        description = 'Join other players for an open game';
        break;
    }
    
    activities.push({
      id: generateId(),
      title,
      type,
      startTime,
      endTime,
      description,
      location: `Court ${1 + Math.floor(Math.random() * 5)}`,
      maxParticipants: type === 'court' ? 4 : (type === 'coaching' ? 6 : 12),
      currentParticipants: Math.floor(Math.random() * 4),
      price: type === 'court' ? 25 : (type === 'coaching' ? 40 : 15)
    });
  }
  
  return activities;
};

// Generate activities for a month
export const generateMonthActivities = (baseDate: Date, days: number = 30): Activity[] => {
  let activities: Activity[] = [];
  
  for (let i = 0; i < days; i++) {
    const dayDate = addDays(baseDate, i);
    // Add more activities on weekends
    const activitiesCount = dayDate.getDay() === 0 || dayDate.getDay() === 6 ? 5 : 3;
    const dayActivities = createDayActivities(dayDate, activitiesCount);
    activities = [...activities, ...dayActivities];
  }
  
  return activities;
};

// Sample activities starting from current date
export const sampleActivities = generateMonthActivities(new Date()); 