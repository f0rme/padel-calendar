export type ActivityType = 'coaching' | 'activity' | 'court' | 'open_game';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
}

export interface Booking {
  id: string;
  activityId: string;
  userId: string;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus?: 'paid' | 'unpaid';
}

export interface CalendarDay {
  date: Date;
  activities: Activity[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
} 